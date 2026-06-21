const FONT_PROBE_BYTES = "bytes=0-15";

export const CANONICAL_GL_MIDDLE_FONT_FAMILY = "GL-Nummernschild-Mtl";
export const CANONICAL_GL_NARROW_FONT_FAMILY = "GL-Nummernschild-Eng";

const PLATE_FONT_CANDIDATES = [
    {
        key: "gl-mtl-hacs",
        role: "mtl",
        source: "gl",
        family: "TuevPlateGLMtlHacs",
        weight: 400,
        format: "truetype",
        url: "/hacsfiles/tuev-card/fonts/GL-Nummernschild-Mtl.ttf"
    },
    {
        key: "gl-eng-hacs",
        role: "eng",
        source: "gl",
        family: "TuevPlateGLEngHacs",
        weight: 400,
        format: "truetype",
        url: "/hacsfiles/tuev-card/fonts/GL-Nummernschild-Eng.ttf"
    },
    {
        key: "gl-mtl-local-community",
        role: "mtl",
        source: "gl",
        family: "TuevPlateGLMtlLocalCommunity",
        weight: 400,
        format: "truetype",
        url: "/local/community/tuev-card/fonts/GL-Nummernschild-Mtl.ttf"
    },
    {
        key: "gl-eng-local-community",
        role: "eng",
        source: "gl",
        family: "TuevPlateGLEngLocalCommunity",
        weight: 400,
        format: "truetype",
        url: "/local/community/tuev-card/fonts/GL-Nummernschild-Eng.ttf"
    },
    {
        key: "gl-mtl-local-package",
        role: "mtl",
        source: "gl",
        family: "TuevPlateGLMtlLocalPackage",
        weight: 400,
        format: "truetype",
        url: "/local/tuev-card/fonts/GL-Nummernschild-Mtl.ttf"
    },
    {
        key: "gl-eng-local-package",
        role: "eng",
        source: "gl",
        family: "TuevPlateGLEngLocalPackage",
        weight: 400,
        format: "truetype",
        url: "/local/tuev-card/fonts/GL-Nummernschild-Eng.ttf"
    },
    {
        key: "gl-mtl-local-root",
        role: "mtl",
        source: "gl",
        family: "TuevPlateGLMtlLocalRoot",
        weight: 400,
        format: "truetype",
        url: "/local/GL-Nummernschild-Mtl.ttf"
    },
    {
        key: "gl-eng-local-root",
        role: "eng",
        source: "gl",
        family: "TuevPlateGLEngLocalRoot",
        weight: 400,
        format: "truetype",
        url: "/local/GL-Nummernschild-Eng.ttf"
    },
    {
        key: "europlate-local-root",
        role: "legacy",
        source: "europlate",
        family: "EuroPlate",
        weight: 700,
        format: "truetype",
        url: "/local/EuroPlate.ttf"
    }
];

let plateFontInjected = false;
let plateFontLoadPromise = null;
let availablePlateFonts = [];

function hasValidFontSignature(buffer) {
    if (!buffer || buffer.byteLength < 4) {
        return false;
    }

    const bytes = new Uint8Array(buffer.slice(0, 4));
    const signature = String.fromCharCode(...bytes);

    return (
        signature === "ttcf" ||
        signature === "OTTO" ||
        signature === "true" ||
        (bytes[0] === 0x00 && bytes[1] === 0x01 && bytes[2] === 0x00 && bytes[3] === 0x00)
    );
}

function withCacheBuster(url) {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}v=${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function canonicalFamilyForRole(role) {
    if (role === "eng") return CANONICAL_GL_NARROW_FONT_FAMILY;
    if (role === "mtl") return CANONICAL_GL_MIDDLE_FONT_FAMILY;
    return null;
}

function canonicalFontFaceSrc(role) {
    const urls = PLATE_FONT_CANDIDATES
        .filter((candidate) => candidate.source === "gl" && candidate.role === role)
        .map((candidate) => `url("${candidate.url}") format("${candidate.format || 'truetype'}")`);

    return urls.join(",\n                ");
}

async function checkCandidateAvailable(candidate) {
    try {
        const response = await fetch(withCacheBuster(candidate.url), {
            method: "GET",
            cache: "no-store",
            headers: {
                "Cache-Control": "no-cache, no-store, must-revalidate",
                Pragma: "no-cache",
                Range: FONT_PROBE_BYTES
            }
        });

        if (!response.ok) {
            return null;
        }

        const buffer = await response.arrayBuffer();
        return hasValidFontSignature(buffer) ? candidate : null;
    } catch (error) {
        return null;
    }
}

export async function checkPlateFontAvailable() {
    injectPlateFont();

    const results = await Promise.all(PLATE_FONT_CANDIDATES.map((candidate) => checkCandidateAvailable(candidate)));
    availablePlateFonts = results.filter(Boolean);
    plateFontLoadPromise = null;

    return availablePlateFonts.length > 0;
}

export function getPlateFontStatus() {
    return {
        available: availablePlateFonts.length > 0,
        hasGlFont: availablePlateFonts.some((candidate) => candidate.source === "gl"),
        hasMtlFont: availablePlateFonts.some((candidate) => candidate.role === "mtl"),
        hasEngFont: availablePlateFonts.some((candidate) => candidate.role === "eng"),
        hasLegacyEuroPlate: availablePlateFonts.some((candidate) => candidate.source === "europlate"),
        fonts: [...availablePlateFonts]
    };
}

export function getPlateFontVariantForText(text) {
    const cleanLength = String(text || "").replace(/\s/g, "").length;
    const preferEng = cleanLength >= 8;
    const findAvailable = (role) => availablePlateFonts.find((candidate) => candidate.role === role);
    const findSource = (source) => availablePlateFonts.find((candidate) => candidate.source === source);

    if (preferEng) {
        return findAvailable("eng") || findAvailable("mtl") || findSource("europlate") || getDefaultPlateFontVariant();
    }

    return findAvailable("mtl") || findAvailable("eng") || findSource("europlate") || getDefaultPlateFontVariant();
}

export function getDefaultPlateFontVariant() {
    return PLATE_FONT_CANDIDATES[0];
}

export function isPlateFontLoaded() {
    if (!document.fonts || typeof document.fonts.check !== "function") {
        return false;
    }

    return availablePlateFonts.length > 0 &&
        availablePlateFonts.every((candidate) => document.fonts.check(`${candidate.weight} 16px "${candidate.family}"`));
}

export function ensurePlateFont(onReady) {
    injectPlateFont();

    if (!document.fonts || typeof document.fonts.load !== "function") {
        if (typeof onReady === "function") {
            window.setTimeout(onReady, 0);
        }

        return;
    }

    if (!plateFontLoadPromise) {
        const candidates = availablePlateFonts.length > 0
            ? availablePlateFonts
            : PLATE_FONT_CANDIDATES;

        plateFontLoadPromise = Promise.allSettled(candidates.map((candidate) => (
            document.fonts.load(`${candidate.weight} 16px "${candidate.family}"`)
        )));
    }

    plateFontLoadPromise.then(() => {
        if (typeof onReady === "function") {
            onReady();
        }
    }).catch(() => {
        plateFontLoadPromise = null;

        if (typeof onReady === "function") {
            onReady();
        }
    });
}

export function injectPlateFont() {
    if (plateFontInjected) {
        return;
    }

    plateFontInjected = true;

    const canonicalMiddleSrc = canonicalFontFaceSrc("mtl");
    const canonicalNarrowSrc = canonicalFontFaceSrc("eng");
    const canonicalFaces = [
        canonicalMiddleSrc ? `
        @font-face {
            font-family: "${CANONICAL_GL_MIDDLE_FONT_FAMILY}";
            src: ${canonicalMiddleSrc};
            font-weight: 400;
            font-style: normal;
            font-display: swap;
        }` : "",
        canonicalNarrowSrc ? `
        @font-face {
            font-family: "${CANONICAL_GL_NARROW_FONT_FAMILY}";
            src: ${canonicalNarrowSrc};
            font-weight: 400;
            font-style: normal;
            font-display: swap;
        }` : ""
    ].filter(Boolean).join("\n");

    const candidateFaces = PLATE_FONT_CANDIDATES.map((candidate) => `
        @font-face {
            font-family: "${candidate.family}";
            src: url("${candidate.url}") format("${candidate.format || 'truetype'}");
            font-weight: ${candidate.weight};
            font-style: normal;
            font-display: swap;
        }
    `).join("\n");

    const style = document.createElement("style");
    style.textContent = `${canonicalFaces}\n${candidateFaces}`;

    document.head.appendChild(style);
}

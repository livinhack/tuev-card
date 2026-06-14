export function renderButton({ id = null, disabled, text, extraAttributes = "" }) {
    const enabled = !disabled;
    const idAttribute = id ? `id="${id}"` : "";

    return `
        <button
            ${idAttribute}
            class="tuev-editor-pill-button"
            type="button"
            ${extraAttributes}
            ${enabled ? "" : "disabled"}
        >
            ${text}
        </button>
    `;
}

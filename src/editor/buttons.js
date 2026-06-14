export function renderButton({ id = null, disabled, text, active = true, extraAttributes = "" }) {
    const enabled = !disabled;
    const activeClass = active ? "" : " is-inactive";
    const idAttribute = id ? `id="${id}"` : "";

    return `
        <button
            ${idAttribute}
            class="tuev-editor-pill-button${activeClass}"
            type="button"
            ${extraAttributes}
            ${enabled ? "" : "disabled"}
        >
            ${text}
        </button>
    `;
}

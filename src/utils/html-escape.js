// TÜV Reminder Card b355 / shared HTML escaping helpers
// Centralises escaping for Card/Editor HTML-string rendering. SVG escaping stays
// separate in plate/lab-renderer/svg-escape-utils.js because the contexts differ.

export function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}

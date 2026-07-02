# b354 Editor Preview Layout Diagnostics

b354 is a diagnostic-only checkpoint.

The previous b351 force-scale contract did not visibly change the remaining Home Assistant editor-preview clipping. To avoid guessing, b354 adds a visible diagnostic overlay in the editor preview.

The overlay reports the key layout values used by `getLayoutContext()`:

- `measured`
- `rawVisible`
- `visible`
- `sim`
- `layout`
- `scaled`
- `scale`
- `reason`
- `plate`
- `cols`

No renderer geometry or Card feature behavior is changed.

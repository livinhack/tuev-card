# b326 – HU Badge Full Renderer Lab Test

Lab-first test for placing the existing full TÜV badge renderer into the 35 mm HU seal slot.

## Scope

- The standalone Physical Lab has an opt-in full HU badge path via `huBadgeRenderer: "full"`.
- The active Card renderer remains visually unchanged in b326 because the Card does not opt into the full HU badge path yet.
- The staged Card renderer copy is kept in sync so later activation can be done without path drift.

## Notes

- The existing blue HU placeholder remains the default path without `huBadgeRenderer: "full"`.
- This step intentionally does not fix the Card HU color yet; it tests the full badge rendering inside the 35 mm Lab slot first.

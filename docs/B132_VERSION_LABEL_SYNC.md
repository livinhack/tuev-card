# b132 Version Label Sync

## Purpose

b131 contained the new two-line season measurement helper, but several visible Lab labels and source import cache-buster query suffixes still displayed `b130`. This made an extracted b131 package look like b130 even though the b131 code was present.

## Changes

- Updated package version to `0.1.1-b132`.
- Updated visible Physical Lab title/version labels to b132.
- Updated active source import query suffixes from `?v=b130` to `?v=b135`.
- Kept the b131 measured season calibration code.
- Kept the b128/b130 two-line seal geometry; the b129 seal-circle change remains discarded.
- No renderer geometry changed in this step.

## Scope

Two-line and season rendering remain Lab-only. The production Card remains on the stable one-line renderer path. ChatGPT ZIPs still do not include font binary files.

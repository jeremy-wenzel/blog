# Footer Spec Alignment

- **Date:** 2026-05-15T19:19:50.476-07:00
- **By:** Rusty
- **What:** Align the final footer slice to the approved restrained spec by keeping the flex shell untouched and requiring `.site-footer` to use `position: sticky`, `bottom: 0`, `z-index: 10`, `background: var(--main)`, and `border-top: 1px solid #555`.
- **Why:** This closes the last footer review gap without reopening the reading/listing work, and the targeted footer test now protects the exact contract that was approved.

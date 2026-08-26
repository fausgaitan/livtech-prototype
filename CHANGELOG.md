# Changelog

UX-focused release notes for the Livtech UI prototype.

## 2026-08-26 — Sidebar & Navigation

### Fixed
- **Collapsed sidebar submenus now work in every style.** Hovering Clinical or CRM in the collapsed rail opens the submenu flyout in Option C, matching Options A and B. (Option C's frosted-glass treatment was silently trapping the popover inside the rail.)

### New
- **Icon tooltips in the collapsed sidebar.** Hovering any icon without a submenu (EMAR / Medication, Risk Management, Analytics, Settings, Help & Support) shows a styled tooltip naming it, so the icon rail is never a guessing game. Tooltips match each style: white cards in the light options, brand purple in Option A.
- **Collapse and Expand are always visible.** The collapse control at the bottom of the sidebar no longer waits for a hover to appear, in both the expanded and collapsed states. Easier to discover, one less hidden interaction.

### Also updated
- Guided tour copy reflects the new behavior: "Click Collapse at the bottom of the sidebar" and "Hover the icons for tooltips and submenus."

## 2026-08-24 — Welcome Experience & Feedback Funnel

### New
- **Three-panel welcome intro.** Reviewers land on a paged modal (what this is → your input is key → prototype disclaimer) instead of dropping straight into the tour. Big type, one idea per panel, clickable progress dots.
- **Choreographed entrance.** Blurred backdrop, springy panel pop, aurora glow behind the panel, staggered content reveal, and a gradient shimmer title. Plays once; panel changes use a quick crossfade. All motion stands down under reduced-motion settings.
- **Persistent vote nudge.** Anyone who skips the intro or closes the tour early gets a bottom-center "Vote on the 3 styles" pill that follows them until feedback is submitted, then retires for good.
- **Prototype disclaimer.** The intro sets expectations that most components (tabs, buttons, links) are not clickable; reviewers are judging look and feel.

### Changed
- **Feedback is attributed, not anonymous.** The name step asks directly for a name; the "stay anonymous" option was removed. Personalized `?name=` links pre-fill the greeting and attribution.
- Copy no longer claims a "two-minute" tour.

## 2026-08-24 — Initial Prototype
- Livtech UI in three visual directions (A: High Contrast, B: Minimalistic, C: Subtle Gradient) across the CRM Dashboard and Clinical Prospects screens.
- Guided visual tour with favorite / least favorite voting, feedback capture to Google Sheets, and a UX-details tour covering the sidebar, product switcher, modals, and drawers.

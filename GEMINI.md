# Project Instructions: Zero Theme Gallery

## Design System

### 8-Point Grid Rule
All UI components and CSS styles must strictly adhere to the **8-point grid system**. This applies to:
- **Spacing:** Padding, margins, and gaps.
- **Sizing:** Heights and widths (where applicable).
- **Layout:** Grid columns and rows spacing.

**Allowed increments (n * 8px):**
8px, 16px, 24px, 32px, 40px, 48px, 56px, 64px, etc.

**Exceptions:**
- 4px can be used for very tight spacing (e.g., small icons, tight text blocks).
- 1px or 2px for borders and dividers.
- Responsive values (like `5vw` or `92vw`) are allowed for fluid layouts.
- Line heights should be optimized for readability but ideally also align with the grid if possible.

**Action Item:**
Refactor existing CSS in `app/globals.css` and Tailwind classes in components to align with this rule.
- `12px` -> `8px` or `16px`
- `14px` -> `16px`
- `18px` -> `16px` or `24px`
- `20px` -> `16px` or `24px`
- `22px` -> `24px`
- `28px` -> `32px` or `24px`
- `42px` -> `40px` or `48px`
- etc.

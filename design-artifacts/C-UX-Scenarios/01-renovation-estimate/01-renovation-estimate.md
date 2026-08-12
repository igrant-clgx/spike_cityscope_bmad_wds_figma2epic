# Scenario 01 - Renovation Estimate

## Goal

Help a visitor identify a property, describe the intended renovation, and understand an indicative renovation-cost range and available next actions.

## Flow

1. [01.1 Address Search](pages/01.1-address-search/01.1-address-search.md)
2. [01.2 Renovation Details](pages/01.2-renovation-details/01.2-renovation-details.md)
3. [01.3 Estimate Result](pages/01.3-estimate-result/01.3-estimate-result.md)

## Source

- [Figma - Spike Reno Calculator](https://www.figma.com/design/Q0fDj1AKMbwyPJRmPltox0/Spike-Reno-Calculator?node-id=0-1&p=f&m=dev)
- Reference viewport: desktop, approximately 1512 px wide.
- The Figma file was imported from an existing web implementation; layer names indicate React and Material UI origins.

## Shared Decisions

- Responsive web, keyboard and touch operable.
- English-only content for the current scope.
- Page-specific component specifications because WDS design-system mode is `none`.
- Semantic tokens, not arbitrary pixel values, govern spacing, color, typography, focus, and state styling.
- The supplied desktop frames are authoritative for visible content; missing expanded content is not inferred.


# Multi-Scene Plan (Shelved)

This plan was shelved in favor of a continuous scrolling animation approach.
Preserved here in case we want to revert.

## Scene Structure (11 scenes → 10 scenes after WPM removal)

| Scene | File | Frames |
|-------|------|--------|
| AppIntro | `AppIntro.tsx` | 60 |
| StreamingTextDemo | `StreamingTextDemo.tsx` | 120 |
| AnchorDemo | `AnchorDemo.tsx` | 90 |
| FontVariations | `FontVariations.tsx` | 90 |
| SizeVariations | `SizeVariations.tsx` | 60 |
| ColorVariations | `ColorVariations.tsx` | 108 (+20%) |
| ThemeVariations | `ThemeVariations.tsx` | 90 (+20%) |
| ~~WpmDemo~~ | ~~`WpmDemo.tsx`~~ | ~~removed~~ |
| InternationalDemo | `InternationalDemo.tsx` | 126 (+20%) |
| TextAreaDemo | `TextAreaDemo.tsx` | 90 (+20%) |
| EndCard | `EndCard.tsx` | 72 (+20%) |
| **Sum** | | **846** |

- 9 transitions × 20 frames = 180 subtracted
- Net: **666 frames = 22.2s**

## Pending changes that were NOT applied
- Remove WpmDemo from Main.tsx (import + sequence block)
- Update Root.tsx durationInFrames from 660 → 666
- Lengthen ColorVariations 90→108, ThemeVariations 75→90, InternationalDemo 105→126, TextAreaDemo 75→90, EndCard 60→72

## Why shelved
User decided to pivot to a single continuous scrolling animation scene where
text runs the full clip and font/size/color/theme properties animate live,
rather than discrete scene-per-feature approach.

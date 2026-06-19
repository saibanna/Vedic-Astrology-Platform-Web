# Hidden Menu Bar Items

> **Date Hidden**: 2026-06-19
> **Reason**: Temporarily hidden to simplify the UI. The Home page (Birth Chart / Kundali generator) continues to work as-is. All routes remain functional — only the navigation dropdown menus in the top bar are hidden.

To re-enable any group or individual link, edit `src/components/Layout.tsx` and move items from the `HIDDEN_NAV_GROUPS` array back into the `NAV_GROUPS` array (or set `hidden: false` if using a flag approach).

---

## Menu Group 1: Kundali (Compass icon)

| # | Label | Route | Status |
|---|-------|-------|--------|
| 1 | Birth Chart (Kundali) | `/` | **Hidden** (Home page itself still works) |
| 2 | Navamsa (D9) Chart | `/navamsa` | Hidden |
| 3 | Divisional Charts (D3/D7/D10) | `/divisional-charts` | Hidden |
| 4 | Vimshottari Dasha | `/dasha` | Hidden |
| 5 | Transit Report | `/transit-report` | Hidden |
| 6 | Planetary Aspects | `/planetary-aspects` | Hidden |
| 7 | Ashtakavarga | `/ashtakavarga` | Hidden |
| 8 | Varshphal (Solar Return) | `/varshphal` | Hidden |
| 9 | Ascendant & Moon Sign | `/ascendant-moon-sign` | Hidden |
| 10 | Nakshatra Finder | `/nakshatra-finder` | Hidden |
| 11 | Nakshatra Encyclopedia | `/nakshatra-encyclopedia` | Hidden |
| 12 | Atmakaraka | `/atmakaraka` | Hidden |
| 13 | Ishta Devta | `/ishta-devta` | Hidden |
| 14 | Dhan Yoga | `/dhan-yoga` | Hidden |
| 15 | Baby Name Suggestion | `/baby-name` | Hidden |

## Menu Group 2: Doshas (ShieldAlert icon)

| # | Label | Route | Status |
|---|-------|-------|--------|
| 1 | Manglik Dosha | `/manglik-dosha` | Hidden |
| 2 | Kaal Sarp Dosha | `/kaal-sarp-dosha` | Hidden |
| 3 | Sade Sati | `/sade-sati` | Hidden |
| 4 | Pitra Dosha | `/pitra-dosha` | Hidden |

## Menu Group 3: Remedies (ShoppingBag icon)

| # | Label | Route | Status |
|---|-------|-------|--------|
| 1 | Find My Gemstone | `/find-my-gemstone` | Hidden |
| 2 | Rudraksha Suggestion | `/rudraksha-suggestion` | Hidden |
| 3 | Pujas & Remedies Shop | `/remedies` | Hidden |

## Menu Group 4: Horoscope (Sun icon)

| # | Label | Route | Status |
|---|-------|-------|--------|
| 1 | Daily / Weekly / Monthly / Yearly | `/horoscope` | Hidden |
| 2 | Numerology Calculator | `/numerology` | Hidden |
| 3 | Name Correction | `/name-correction` | Hidden |
| 4 | Biorhythm Calculator | `/biorhythm` | Hidden |
| 5 | Love Compatibility | `/love-compatibility` | Hidden |
| 6 | Download Kundali PDF | `/kundali-report` | Hidden |
| 7 | ✨ AI Chart Reading | `/ai-reading` | Hidden |

## Menu Group 5: Consult (Calendar icon)

| # | Label | Route | Status |
|---|-------|-------|--------|
| 1 | Book Astrologer | `/astrologers` | Hidden |
| 2 | Kundali Matching | `/kundali-matching` | Hidden |
| 3 | Daily Panchang | `/panchang` | Hidden |
| 4 | Hora Muhurta | `/hora-muhurta` | Hidden |
| 5 | Chaughadiya | `/chaughadiya` | Hidden |
| 6 | Yogini Dasha | `/yogini-dasha` | Hidden |
| 7 | Festival Calendar 2026 | `/festival-calendar` | Hidden |

## Other Nav Items (auth-gated, also hidden)

| # | Label | Route | Condition | Status |
|---|-------|-------|-----------|--------|
| 1 | Live Session | `/consultation/active` | Authenticated users | Hidden |
| 2 | Admin | `/admin` | Admin users only | Hidden |

---

## How to Re-enable

In `src/components/Layout.tsx`:

1. The dropdown nav groups are rendered from the `NAV_GROUPS` array (lines ~11–73).
2. They are currently hidden via `{/* HIDDEN NAV GROUPS */}` comment wrapping.
3. To show a specific group, uncomment the rendering block and filter `NAV_GROUPS` to only include the desired group labels.
4. Auth-gated items (Live Session, Admin) are hidden via the same comment block.

**Example — show only the "Kundali" and "Doshas" dropdowns:**
```tsx
{NAV_GROUPS
  .filter(g => ['Kundali', 'Doshas'].includes(g.label))
  .map(group => ( /* ... existing dropdown render code ... */ ))}
```

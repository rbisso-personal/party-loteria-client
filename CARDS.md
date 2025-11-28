# Card System - Player Client

## Overview

The player client displays card images on the tabla (player board) and must support multiple card packs for DLC content.

## Card Image Requirements

### File Format & Location
- **Format**: WebP (optimized for web)
- **Location**: `public/cards/{packId}/`
- **Naming**: `{id}_{name}.webp` (e.g., `01_El_Gallo.webp`)

### Image Specifications
- **Aspect Ratio**: 1:1.36 (width:height) or 0.737 (1509:2048 pixels)
- **Recommended Size**: 512x695 pixels (WebP optimized)
- **Color Space**: sRGB
- **Optimization**: Use lossy WebP compression (quality 80-85) for best performance

## Tabla Grid Layout

The tabla uses a 4x4 grid (16 cards) with cells sized to match card aspect ratio:

```tsx
<div className="grid grid-cols-4 gap-1.5 w-full max-w-lg">
  <button style={{ aspectRatio: '0.737' }}>
    <img src={`/cards/${packId}/${card.image}.webp`} />
  </button>
</div>
```

### Layout Features
- **Aspect Ratio**: Each cell uses `aspectRatio: '0.737'` to match card proportions
- **Responsive**: Grid scales to fit screen width (max-width: 32rem / 512px)
- **Spacing**: 6px gap between cards (`gap-1.5`)
- **Lazy Loading**: Images use `loading="lazy"` for performance

## Adding New Card Packs (DLC)

### Step 1: Add Card Images

Create a new directory for the pack:
```
public/
  cards/
    base/          # Base game (54 cards)
    halloween/     # Example DLC pack
    navidad/       # Example DLC pack
```

Add WebP images following the naming convention:
```
public/cards/halloween/
  01_La_Bruja.webp
  02_El_Vampiro.webp
  ...
```

### Step 2: Card Data Structure

The card data comes from the server. Each card object has:

```typescript
interface Card {
  id: number
  name_es: string
  name_en: string
  verse_es: string
  verse_en: string
  image: string      // e.g., "01_La_Bruja" (no extension, no pack path)
  vo_es: string
  vo_en: string
}
```

### Step 3: Image Path Construction

The client constructs the full image path:

```tsx
// In Tabla.tsx
const packId = 'base' // TODO: Get from game state
<img src={`/cards/${packId}/${card.image}.webp`} />
```

**Current Limitation**: Pack ID is hardcoded to `'base'`. Future enhancement needed:
1. Add `packId` or `pack` field to game state
2. Pass pack info when tabla is assigned
3. Use dynamic pack in image path

## Image Loading Best Practices

### Performance
- **Lazy Loading**: All images use `loading="lazy"` attribute
- **Object Cover**: Images use `object-cover` to fill cell without distortion
- **No Preloading**: Let browser handle loading as cards scroll into view

### Error Handling
- **Alt Text**: Always provide localized card names as alt text
- **Fallback**: Consider adding error handling for missing images:

```tsx
<img
  src={`/cards/${packId}/${card.image}.webp`}
  alt={getCardName(cell.card)}
  onError={(e) => {
    // Fallback to placeholder or base pack
    e.currentTarget.src = '/cards/placeholder.webp'
  }}
/>
```

## Visual States

Cards have three visual states:

1. **Normal**: Card image visible
2. **Drawn but Not Marked**: Green ring animation (`ring-2 ring-green-500 animate-pulse`)
3. **Marked**: Amber ring + checkmark overlay (`ring-4 ring-amber-500`)

## Testing New Card Packs

1. **Add Images**: Place WebP files in `public/cards/{packId}/`
2. **Update Card Data**: Server must send correct card data with image field
3. **Test Loading**: Verify images load in browser DevTools (Network tab)
4. **Test Aspect Ratio**: Ensure cells maintain 1:1.36 ratio on all screen sizes
5. **Test Performance**: Check lazy loading works (images load as user scrolls)

## Future Enhancements

### Dynamic Pack Selection
- Add pack selector in lobby (STB/host chooses pack)
- Server sends `packId` with tabla assignment
- Client loads images from correct pack directory

### Pack Mixing
- Allow mixing cards from multiple packs in one game
- Each card object needs `packId` or full image path
- Client loads from different directories per card

### Downloadable Content
- Consider downloading packs on-demand (Service Worker)
- Cache images locally for offline play
- Show download progress in lobby

## File Structure Reference

```
player-client/
  public/
    cards/
      base/
        01_El_Gallo.webp
        02_El_Diablito.webp
        ...
        54_La_Rana.webp
      {dlc-pack-id}/
        01_Card_Name.webp
        ...
  src/
    components/
      Tabla.tsx          # Main tabla component - renders card grid
      GameScreen.tsx     # Game screen container
    types/
      index.ts           # Card type definitions
```

## Quick Reference

| Property | Value |
|----------|-------|
| Aspect Ratio | 1:1.36 (0.737) |
| Format | WebP |
| Grid | 4x4 (16 cards) |
| Location | `public/cards/{packId}/` |
| Naming | `{id}_{name}.webp` |
| Cell Spacing | 6px (`gap-1.5`) |

# Demo Data - Product Import Files

This folder contains product CSV files for each theme preset. Import these into your demo stores to showcase the theme with relevant products.

## Files

| File | Preset | Products | Description |
|------|--------|----------|-------------|
| `products-default.csv` | Default | 20 | Lifestyle & home goods (candles, blankets, vases, decor) |
| `products-glow.csv` | Glow | 20 | Beauty & skincare (serums, creams, masks, tools) |
| `products-bold.csv` | Bold | 20 | Streetwear & athletic (hoodies, sneakers, caps, bags) |
| `products-noir.csv` | Noir | 20 | Luxury goods (watches, jewelry, leather goods, fragrances) |
| `products-edge.csv` | Edge | 20 | Tech & modern accessories (earbuds, cases, chargers, backpacks) |

## Price Ranges

- **Default**: $22 - $425
- **Glow**: $22 - $72
- **Bold**: $24 - $128
- **Noir**: $48 - $795
- **Edge**: $12 - $279

## How to Import

1. Go to your Shopify admin
2. Navigate to **Products** → **Import**
3. Upload the appropriate CSV file for your preset
4. Review the import preview
5. Click **Import products**

## Image URLs

The CSV files use Unsplash image URLs as placeholders. These should work for demo purposes, but you may want to:

1. **Download and re-upload**: For production, download images and upload to Shopify's CDN
2. **Replace with your own**: Update the `Image Src` column with your own product photography
3. **Use Shopify's image editor**: After import, use Shopify's built-in tools to crop/optimize

## Product Structure

Each CSV includes:
- **Single variant products**: Simple items without options
- **Size variants**: S, M, L, XL (apparel)
- **Color variants**: 2-4 color options per product
- **Size + Color variants**: Products with both options (e.g., hoodies)

## Customization Tips

1. **Update vendor names**: Change vendor names to match your demo store branding
2. **Adjust prices**: Modify prices to match your target market/currency
3. **Add more variants**: Duplicate rows to add additional sizes or colors
4. **Update descriptions**: Customize product descriptions for your niche

## Collections

After importing, create collections to organize products:

### Suggested Collections per Preset

**Default**:
- Home Decor
- Kitchen & Dining
- Bedroom & Bath
- Candles & Fragrance

**Glow**:
- Skincare
- Makeup
- Body Care
- Tools & Accessories

**Bold**:
- Hoodies & Sweatshirts
- T-Shirts
- Footwear
- Accessories

**Noir**:
- Watches
- Jewelry
- Leather Goods
- Fragrances

**Edge**:
- Audio
- Phone Accessories
- Desk Setup
- Travel Tech

## Notes

- All products have `status: active` and are set to published
- Inventory is set to reasonable quantities (5-80 units)
- Compare at prices are included for sale displays
- Tags are included for filtering and search
- SKUs follow a consistent naming convention

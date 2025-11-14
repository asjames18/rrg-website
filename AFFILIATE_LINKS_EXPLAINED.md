# How Affiliate Links Work with Books

## 📖 Overview

The book system supports **primary affiliate links** and **alternative links** to give users multiple purchasing options while generating revenue through affiliate commissions.

---

## 🔗 Affiliate Link Structure

### Primary Affiliate Link

Each book has **one primary affiliate link** that consists of three components:

1. **Affiliate URL** (`affiliate_url`) - *Required*
   - The actual affiliate link URL (e.g., `https://amazon.com/dp/B08XYZ123?tag=your-affiliate-id`)
   - Must be a valid URL
   - This is the main purchase button users see

2. **Affiliate Label** (`affiliate_label`) - *Optional*
   - Custom button text (e.g., "Get the book", "Buy on Amazon", "Purchase Now")
   - Defaults to "Buy Now" if not provided
   - Displayed on the purchase button

3. **Affiliate Merchant** (`affiliate_merchant`) - *Optional*
   - The merchant name (e.g., "amazon", "christianbook", "barnesandnoble")
   - Used for display purposes and merchant logos
   - Defaults to "amazon" if not provided
   - Options: `amazon`, `christianbook`, `barnesandnoble`, `other`

### Alternative Links

Books can have **multiple alternative links** for additional purchasing options:

- Each alternative link has:
  - **Label** - Button text (e.g., "Buy on ChristianBook")
  - **URL** - The affiliate link
  - **Merchant** - Merchant identifier

---

## 💾 Database Storage

### In Supabase `books` Table

The affiliate data is stored in separate columns:

```sql
affiliate_url        TEXT        -- The affiliate link URL
affiliate_label      TEXT        -- Button label text
affiliate_merchant   TEXT        -- Merchant name (amazon, christianbook, etc.)
```

### Alternative Links Storage

Alternative links are stored in the `metadata` JSON field:

```json
{
  "alternativeLinks": [
    {
      "label": "Buy on ChristianBook",
      "url": "https://christianbook.com/...",
      "merchant": "christianbook"
    }
  ]
}
```

---

## 🎨 Frontend Display

### 1. Book List/Card View (`BookCard.tsx`)

**Primary Affiliate Button:**
- Large, prominent orange/amber button
- Shows merchant logo (if available)
- Displays the affiliate label
- Opens in new tab with `target="_blank"` and `rel="noopener noreferrer"`

**Alternative Links:**
- Smaller gray buttons below the primary button
- Display merchant name or logo
- Shown in a horizontal row if multiple exist

**Example:**
```tsx
<a 
  href={book.data.affiliate.url}
  target="_blank"
  rel="noopener noreferrer"
  className="bg-amber-700 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-lg"
>
  <span>{getMerchantLogo(book.data.affiliate.merchant)}</span>
  <span>{book.data.affiliate.label}</span>
  <svg>...</svg> {/* External link icon */}
</a>
```

### 2. Book Detail Page (`/books/[slug]`)

**Primary Button:**
- Large, centered button at the top of the sidebar
- Full width on mobile
- Most prominent call-to-action

**Alternative Links:**
- Displayed below the primary button
- Each in its own button
- Smaller, secondary styling

**Merchant Attribution:**
- Small text below buttons: "via {merchant name}"

**Example:**
```astro
<a 
  href={book.affiliate.url}
  target="_blank"
  rel="noopener noreferrer"
  class="bg-amber-700 hover:bg-amber-600 text-white font-semibold px-6 py-4 rounded-lg"
>
  <span>{book.affiliate.label}</span>
  <svg>...</svg>
</a>

{book.alternativeLinks && book.alternativeLinks.map((link) => (
  <a 
    href={link.url}
    target="_blank"
    rel="noopener noreferrer"
    class="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-6 py-3 rounded-lg"
  >
    <span>{link.label}</span>
  </a>
))}
```

---

## 📝 CMS Form Fields

### In `/cms/books/new`

**Affiliate Information Section:**

1. **Affiliate Label** (Text Input)
   - Placeholder: "Buy on Amazon"
   - Optional field
   - Custom button text

2. **Affiliate URL** (URL Input) - *Required*
   - Placeholder: "https://amazon.com/dp/..."
   - Must be a valid URL
   - This is the main affiliate link

3. **Merchant** (Dropdown)
   - Options:
     - Amazon
     - ChristianBook
     - Barnes & Noble
     - Other
   - Defaults to "Amazon"

**Alternative Links Section:**

- Dynamic "Add Alternative Link" button
- Each alternative link has:
  - Label field
  - URL field
  - Remove button
- Can add multiple alternative links

---

## 🔄 Data Flow

### Creating a Book

1. **User fills form** in `/cms/books/new`
   - Enters affiliate URL (required)
   - Optionally enters affiliate label
   - Selects merchant from dropdown
   - Optionally adds alternative links

2. **Form submission** sends data to `/api/cms/books` (POST)

3. **API processes data:**
   ```typescript
   const affiliate = {
     url: affiliate_url,
     label: affiliate_label || 'Buy Now',  // Default if empty
     merchant: affiliate_merchant || 'amazon'  // Default if empty
   };
   
   // Store in database
   bookData.affiliate_url = affiliate.url;
   bookData.affiliate_label = affiliate.label;
   bookData.affiliate_merchant = affiliate.merchant;
   
   // Store alternative links in metadata
   if (alternative_links && alternative_links.length > 0) {
     metadata.alternativeLinks = alternative_links;
   }
   ```

4. **Database stores:**
   - `affiliate_url` → `books.affiliate_url`
   - `affiliate_label` → `books.affiliate_label`
   - `affiliate_merchant` → `books.affiliate_merchant`
   - `alternative_links` → `books.metadata.alternativeLinks`

### Displaying a Book

1. **Frontend fetches book data** from database or content collection

2. **Data is transformed** to match component expectations:
   ```typescript
   book.data.affiliate = {
     url: book.affiliate_url,
     label: book.affiliate_label || 'Buy Now',
     merchant: book.affiliate_merchant || 'amazon'
   };
   
   book.data.alternativeLinks = book.metadata?.alternativeLinks || [];
   ```

3. **Components render buttons:**
   - Primary button uses `book.data.affiliate`
   - Alternative buttons use `book.data.alternativeLinks`

---

## 🎯 Best Practices

### 1. Affiliate Link Format

**Amazon Associates:**
```
https://amazon.com/dp/B08XYZ123?tag=your-affiliate-id-20
```

**ChristianBook:**
```
https://www.christianbook.com/...?event=AFF&p=1234567
```

**General Format:**
- Always include your affiliate ID/tag
- Use HTTPS
- Keep links clean and readable

### 2. Button Labels

**Good Examples:**
- "Get the book" (generic)
- "Buy on Amazon" (merchant-specific)
- "Purchase Now" (action-oriented)
- "Get it on ChristianBook" (merchant-specific)

**Avoid:**
- "Click here" (not descriptive)
- "Link" (too generic)
- Overly long labels

### 3. Alternative Links

- **Limit to 2-3 alternatives** to avoid overwhelming users
- **Prioritize by commission rate** or user preference
- **Use clear merchant names** in labels
- **Test all links** before publishing

### 4. Security & Privacy

- Always use `target="_blank"` to open in new tab
- Always use `rel="noopener noreferrer"` for security
- Consider adding `rel="sponsored"` for SEO compliance
- Disclose affiliate relationships (already implemented)

---

## 📊 Affiliate Disclosure

The system automatically displays affiliate disclosures:

**On Book Detail Pages:**
```astro
<div class="bg-amber-900/20 border border-amber-800/50 rounded-lg p-4">
  <p class="text-neutral-300 text-xs text-center">
    <span class="text-amber-100 font-semibold">★ Affiliate Disclosure:</span> 
    When you purchase through our links, we may earn a commission at no extra cost to you. 
    This helps support the ministry and keeps resources free.
  </p>
</div>
```

**On Books Index Page:**
- General disclosure at the bottom of the page

---

## 🔧 Technical Implementation

### API Endpoint (`/api/cms/books.ts`)

**Creating a book:**
```typescript
// Extract affiliate data from request
const { affiliate_url, affiliate_label, affiliate_merchant, alternative_links } = body;

// Prepare affiliate object
const affiliate: any = {};
if (affiliate_url) {
  affiliate.url = affiliate_url;
  affiliate.label = affiliate_label || 'Buy Now';
  affiliate.merchant = affiliate_merchant || 'amazon';
}

// Store in database
if (Object.keys(affiliate).length > 0) {
  bookData.affiliate_url = affiliate.url;
  bookData.affiliate_label = affiliate.label;
  bookData.affiliate_merchant = affiliate.merchant;
}

// Store alternative links in metadata
if (alternative_links && alternative_links.length > 0) {
  metadata.alternativeLinks = alternative_links;
}
```

### Component Usage (`BookCard.tsx`)

```typescript
// Primary affiliate button
<a 
  href={book.data.affiliate.url}
  target="_blank"
  rel="noopener noreferrer"
>
  {getMerchantLogo(book.data.affiliate.merchant)}
  {book.data.affiliate.label}
</a>

// Alternative links
{book.data.alternativeLinks?.map((link) => (
  <a 
    href={link.url}
    target="_blank"
    rel="noopener noreferrer"
  >
    {link.label}
  </a>
))}
```

---

## 🚨 Important Notes

1. **Affiliate URL is Required**
   - Books cannot be published without an affiliate URL
   - This ensures every book has a purchase option

2. **Merchant Logos**
   - Currently uses emoji icons (🛒, ✝️, 📚)
   - Can be enhanced with actual logo images
   - Function: `getMerchantLogo(merchant)` in `book-utils.ts`

3. **Link Validation**
   - URLs should be validated before saving
   - Consider checking if links are accessible
   - Test affiliate links regularly

4. **Tracking (Future Enhancement)**
   - Could add click tracking
   - Monitor which merchants perform best
   - A/B test different button labels

---

## 📋 Checklist for Adding a Book

- [ ] Get affiliate link from merchant (Amazon, ChristianBook, etc.)
- [ ] Test the affiliate link to ensure it works
- [ ] Enter affiliate URL in CMS form
- [ ] Add descriptive affiliate label
- [ ] Select correct merchant from dropdown
- [ ] Add alternative links if available
- [ ] Verify all links open correctly
- [ ] Check affiliate disclosure is visible
- [ ] Test on mobile and desktop

---

## 🔮 Future Enhancements

1. **Link Validation**
   - Validate URLs before saving
   - Check if links are still active
   - Alert when links break

2. **Click Tracking**
   - Track affiliate link clicks
   - Analytics dashboard
   - Performance metrics

3. **Auto-Detection**
   - Auto-detect merchant from URL
   - Auto-fill merchant field
   - Validate affiliate ID format

4. **Bulk Link Updates**
   - Update affiliate IDs across all books
   - Replace old links with new ones
   - Link health monitoring

5. **Merchant Logos**
   - Replace emoji with actual logos
   - SVG icons for better quality
   - Consistent branding


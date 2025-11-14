# Book Cover Images - How They Work

## 📸 Current System

Book cover images can be added in **two ways**:

### 1. **Custom Cover Image URL** (Priority 1 - Recommended)
- **Field:** "Cover Image URL" in CMS
- **Location:** Book Information section
- **Format:** Direct URL to image (e.g., `https://example.com/book-cover.jpg`)
- **Storage:** Stored in `metadata.coverImageUrl`
- **Use Case:** 
  - Custom book covers
  - Self-published books
  - Books not in Open Library
  - Higher quality images
  - Images from your own CDN/storage

### 2. **ISBN Lookup** (Priority 2 - Fallback)
- **Field:** "ISBN" in CMS
- **Location:** Book Information section
- **Format:** ISBN-10 or ISBN-13 (e.g., `978-0-123456-78-9`)
- **Storage:** Stored in `metadata.isbn`
- **API:** Open Library Covers API
- **URL Format:** `https://covers.openlibrary.org/b/isbn/{isbn}-{size}.jpg`
- **Sizes Available:** S (small), M (medium), L (large)
- **Use Case:**
  - Books available in Open Library database
  - Quick setup without finding image URLs
  - Automatic cover lookup

---

## 🔄 Priority Logic

The system uses this priority order:

```typescript
1. Custom Cover Image URL (if provided) → Use this
2. ISBN Lookup (if ISBN provided) → Fallback to Open Library API
3. No cover (if neither provided) → Show placeholder icon
```

**Example:**
- If you provide both a custom URL and ISBN → Custom URL is used
- If you only provide ISBN → Open Library API is used
- If you provide neither → Placeholder icon is shown

---

## 📝 How to Add Cover Images in CMS

### Option A: Using Custom Image URL (Recommended)

1. **In `/admin` → Content Tab:**
   - Select "Book" as Content Type
   - Scroll to "Book Information" section
   - Find "Cover Image URL" field
   - Enter direct URL to image:
     ```
     https://example.com/book-cover.jpg
     ```
   - Or use your Supabase Storage URL:
     ```
     https://yourproject.supabase.co/storage/v1/object/public/media/book-covers/book.jpg
     ```

2. **In `/cms/books/new`:**
   - Find "Cover Image URL" field
   - Enter the image URL
   - Save the book

### Option B: Using ISBN Lookup

1. **In `/admin` → Content Tab:**
   - Select "Book" as Content Type
   - Scroll to "Book Information" section
   - Find "ISBN" field
   - Enter the book's ISBN (with or without hyphens):
     ```
     978-0-123456-78-9
     ```
     or
     ```
     9780123456789
     ```
   - The system will automatically fetch the cover from Open Library

2. **In `/cms/books/new`:**
   - Find "ISBN" field
   - Enter the ISBN
   - Save the book

---

## 🖼️ Image Requirements

### Custom Cover Image URLs

**Recommended:**
- **Format:** JPG, PNG, or WebP
- **Aspect Ratio:** 2:3 (portrait, like a book cover)
- **Minimum Size:** 300x450px
- **Optimal Size:** 600x900px or larger
- **File Size:** Under 500KB for fast loading
- **Hosting:** 
  - Your own CDN
  - Supabase Storage
  - Cloudinary
  - Imgur
  - Any public image hosting service

**URL Examples:**
```
✅ https://yourdomain.com/images/book-covers/book.jpg
✅ https://yourproject.supabase.co/storage/v1/object/public/media/covers/book.jpg
✅ https://res.cloudinary.com/yourcloud/image/upload/book.jpg
✅ https://i.imgur.com/abc123.jpg
```

---

## 🔧 Technical Implementation

### Function: `getBookCoverUrl()`

**Location:** `src/lib/book-utils.ts`

**Usage:**
```typescript
// Option 1: Using options object (recommended)
const coverUrl = getBookCoverUrl({
  coverImageUrl: 'https://example.com/cover.jpg',
  isbn: '978-0-123456-78-9',
  size: 'M' // 'S', 'M', or 'L'
});

// Option 2: Using individual parameters (backward compatible)
const coverUrl = getBookCoverUrl(isbn, 'M', coverImageUrl);
```

**Priority Logic:**
1. Returns `coverImageUrl` if provided
2. Returns Open Library URL if `isbn` provided
3. Returns `null` if neither available

### Database Storage

**In Supabase `books` table:**
```json
{
  "metadata": {
    "coverImageUrl": "https://example.com/cover.jpg",
    "isbn": "978-0-123456-78-9"
  }
}
```

---

## 🎨 Display Behavior

### Book Cards (`BookCard.tsx`)
- Shows custom image if `coverImageUrl` is provided
- Falls back to ISBN lookup if no custom URL
- Shows placeholder icon if neither available
- Handles image loading errors gracefully

### Book Detail Page (`/books/[slug]`)
- Uses large size ('L') for better quality
- Same priority logic: custom URL → ISBN → placeholder

---

## 💡 Best Practices

### When to Use Custom URL
- ✅ You have a high-quality cover image
- ✅ Book is self-published or not in Open Library
- ✅ You want consistent image quality
- ✅ You're hosting images on your own CDN
- ✅ Book has a custom cover design

### When to Use ISBN Lookup
- ✅ Book is available in Open Library
- ✅ You want quick setup without finding image URLs
- ✅ You don't have a cover image readily available
- ✅ You're okay with Open Library's image quality

### Recommended Approach
1. **Try ISBN first** - Enter ISBN and see if Open Library has the cover
2. **If not available or low quality** - Add a custom cover image URL
3. **Use your own hosting** - Upload to Supabase Storage or your CDN for better control

---

## 🚀 Future Enhancements

Potential improvements:
- [ ] Image upload directly in CMS (drag & drop)
- [ ] Automatic image optimization
- [ ] Multiple image sizes (thumbnail, medium, large)
- [ ] Image cropping tool
- [ ] Integration with more cover APIs (Google Books, Amazon, etc.)
- [ ] Fallback chain: Custom URL → Open Library → Google Books → Placeholder

---

## ❓ FAQ

**Q: Can I use both custom URL and ISBN?**
A: Yes! Custom URL takes priority. ISBN is kept for reference and as a fallback.

**Q: What if Open Library doesn't have the cover?**
A: Use a custom cover image URL instead.

**Q: Can I upload images directly?**
A: Not yet, but you can upload to Supabase Storage and use that URL. Future enhancement planned.

**Q: What image formats are supported?**
A: Any format supported by browsers: JPG, PNG, WebP, GIF, SVG

**Q: Do I need to resize images?**
A: No, but recommended sizes are 600x900px for optimal quality and performance.

**Q: Can I use relative URLs?**
A: No, you need full URLs (starting with `http://` or `https://`)

---

## 📋 Quick Reference

| Method | Field Name | Priority | When to Use |
|--------|-----------|----------|-------------|
| Custom URL | `coverImageUrl` | 1 (Highest) | High-quality custom images |
| ISBN Lookup | `isbn` | 2 (Fallback) | Quick setup, books in Open Library |
| None | - | 3 (Placeholder) | No cover available |


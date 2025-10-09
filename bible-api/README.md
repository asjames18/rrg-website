# Bible API

A free, self-hosted Bible API built with Next.js and TypeScript. This API serves public-domain Bible texts including the King James Version (KJV) and additional apocryphal and pseudepigraphal texts.

## Features

- **RESTful API** with comprehensive endpoints for Bible text access
- **Public Domain Texts** - KJV and other public domain translations only
- **Sacred Names Support** - Optional Hebrew name transformations
- **Robust Search** - Full-text search with pagination and filtering
- **Rate Limiting** - Built-in protection against abuse
- **TypeScript** - Fully typed for better development experience
- **No External Dependencies** - Self-contained with local JSON data packs

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone or download the project
cd bible-api

# Install dependencies
npm install

# Start development server
npm run dev
```

The API will be available at `http://localhost:3000/api`

## API Endpoints

### Books

#### GET /api/books
List all available books.

**Query Parameters:**
- `group` (optional): Filter by group (`canon`, `apocrypha`, `pseudepigrapha`)
- `sacredNames` (optional): Apply sacred name transformations (`true`/`false`)

**Example:**
```bash
curl "http://localhost:3000/api/books?group=canon"
```

#### GET /api/books/[book]
Get metadata for a specific book.

**Query Parameters:**
- `sacredNames` (optional): Apply sacred name transformations

**Example:**
```bash
curl "http://localhost:3000/api/books/Genesis"
```

#### GET /api/books/[book]/[chapter]
Get all verses from a specific chapter.

**Query Parameters:**
- `sacredNames` (optional): Apply sacred name transformations

**Example:**
```bash
curl "http://localhost:3000/api/books/Genesis/1"
```

### Verses

#### GET /api/verse
Get a single verse by reference.

**Query Parameters:**
- `ref` (required): Bible reference (e.g., "John 3:16", "Genesis 1:1")
- `sacredNames` (optional): Apply sacred name transformations

**Example:**
```bash
curl "http://localhost:3000/api/verse?ref=John%203:16"
```

### Search

#### GET /api/search
Search Bible text with full-text search.

**Query Parameters:**
- `q` (required): Search query
- `in` (optional): Search scope (`all`, `canon`, `apocrypha`, `pseudepigrapha`)
- `book` (optional): Limit search to specific book
- `limit` (optional): Results per page (1-100, default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Example:**
```bash
curl "http://localhost:3000/api/search?q=faith&in=canon&limit=10"
```

### Random

#### GET /api/random
Get random verse(s).

**Query Parameters:**
- `in` (optional): Scope for random selection (`all`, `canon`, `apocrypha`, `pseudepigrapha`)
- `count` (optional): Number of verses (1-10, default: 1)
- `sacredNames` (optional): Apply sacred name transformations

**Example:**
```bash
curl "http://localhost:3000/api/random?in=canon&count=3"
```

## Response Formats

### Book List Response
```json
{
  "books": [
    {
      "id": "genesis",
      "name": "Genesis",
      "group": "Canon",
      "chapters": 50,
      "aliases": ["Gen", "Gn"],
      "orderIndex": 1
    }
  ],
  "metadata": {
    "total": 66,
    "version": "1.0.0",
    "lastUpdated": "2024-01-01T00:00:00.000Z",
    "totalBooks": 66
  }
}
```

### Chapter Response
```json
{
  "book": {
    "id": "genesis",
    "name": "Genesis",
    "group": "Canon"
  },
  "chapter": 1,
  "verses": [
    {
      "v": 1,
      "t": "In the beginning God created the heaven and the earth."
    }
  ],
  "metadata": {
    "totalVerses": 31,
    "sacredNames": false
  }
}
```

### Search Response
```json
{
  "results": [
    {
      "ref": "Hebrews 11:1",
      "snippet": "Now <mark>faith</mark> is the substance of things hoped for...",
      "book": "Hebrews",
      "bookId": "hebrews",
      "chapter": 11,
      "verse": 1,
      "text": "Now faith is the substance of things hoped for, the evidence of things not seen.",
      "score": 100
    }
  ],
  "total": 1,
  "limit": 50,
  "offset": 0,
  "query": "faith"
}
```

## Sacred Names

The API supports optional sacred name transformations. When `sacredNames=true` is passed as a query parameter, the following transformations are applied:

- God → Elohim
- LORD → YHWH  
- Lord → Adonai
- Jesus → Yeshua
- Christ → Messiah
- Moses → Moshe
- Abraham → Avraham
- And many more...

**Example:**
```bash
curl "http://localhost:3000/api/verse?ref=John%203:16&sacredNames=true"
```

## Book Aliases

The API supports various book name aliases:

- Genesis: Gen, Gn, Ge
- John: Jn, Joh, Jhn
- 1 Corinthians: 1 Cor, 1Co, 1 C, I Corinthians, I Cor
- Song of Solomon: Song, SOS, Canticles, Cant, Song of Songs, Solomon's Song

## Rate Limiting

The API includes built-in rate limiting:

- **General endpoints**: 60 requests per minute
- **Search endpoint**: 30 requests per minute

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Maximum requests per window
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: When the rate limit window resets

## Data Structure

### Adding Full Texts

The API is designed to work with local JSON data packs. To add full Bible texts:

1. **Ensure texts are public domain** - Only use texts that are legally free to use
2. **Follow the JSON schema** - Each book file should match the expected format
3. **Place files in appropriate directories**:
   - `/data/canon/` - Canonical books (66 books)
   - `/data/apocrypha/` - Apocryphal books
   - `/data/pseudepigrapha/` - Pseudepigraphal books

### JSON Schema

Each book file should follow this structure:

```json
{
  "book": "Genesis",
  "group": "Canon",
  "chapters": [
    [
      "In the beginning God created the heaven and the earth.",
      "And the earth was without form, and void..."
    ]
  ],
  "aliases": ["Gen", "Gn", "Ge"]
}
```

## Development

### Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Environment Variables

Create a `.env.local` file for configuration:

```env
# Rate limiting (optional)
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=60

# Search rate limiting (optional)
SEARCH_RATE_LIMIT_MAX_REQUESTS=30
```

### Testing

The project includes comprehensive unit tests:

```bash
# Run all tests
npm test

# Run tests for specific modules
npm test parseRef
npm test aliases
npm test transformers
```

## Deployment

### Vercel

This API is optimized for Vercel deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Other Platforms

The API can be deployed to any Node.js hosting platform:

```bash
# Build the project
npm run build

# Start the production server
npm start
```

## Legal Notice

**Important**: This API is designed to serve only public domain texts. Never include copyrighted translations or restricted texts. The King James Version (KJV) is in the public domain in most jurisdictions, but always verify the legal status of any texts you add.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For questions, issues, or contributions, please open an issue on the project repository.

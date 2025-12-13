# CMS (Content Management System) Documentation

## Overview

The CMS allows you to edit website content for the following components:
- **Hero Section** - Main landing page hero with title, subtitle, description, and featured products
- **Banner Slider** - Korean-style banner carousel with multiple slides
- **Product Ads** - Featured product highlights and special promotions
- **Media & Reviews** - Video content, awards, social media links, and customer service information

## Current Implementation

### Architecture

The CMS is built using React Context API and localStorage for data persistence:

```
src/
├── components/
│   ├── CMSContext.tsx         # Context provider and data management
│   ├── Hero.tsx               # Uses CMS data
│   ├── KoreanBannerSlider.tsx # Uses CMS data
│   ├── ProductAds.tsx         # Uses CMS data
│   └── MediaReviews.tsx       # Uses CMS data
├── app/
│   ├── admin/
│   │   └── cms/
│   │       └── page.tsx       # CMS admin interface
│   └── layout.tsx             # Wraps app with CMSProvider
```

### How It Works

1. **CMSContext.tsx** - Manages all CMS data
   - Stores content in React state
   - Persists to localStorage automatically
   - Provides update functions for each section
   - Includes default content fallback

2. **Admin Interface** (`/admin/cms`)
   - Tabbed interface for editing different sections
   - Forms auto-populate with current content
   - Real-time updates with success notifications
   - Reset to defaults functionality

3. **Data Flow**
   ```
   User edits in Admin → CMSContext updates → localStorage saves → Components re-render
   ```

### Accessing the CMS

1. **Desktop Navigation**: Click the "Admin" button in the main header (top-right)
2. **Mobile Navigation**: Open menu → "Admin CMS" link
3. **Direct URL**: Navigate to `/admin/cms`

## Data Structure

### Hero Content
```typescript
{
  title: string;
  subtitle: string;
  description: string;
  featuredProducts: Array<{
    id: number;
    name: string;
    category: string;
    image: string;
    imagePlaceholder: string;
    description: string;
  }>;
  categories: Array<{
    name: string;
    icon: string;
    color: string;
    textColor: string;
  }>;
}
```

### Banner Slider
```typescript
Array<{
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  link: string;
  buttonText: string;
  bgColor: string;
}>
```

### Product Ads
```typescript
{
  ads: Array<{
    id: number;
    title: string;
    subtitle: string;
    description: string;
    cta: string;
    link: string;
    image: string;
    color: string;
    position: string;
  }>;
  specialPromotions: Array<{
    id: number;
    title: string;
    description: string;
    image: string;
    link: string;
  }>;
}
```

### Media & Reviews
```typescript
{
  videoUrl: string;
  videoTitle: string;
  videoDescription: string;
  awardTitle: string;
  awardDescription: string;
  awardImage: string;
  socialChannels: Array<{
    id: number;
    name: string;
    title: string;
    description: string;
    icon: string;
    bgColor: string;
    textColor: string;
    link: string;
    buttonText: string;
  }>;
  customerServicePhone: string;
  customerServiceFax: string;
  customerServiceEmail: string;
  customerServiceHours: string;
}
```

## Backend Integration Guide

### Step 1: Create API Endpoints

You'll need to create the following endpoints:

```typescript
// GET /api/cms
// Returns all CMS data

// PUT /api/cms/hero
// Updates hero content

// PUT /api/cms/banner-slider
// Updates banner slider content

// PUT /api/cms/product-ads
// Updates product ads content

// PUT /api/cms/media-reviews
// Updates media & reviews content

// POST /api/cms/reset
// Resets all content to defaults
```

### Step 2: Update CMSContext.tsx

Replace localStorage operations with API calls:

```typescript
// Current (localStorage):
useEffect(() => {
  const stored = window.localStorage.getItem("cmsData");
  if (stored) {
    setCmsData(JSON.parse(stored));
  }
}, []);

// Backend integration:
useEffect(() => {
  fetch('/api/cms')
    .then(res => res.json())
    .then(data => setCmsData(data))
    .catch(err => console.error('Error loading CMS data:', err));
}, []);
```

### Step 3: Update Save Functions

```typescript
// Current (localStorage):
const updateHeroContent = (content: HeroContent) => {
  setCmsData(prev => ({ ...prev, hero: content }));
};

// Backend integration:
const updateHeroContent = async (content: HeroContent) => {
  try {
    const response = await fetch('/api/cms/hero', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content)
    });
    
    if (response.ok) {
      setCmsData(prev => ({ ...prev, hero: content }));
    }
  } catch (err) {
    console.error('Error updating hero content:', err);
  }
};
```

### Step 4: Add Authentication

Protect the admin routes with authentication:

```typescript
// Example middleware
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth_token');
    
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
}
```

### Step 5: Add Image Upload

For better UX, implement image upload functionality:

```typescript
// Add to admin page
const handleImageUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });
  
  const { url } = await response.json();
  return url;
};
```

## Database Schema Recommendation

### PostgreSQL Example

```sql
CREATE TABLE cms_content (
  id SERIAL PRIMARY KEY,
  section VARCHAR(50) NOT NULL UNIQUE, -- 'hero', 'banner_slider', etc.
  content JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by VARCHAR(100)
);

-- Example row:
-- section: 'hero'
-- content: { "title": "...", "subtitle": "...", ... }
```

### MongoDB Example

```javascript
{
  _id: ObjectId("..."),
  section: "hero",
  content: {
    title: "Transform Your",
    subtitle: "Home Climate",
    // ... rest of content
  },
  updatedAt: ISODate("2025-10-27T..."),
  updatedBy: "admin@example.com"
}
```

## Security Considerations

When integrating with a backend:

1. **Authentication Required**: Always verify user is authenticated before allowing CMS access
2. **Authorization**: Implement role-based access (only admins can edit)
3. **Input Validation**: Validate all content before saving to database
4. **XSS Prevention**: Sanitize HTML/JavaScript in content fields
5. **Rate Limiting**: Prevent abuse of save endpoints
6. **Audit Logging**: Track who made what changes and when
7. **Backup Strategy**: Regular backups of CMS content

## Current Limitations

Since we're using localStorage (static mode):

1. ✅ **Works**: Content persists across page refreshes
2. ✅ **Works**: Multiple sections can be edited independently
3. ✅ **Works**: Real-time preview of changes
4. ❌ **Doesn't Work**: Content is per-browser (not shared across devices)
5. ❌ **Doesn't Work**: No user authentication/authorization
6. ❌ **Doesn't Work**: No audit trail of changes
7. ❌ **Doesn't Work**: No image upload (must use external URLs)

## Testing

### Manual Testing Checklist

- [ ] Navigate to `/admin/cms`
- [ ] Edit Hero section and save
- [ ] Verify changes appear on homepage
- [ ] Edit Banner Slider and save
- [ ] Verify changes in banner carousel
- [ ] Edit Product Ads and save
- [ ] Verify changes in ads section
- [ ] Edit Media & Reviews and save
- [ ] Verify changes in media section
- [ ] Click "Reset to Defaults"
- [ ] Verify all content resets
- [ ] Refresh page
- [ ] Verify changes persist

## Future Enhancements

1. **Image Management**
   - Direct image upload
   - Image library/gallery
   - Image optimization

2. **Rich Text Editor**
   - WYSIWYG editor for descriptions
   - HTML formatting options

3. **Version History**
   - Track content changes
   - Rollback to previous versions

4. **Preview Mode**
   - Preview changes before publishing
   - Draft/Published states

5. **Multi-language Support**
   - Manage content in multiple languages
   - Language switcher

6. **SEO Management**
   - Edit meta titles/descriptions
   - Open Graph tags

## Support

For issues or questions about the CMS:
1. Check this documentation
2. Review code comments in `CMSContext.tsx`
3. Check browser console for errors
4. Review localStorage contents: `localStorage.getItem('cmsData')`

## Changelog

### Version 1.0.0 (Current)
- Initial CMS implementation
- localStorage-based storage
- Hero section editing
- Banner slider editing
- Product ads editing
- Media & reviews editing
- Reset to defaults functionality
- Admin button in header



# CMS Admin Panel

## Quick Start

Access the CMS admin panel at: **`/admin/cms`**

Or click the **"Admin"** button in the website header (gear icon).

## What You Can Edit

### 1. Hero Section
- Main title and subtitle
- Hero description
- Featured products (3 items)
  - Product name
  - Category
  - Description
  - Image URL

### 2. Banner Slider
- Multiple banner slides (3 items)
  - Title and subtitle
  - Description
  - Link URL
  - Button text
  - Image URL

### 3. Product Ads
- Featured ads (3 items)
  - Title, subtitle, description
  - CTA button text
  - Link URL
  - Image URL
- Special promotions (2 items)
  - Title and description
  - Link URL
  - Image URL

### 4. Media & Reviews
- Video section
  - YouTube embed URL
  - Video title and description
- Award section
  - Award title and description
  - Award image URL
- Social media channels (3 items)
  - Channel title
  - Link URL
  - Button text
- Customer service information
  - Phone and fax numbers
  - Email address
  - Business hours

## How to Use

1. **Navigate** to the tab you want to edit
2. **Update** the form fields with your new content
3. **Save** by clicking the save button at the bottom
4. **Verify** your changes appear on the live site immediately

## Tips

- Changes save instantly to your browser's local storage
- All changes persist across page refreshes
- Use the "Reset to Defaults" button to restore original content
- For images, use full URLs (e.g., `https://example.com/image.jpg`)
- For YouTube videos, use embed URLs (e.g., `https://www.youtube.com/embed/VIDEO_ID`)

## Current Mode: Static (No Backend)

The CMS currently uses browser localStorage for data persistence. This means:

✅ **Works:**
- Changes persist across page refreshes
- Real-time content updates
- Easy content management

⚠️ **Limitations:**
- Changes are only visible on your device/browser
- No user authentication
- No multi-user support
- No image upload (must use external URLs)

## Future: Backend Integration

The CMS is designed to easily integrate with a backend API. See `CMS_DOCUMENTATION.md` in the project root for integration guide.

---

**Need Help?** See the full documentation at `/CMS_DOCUMENTATION.md`



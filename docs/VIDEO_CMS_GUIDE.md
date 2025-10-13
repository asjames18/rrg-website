# 🎥 Video CMS Guide

## How to Add Videos Through the Admin Portal

### Step 1: Access the Admin Portal
1. Go to `http://localhost:4321/admin`
2. Log in with your admin credentials
3. Click on the **"Content"** tab

### Step 2: Create a New Video
1. Click **"Create New Content"** button
2. Fill in the video information:

#### Required Fields:
- **Title**: Video title (e.g., "Shut the Doorways: Warfare 101")
- **Content Type**: Select "Video"
- **Status**: Select "Published" to make it visible
- **Slug**: URL-friendly version of title (auto-generated)

#### Video-Specific Fields:
- **Platform**: Choose from dropdown:
  - `youtube` - YouTube videos
  - `tiktok` - TikTok videos  
  - `instagram` - Instagram videos
  - `facebook` - Facebook videos
- **Video ID**: The video identifier from the platform:
  - YouTube: The part after `v=` in the URL (e.g., `dQw4w9WgXcQ`)
  - TikTok: The video ID from the share link
  - Instagram: The post ID from the URL
  - Facebook: The video ID from the watch URL

#### Optional Fields:
- **Summary**: Brief description of the video
- **Series**: Array of series names (e.g., `["Spiritual Warfare Basics", "Remnant Training"]`)
- **Topics**: Array of topics/tags (e.g., `["Spiritual Warfare", "Deliverance", "Repentance"]`)
- **Scriptures**: Array of scripture references (e.g., `["Ephesians 6:12", "James 4:7"]`)
- **Teaching Notes**: Markdown content with detailed notes

### Step 3: Video Metadata Structure
The video metadata should be stored as JSON in the `metadata` field:

```json
{
  "platform": "youtube",
  "videoId": "dQw4w9WgXcQ",
  "series": ["Spiritual Warfare Basics", "Remnant Training"],
  "topics": ["Spiritual Warfare", "Deliverance", "Repentance"],
  "scriptures": ["Ephesians 6:12", "James 4:7", "1 Peter 5:8"]
}
```

### Step 4: Teaching Notes (Optional)
Add detailed teaching notes in Markdown format:

```markdown
## Overview
The enemy doesn't need permission to attack—but he does need an open door.

## What You'll Learn
- **Identifying Open Doors**: Unforgiveness, sexual sin, occult involvement
- **Closing the Access**: Biblical repentance and renunciation
- **Guarding the Seal**: How to keep doors shut once they're closed

## Key Points
### 1. Every Doorway Has a Key
The enemy can't just barge in. He exploits:
- Sin you haven't repented of
- Trauma you haven't surrendered
- Agreements you've made (knowingly or unknowingly)
```

### Step 5: Save and Publish
1. Click **"Save Content"**
2. Set status to **"Published"** to make it visible on the website
3. The video will appear on `http://localhost:4321/videos`

## Supported Video Platforms

### YouTube
- **Platform**: `youtube`
- **Video ID**: Extract from URL `https://www.youtube.com/watch?v=VIDEO_ID`
- **Example**: URL `https://www.youtube.com/watch?v=dQw4w9WgXcQ` → Video ID: `dQw4w9WgXcQ`

### TikTok
- **Platform**: `tiktok`
- **Video ID**: Extract from share link
- **Example**: `https://www.tiktok.com/@user/video/VIDEO_ID`

### Instagram
- **Platform**: `instagram`
- **Video ID**: Extract from post URL
- **Example**: `https://www.instagram.com/p/VIDEO_ID/`

### Facebook
- **Platform**: `facebook`
- **Video ID**: Extract from watch URL
- **Example**: `https://www.facebook.com/watch/?v=VIDEO_ID`

## Video Display Features

### On Videos Index Page (`/videos`):
- Grid layout with video thumbnails
- Video title and series information
- Topic tags and scripture references
- Links to individual video pages

### On Individual Video Pages (`/videos/[slug]`):
- Full video player with responsive embed
- Video title, series, and metadata
- Scripture references in highlighted box
- Teaching notes with markdown formatting
- Related resources section

## Troubleshooting

### Video Not Showing?
1. Check that the video status is "Published"
2. Verify the Video ID is correct for the platform
3. Ensure the platform is supported (YouTube, TikTok, Instagram, Facebook)

### Video Embed Issues?
1. Check that the Video ID is valid
2. Verify the platform matches the video source
3. Test the video URL directly in a browser

### Content Not Updating?
1. Clear browser cache
2. Check that the video is saved in the CMS
3. Verify the video status is "Published"

## Example Video Entry

**Title**: "Shut the Doorways: Warfare 101"
**Platform**: youtube
**Video ID**: dQw4w9WgXcQ
**Series**: ["Spiritual Warfare Basics", "Remnant Training"]
**Topics**: ["Spiritual Warfare", "Deliverance", "Repentance"]
**Scriptures**: ["Ephesians 6:12", "James 4:7", "1 Peter 5:8"]
**Status**: Published

This will create a video that displays on `/videos` and can be accessed at `/videos/shut-the-doorways-warfare-101`.

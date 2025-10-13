# 🎵 Music CMS Guide

## How to Add Music Through the Admin Portal

### Step 1: Access the Admin Portal
1. Go to `http://localhost:4321/admin`
2. Log in with your admin credentials
3. Click on the **"Content"** tab

### Step 2: Create a New Music Entry
1. Click **"Create New Content"** button
2. Fill in the music information:

#### Required Fields:
- **Title**: Music title (e.g., "Remnant Anthem")
- **Content Type**: Select "Music"
- **Status**: Select "Published" to make it visible
- **Slug**: URL-friendly version of title (auto-generated)

#### Music-Specific Fields:
The music fields appear when you select "Music" as content type:

##### **Music Type** (Required):
- **🎵 Audio Track**: For MP3, WAV, or other audio files
- **🎬 Music Video**: For YouTube/Vimeo music videos

##### **Audio Source URL** (For Audio Tracks):
- Direct URL to audio file (e.g., `https://example.com/audio/song.mp3`)
- Supports MP3, WAV, OGG, and other audio formats
- Used by the AudioPlayer component for playback

##### **Platform & Video ID** (For Music Videos):
- **Platform**: YouTube, Vimeo, Facebook
- **Video ID**: Extract from the video URL
- **YouTube**: `https://www.youtube.com/watch?v=VIDEO_ID` → Video ID: `VIDEO_ID`
- **Vimeo**: `https://vimeo.com/VIDEO_ID` → Video ID: `VIDEO_ID`

##### **Optional Fields**:
- **Scriptures**: Comma-separated list (e.g., "Revelation 12:11, Romans 8:37, 2 Timothy 2:3")
- **Genre/Style**: Music style (e.g., "Worship, Anthem, Hymn, Teaching")

### Step 3: Music Metadata Structure
The music metadata should be stored as JSON in the `metadata` field:

#### **Audio Track Example**:
```json
{
  "type": "audio",
  "audioSrc": "https://example.com/audio/remnant-anthem.mp3",
  "scriptures": ["Revelation 12:11", "Romans 8:37", "2 Timothy 2:3"],
  "genre": "Worship Anthem"
}
```

#### **Music Video Example**:
```json
{
  "type": "video",
  "platform": "youtube",
  "videoId": "dQw4w9WgXcQ",
  "scriptures": ["Revelation 12:11", "Romans 8:37"],
  "genre": "Worship"
}
```

### Step 4: Teaching Notes (Optional)
Add detailed information about the music in the **Body** field using Markdown:

```markdown
## About This Song

**Remnant Anthem** is a declaration of identity for those who refuse to compromise.

## Lyrics

*Verse 1:*  
We are the remnant, called and set apart  
Fire in our spirit, YAHUAH in our heart  

*Chorus:*  
YAHUSHA is King, the Lion has roared  
We take up our cross, we unsheathe the sword  

## Musical Style

Powerful, anthemic worship with a war room edge.

## Scripture Foundation

- **Revelation 12:11** - "And they overcame him by the blood of the Lamb"
- **Romans 8:37** - "Yet in all these things we are more than conquerors"
```

### Step 5: Save and Publish
1. Click **"Save Content"**
2. Set status to **"Published"** to make it visible
3. The music will appear on `http://localhost:4321/music`

## Music Display Features

### On Music Index Page (`/music`):
- **Audio Player**: For audio tracks with track navigation
- **Music List**: All music content with type indicators
- **Scripture References**: Displayed for each track
- **Genre/Style**: Shown in the content list

### Audio Player Features:
- **Track Navigation**: Previous/Next buttons
- **Auto-play**: Automatically plays next track
- **Keyboard Controls**: Space to play/pause, arrow keys for navigation
- **Responsive Design**: Works on all devices

### Content List Features:
- **Type Indicators**: 🎵 Audio or 🎬 Video
- **Scripture References**: Highlighted scripture references
- **Summary**: Brief description of the music
- **Links**: Direct links to individual music pages

## Music Types Supported

### Audio Tracks:
- **MP3**: Most common format
- **WAV**: High-quality audio
- **OGG**: Open source format
- **M4A**: Apple format

### Music Videos:
- **YouTube**: Most popular platform
- **Vimeo**: Professional video hosting
- **Facebook**: Social media videos

## Example Music Entries

### Audio Track Example:
**Title**: "Remnant Anthem"
**Type**: Audio Track
**Audio Source**: `https://example.com/audio/remnant-anthem.mp3`
**Scriptures**: Revelation 12:11, Romans 8:37, 2 Timothy 2:3
**Genre**: Worship Anthem

### Music Video Example:
**Title**: "Worship in the Spirit"
**Type**: Music Video
**Platform**: YouTube
**Video ID**: dQw4w9WgXcQ
**Scriptures**: John 4:24, 1 Corinthians 14:15
**Genre**: Worship

## Troubleshooting

### Audio Not Playing?
1. Check that the Audio Source URL is valid and accessible
2. Verify the audio file format is supported (MP3, WAV, OGG)
3. Ensure the URL is publicly accessible (not behind authentication)

### Music Video Not Embedding?
1. Check that the Video ID is correct for the platform
2. Verify the platform matches the video source
3. Test the video URL directly in a browser

### Content Not Updating?
1. Clear browser cache
2. Check that the music is saved in the CMS
3. Verify the music status is "Published"

## Audio Player Features

### Controls:
- **Play/Pause**: Click play button or press spacebar
- **Previous/Next**: Use navigation buttons or arrow keys
- **Volume**: Use browser's native volume controls
- **Progress**: Click on progress bar to seek

### Keyboard Shortcuts:
- **Spacebar**: Play/Pause
- **Left Arrow**: Previous track
- **Right Arrow**: Next track
- **Up/Down Arrow**: Volume control (browser dependent)

### Mobile Support:
- **Touch Controls**: Native mobile audio controls
- **Responsive Design**: Adapts to screen size
- **Background Play**: Continues playing when switching apps (browser dependent)

## Best Practices

### Audio Files:
- **File Size**: Keep under 10MB for better loading
- **Format**: Use MP3 for best compatibility
- **Quality**: 128kbps minimum, 320kbps recommended
- **Hosting**: Use reliable CDN or hosting service

### Music Videos:
- **Platform**: YouTube for best compatibility
- **Quality**: Upload in HD for better experience
- **Thumbnails**: Use engaging thumbnails
- **Description**: Include lyrics and scripture references

### Content Organization:
- **Series**: Group related music together
- **Scriptures**: Always include relevant scripture references
- **Genre**: Use consistent genre tags for filtering
- **Teaching Notes**: Include lyrics, inspiration, and usage instructions

This music system is now fully integrated with your Supabase CMS! 🎵

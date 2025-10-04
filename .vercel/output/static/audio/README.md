# Audio Files Directory

Add your `.mp3` audio files here to use them in the music player.

## Example File Structure

```
public/audio/
├── remnant-anthem.mp3
├── worship-song-1.mp3
├── teaching-spiritual-warfare.mp3
└── README.md (this file)
```

## How to Add Music

1. **Add audio files** to this directory
   - Supported format: MP3
   - Recommended: 128-320 kbps quality

2. **Update the music page** at `src/pages/music/index.astro`:
   ```typescript
   const tracks = [
     {
       title: 'Remnant Anthem',
       src: '/audio/remnant-anthem.mp3',
     },
     {
       title: 'Your Song Title',
       src: '/audio/your-file.mp3',
     },
   ];
   ```

3. The AudioPlayer component will automatically:
   - Display the track title
   - Provide native audio controls
   - Enable prev/next navigation
   - Show a playlist if multiple tracks

## Example Track

To test the player, add a file named `remnant-anthem.mp3` to this directory.

## Notes

- Files in the `public/` directory are served as-is
- Keep file sizes reasonable for web delivery (< 10MB per track recommended)
- Use descriptive filenames without spaces (use hyphens or underscores)


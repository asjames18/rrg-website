/**
 * Email Templates
 * HTML templates for workflow emails
 */

export function generateWelcomeEmailHTML(displayName: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Real & Raw Gospel</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #92400e 0%, #78350f 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: #fbbf24; margin: 0; font-size: 28px;">Welcome to Real & Raw Gospel!</h1>
  </div>
  
  <div style="background: #0b0b0c; color: #e5e7eb; padding: 30px; border-radius: 0 0 8px 8px;">
    <p style="font-size: 18px; margin-top: 0;">Shalom ${displayName},</p>
    
    <p>We're excited to have you join the remnant! You've taken the first step in training in the ways of the Most High.</p>
    
    <div style="background: #1f2937; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #fbbf24;">
      <p style="margin: 0; font-style: italic;">
        "Training the remnant in the ways of the Most High. No fluff, no compromise—pure truth from the Word of YAHUAH."
      </p>
    </div>
    
    <h2 style="color: #fbbf24; margin-top: 30px;">What's Next?</h2>
    <ul style="line-height: 2;">
      <li>📖 Explore our <a href="https://rrg-website.vercel.app/start-here" style="color: #fbbf24;">Start Here</a> page for foundational teachings</li>
      <li>📚 Browse our <a href="https://rrg-website.vercel.app/books" style="color: #fbbf24;">Recommended Books</a> for deeper study</li>
      <li>🎥 Watch our <a href="https://rrg-website.vercel.app/videos" style="color: #fbbf24;">Video Teachings</a> for practical application</li>
      <li>✍️ Read our <a href="https://rrg-website.vercel.app/blog" style="color: #fbbf24;">Blog Posts</a> for timely insights</li>
    </ul>
    
    <p style="margin-top: 30px;">
      <strong>Important:</strong> Please verify your email address by clicking the confirmation link we sent. This helps us keep your account secure.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://rrg-website.vercel.app" style="display: inline-block; background: #fbbf24; color: #0b0b0c; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
        Visit the Website
      </a>
    </div>
    
    <hr style="border: none; border-top: 1px solid #374151; margin: 30px 0;">
    
    <p style="font-size: 14px; color: #9ca3af; text-align: center; margin: 0;">
      Honoring YAHUAH • YAHUSHA • RUACH HAQODESH • EL ELYON<br>
      © ${new Date().getFullYear()} Real & Raw Gospel. All glory to YAHUAH.
    </p>
  </div>
</body>
</html>
  `.trim();
}

export function generateWelcomeEmailText(displayName: string): string {
  return `
Welcome to Real & Raw Gospel!

Shalom ${displayName},

We're excited to have you join the remnant! You've taken the first step in training in the ways of the Most High.

"Training the remnant in the ways of the Most High. No fluff, no compromise—pure truth from the Word of YAHUAH."

What's Next?
- Explore our Start Here page: https://rrg-website.vercel.app/start-here
- Browse our Recommended Books: https://rrg-website.vercel.app/books
- Watch our Video Teachings: https://rrg-website.vercel.app/videos
- Read our Blog Posts: https://rrg-website.vercel.app/blog

Important: Please verify your email address by clicking the confirmation link we sent.

Visit the website: https://rrg-website.vercel.app

Honoring YAHUAH • YAHUSHA • RUACH HAQODESH • EL ELYON
© ${new Date().getFullYear()} Real & Raw Gospel. All glory to YAHUAH.
  `.trim();
}


# Social Media Preview Setup Guide

This guide will help you set up beautiful social media previews for when you share your game on Facebook, Twitter, LinkedIn, Slack, etc.

## 📋 What I Added

### Meta Tags in `index.html`:
- ✅ **Open Graph tags** (Facebook, LinkedIn, WhatsApp, Slack)
- ✅ **Twitter Card tags** (Twitter/X)
- ✅ **SEO meta tags** (Google, search engines)
- ✅ **Favicon support**

## 🎨 Creating Your Preview Image

### Option 1: Use the Preview Generator (Easiest)

1. **Open `preview-generator.html` in your browser**
2. **Take a screenshot**:
   - **Mac**: Press `Cmd + Shift + 4`, then select the preview card area
   - **Windows**: Use Snipping Tool or press `Windows + Shift + S`
   - Make sure the screenshot is **1200x630 pixels**
3. **Save as `preview.png`** in your project root folder

### Option 2: Use Online Tools (Recommended)

Use one of these tools to create a professional OG image:

1. **[og-image.vercel.app](https://og-image.vercel.app/)** - Free, easy
2. **[Canva](https://www.canva.com/)** - Template: "Facebook Post" (1200x630)
3. **[Figma](https://www.figma.com/)** - Full design control
4. **[Pika.style](https://pika.style/)** - Beautiful code screenshots

**Recommended dimensions**: **1200 × 630 pixels**

### Option 3: Screenshot Your Game

1. Open your game at the most visually appealing screen
2. Take a clean screenshot
3. Crop/resize to 1200x630px
4. Save as `preview.png`

## 🔧 Configuration Steps

### 1. Update URLs in `index.html`

Replace `https://yourdomain.com/` with your actual domain:

```html
<!-- Open Graph / Facebook -->
<meta property="og:url" content="https://YOURSITE.com/">
<meta property="og:image" content="https://YOURSITE.com/preview.png">

<!-- Twitter Card -->
<meta name="twitter:url" content="https://YOURSITE.com/">
<meta name="twitter:image" content="https://YOURSITE.com/preview.png">
```

### 2. Add Your Preview Image

Place your `preview.png` file in the project root:
```
feel like an llm/
├── index.html
├── preview.png          ← Add this file here
├── styles.css
└── ...
```

### 3. (Optional) Add a Favicon

Create or download a favicon (16x16 or 32x32 icon):
- Save as `favicon.png` in project root
- Or use [favicon.io](https://favicon.io/) to generate one

## 🧪 Testing Your Preview

### Before Publishing:

**Local Testing Tools:**
1. **[OpenGraph.xyz](https://www.opengraph.xyz/)** - See how your preview looks
2. **[Meta Debugger](https://developers.facebook.com/tools/debug/)** - Facebook's official tool
3. **[Twitter Card Validator](https://cards-dev.twitter.com/validator)** - Twitter's validator
4. **[LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)** - LinkedIn preview

### After Publishing:

1. **Facebook**: Use [Meta Debugger](https://developers.facebook.com/tools/debug/)
   - Enter your URL
   - Click "Scrape Again" to refresh cache
   
2. **Twitter**: Use [Card Validator](https://cards-dev.twitter.com/validator)
   - Enter your URL
   - Preview will show instantly

3. **LinkedIn**: Use [Post Inspector](https://www.linkedin.com/post-inspector/)
   - Enter your URL
   - Click "Inspect"

## 📊 What Each Platform Shows

| Platform | Image Size | Shows |
|----------|------------|-------|
| **Facebook** | 1200×630 | Title, description, image |
| **Twitter** | 1200×630 | Title, description, image |
| **LinkedIn** | 1200×627 | Title, description, image |
| **Slack** | 1200×630 | Title, description, image |
| **WhatsApp** | 400×400 | Image (often cropped) |
| **Discord** | 1200×630 | Title, description, image |

## 🎯 Preview Tips

### For Best Results:

✅ **DO:**
- Use bright, eye-catching colors
- Include your game title prominently
- Show key features (Tokenization, Embeddings, etc.)
- Use emojis for visual interest
- Keep text large and readable
- Use high contrast

❌ **DON'T:**
- Use small text (won't be readable in preview)
- Include too much detail
- Use dark text on dark background
- Make image too busy
- Use copyrighted images

## 🚀 Quick Start Checklist

- [ ] Open `preview-generator.html`
- [ ] Take screenshot (1200x630px)
- [ ] Save as `preview.png` in project root
- [ ] Update URLs in `index.html` to your domain
- [ ] Test with [OpenGraph.xyz](https://www.opengraph.xyz/)
- [ ] Deploy to hosting (GitHub Pages, Vercel, Netlify, etc.)
- [ ] Clear cache with Facebook Debugger
- [ ] Share and enjoy! 🎉

## 📝 Example Preview Text

I've set these up for you already in `index.html`:

**Title**: "Feel Like an LLM - Experience AI from the Inside"

**Description**: "Build your own mini-LLM from scratch! Learn tokenization, embeddings, attention, and generation through an interactive game. Understand how ChatGPT really works."

Feel free to customize these!

## 🐛 Troubleshooting

### "My preview doesn't show on Facebook/Twitter"

1. Make sure your site is **publicly accessible** (not localhost)
2. Clear the cache using Facebook Debugger or Twitter Card Validator
3. Ensure `preview.png` is in the correct location
4. Check that image URL is absolute (`https://...`), not relative

### "Image is too large/slow to load"

- Optimize your PNG: Use [TinyPNG](https://tinypng.com/)
- Target size: Under 200KB
- Consider using JPG for photos

### "Preview shows old content"

Social platforms cache previews for several days:
1. Use platform debugging tools to refresh
2. Change the image filename (e.g., `preview-v2.png`)
3. Add a query parameter: `preview.png?v=2`

## 🎨 Customization Ideas

Make it your own:
- Add your logo/branding
- Use your game's color scheme
- Show a screenshot of gameplay
- Include user testimonials
- Add stats (e.g., "1000+ players")

---

**Need help?** Check these resources:
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards Guide](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Meta Tags Guide](https://css-tricks.com/essential-meta-tags-social-media/)


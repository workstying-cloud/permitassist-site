
# PermitAssist Pro — Enterprise AI Delivery (Static Site)

This is a static website package ready to deploy on Netlify.

## Deploy on Netlify
1. Create a new site on Netlify and upload the folder contents, or push to Git and connect.
2. Ensure the video and poster exist at:
   - `videos/consulting_flow_sora2.mp4`
   - `assets/consulting_flow_poster.jpg`
3. Connect your domain on Name.com with these DNS records:
   - A @ -> 75.2.60.5
   - A @ -> 99.83.229.8
   - CNAME www -> yoursite.netlify.app

## Structure
- `index.html` — the whole site
- `assets/styles.css` — brand CSS (black/blue/red)
- `assets/script.js` — flow mode toggles + smoke tests
- `assets/permitassist_360_flow.svg` — 360° concentric globe
- `videos/consulting_flow_sora2.mp4` — Sora 2 showcase video
- `docs/PermitAssist_Pro_Master_SOW.pdf` — SOW template

## Notes
- Calendly embed points to `https://calendly.com/permitassistpro/intro-call`
- Contact email: `support@permitassist.pro`

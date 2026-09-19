# Shabbir Hossain Azhaf — Portfolio

Personal portfolio for a graphic designer and video editor.

## Current frontend

- Monochrome black / white portfolio system
- Light and dark theme switch
- Light mode uses the white-shirt hero portrait
- Dark mode uses the black-shirt hero portrait
- Soft blur and edge-fade merge around the hero portrait
- Stylish editorial typography with hover popups
- Separate Design and Motion portfolio sections
- Software showcase for Photoshop, Illustrator, Premiere Pro and After Effects
- Serial creative journey instead of company / résumé blocks
- Motion-led icons, cards and micro-interactions
- Hiring-focused contact form
- LinkedIn, WhatsApp, Instagram and Behance links
- Responsive desktop, tablet and mobile layouts
- Admin dashboard UI at `/admin`
- YouTube URL parsing foundation for in-site previews
- Supabase schema foundation for future persistent project uploads

## Run locally

```bash
npm install
npm run dev
```

## Portfolio content

Current artwork cards are temporary monochrome placeholders. They are intentionally ready to be replaced with Shabbir's real posters, logo work, company profiles, motion thumbnails and videos.

## CMS / admin setup

The admin interface is designed, but persistent authentication, image/video uploads and project CRUD require Supabase credentials.

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local` and add credentials.
3. Run `supabase/schema.sql` in the Supabase SQL editor.
4. Create storage buckets for portfolio images and videos.
5. Connect admin authentication and project CRUD.
6. Restrict write policies to the owner's authenticated user id.

## Social

- LinkedIn: designerazhaf
- Instagram: grapeobd
- Behance: azhafahmed
- WhatsApp: connected to the portfolio contact number

# Shabbir Hossain Azhaf — Portfolio

Personal portfolio for a graphic designer and video editor.

## Current build

- Premium editorial homepage with motion-led interactions
- Separate Design and Motion portfolio experiences
- Design categories for social media, logo/brand identity, company profile and print
- Motion categories for motion graphics, reels, promo video and video editing
- Hiring-focused contact form
- LinkedIn, WhatsApp, Instagram and Behance social slots
- Responsive desktop/mobile layouts
- Admin dashboard design at `/admin`
- Supabase database schema foundation
- YouTube URL parsing foundation for in-site previews

## Run locally

```bash
npm install
npm run dev
```

## CMS setup

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local` and add credentials.
3. Run `supabase/schema.sql` in the Supabase SQL editor.
4. Create storage buckets for portfolio images and videos.
5. Connect admin authentication and project CRUD.
6. Restrict write policies to the owner's authenticated user id.

## Content source

The first profile, experience, education and software content is based on Shabbir's supplied CV. Project cards are temporary art-direction placeholders until portfolio assets are uploaded.

## Still to connect

- Exact LinkedIn profile URL
- Exact Instagram profile URL
- Real project artwork, thumbnails and case-study copy
- Supabase admin auth/uploads
- Production email delivery instead of mailto

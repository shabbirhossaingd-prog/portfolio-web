# Shabbir Hossain Azhaf — Portfolio

Personal portfolio for a graphic designer and video editor.

## Current frontend

- Monochrome black / white portfolio system
- Light and dark theme switch
- Pinterest-inspired filtered portfolio wall
- Filters for All Work, Posters, Reels, Videos, Logos, Company Profiles and Animations
- Original media ratios are preserved in the gallery
- Full-screen original image / video viewer
- Software showcase for Photoshop, Illustrator, Premiere Pro and After Effects
- Serial creative journey instead of company / résumé blocks
- Hiring-focused contact form
- Responsive desktop, tablet and mobile layouts
- Functional admin dashboard at `/admin`

## Run locally

```bash
npm install
npm run dev
```

## Supabase / admin setup

The admin uploader uses Supabase Database + Storage. Large video files are uploaded directly to Supabase through signed upload URLs, so they are not forced through the Next.js server.

1. Create or connect a Supabase project.
2. Copy `.env.example` to `.env.local`.
3. Add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - optional `ADMIN_SESSION_SECRET`
4. Run `supabase/schema.sql` in the Supabase SQL editor.
5. Deploy the same environment variables in Vercel.

The upload API automatically creates a public `portfolio` storage bucket if it does not exist. Files are stored in these folders:

- `posters/`
- `reels/`
- `videos/`
- `logos/`
- `company-profiles/`
- `animations/`

The admin password is intentionally not committed to GitHub. Keep the real password only in local/Vercel environment variables.

## Admin workflow

Open `/admin`, sign in, select the destination folder, choose the original image or video, and publish. A 9:16 reel remains 9:16, a 4:5 poster remains 4:5, and landscape media remains landscape. The public portfolio applies rounded corners without cropping and opens the original file in full view.

## Social

- LinkedIn: designerazhaf
- Instagram: grapeobd
- Behance: azhafahmed
- WhatsApp: connected to the portfolio contact number

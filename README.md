Gomelschyna: Explore the Historical Heritage of Gomel Region
Gomelschyna is a modern React-based website dedicated to showcasing the historical and cultural landmarks of the Gomel Region (Belarus). Built with Vite, React, TypeScript, and SCSS, the project offers an interactive experience with:

🏠 Homepage: Introduces the region and its cultural significance.

🗺️ Interactive Map: Powered by Leaflet, displaying historical points of interest with markers. Users can:

Click on markers to view brief details.

Plot routes from their current location to any landmark (using browser geolocation).

📖 Landmark Details: A dedicated page with in-depth descriptions of each historical site.

🔗 Seamless Navigation: Smooth transitions between pages via React Router.

Tech Stack
⚡ Frontend: React 18 + Vite (for fast development builds).

🎨 Styling: SCSS for modular and maintainable CSS.

🛠 Type Safety: TypeScript for robust code.

🗺️ Map Integration: Leaflet.js with custom markers and routing.

📱 Responsive Design: Works on desktop and mobile devices.

Key Features
Dynamic map rendering with clickable markers.
Geolocation-based route calculation (user → landmark).
Clean, minimalist UI with animated transitions.
Easily extendable for future landmarks or regions.

Why Gomelschyna?
This project bridges technology and cultural heritage, making history accessible through an engaging web experience. Ideal for travelers, historians, or locals exploring Gomel’s rich past.

## Supabase database setup

The frontend expects a Postgres schema with user profiles, heritage objects and user activity tables exposed through Supabase. A ready-to-run SQL script is available at [`supabase/init.sql`](supabase/init.sql).

### Applying the schema
1. Open your Supabase project's SQL Editor and paste the contents of `supabase/init.sql`.
2. Execute the script. It will create the required tables, row level security policies, indexes and storage buckets (`images`, `avatars`).
3. Create at least one user account, update its `profiles.role` to `admin` for administrative access, and provide the project's `VITE_SUPABASE_KEY` in your environment. New auth users automatically receive a matching `profiles` row using the email/metadata supplied during signup.

### Schema overview
- **profiles** – mirrors `auth.users` entries with display information (`username`, `avatar_url`, `role`). Users can only mutate their own records while everyone can read public profiles.
- **categories** – lookup table populated with default heritage categories referenced by the map UI.
- **objects** – cultural objects displayed on the map. Records store textual metadata, marker coordinates, gallery links and optional external URLs. Only administrators can create or edit entries.
- **visited_places / favourite_places** – junction tables that track which users have marked objects as visited or favourite along with personal ratings/comments. Policies restrict write access to record owners.
- **object_ratings view** – aggregated average rating per object derived from `visited_places` to support statistics widgets without scanning client-side.
- **Storage buckets** – `images` hosts gallery assets (public read, admin write) and `avatars` stores user avatars (public read, user-level write).

Refer to the script comments for additional implementation details or to adapt policies to your security requirements.


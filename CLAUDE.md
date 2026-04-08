# Rewards App

## Project Overview

A web-based customer loyalty rewards app for businesses. Customers sign up, earn points on purchases, and redeem points for rewards. Similar in concept to the Starbucks loyalty app.

## Related Links

- **Live Site**: (add your Netlify URL here once deployed)
- **Supabase Project**: (add your Supabase project URL here)

## Tech Stack

- **Framework**: React + Vite
- **Styling**: Tailwind CSS
- **Backend/Auth/Database**: Supabase
- **Hosting**: Netlify
- **Language**: JavaScript

## File Structure
```
/rewards-app/
├── src/
│   ├── lib/
│   │   └── supabase.js        # Supabase client initialisation
│   ├── pages/
│   │   ├── Login.jsx          # Customer login screen
│   │   ├── Signup.jsx         # Customer signup screen
│   │   ├── Dashboard.jsx      # Customer dashboard (points, history, rewards)
│   │   └── Admin.jsx          # Admin panel (add purchases, manage rewards)
│   ├── components/
│   │   ├── PointsCard.jsx     # Displays current points balance
│   │   ├── PurchaseList.jsx   # Lists recent purchase history
│   │   └── RewardCard.jsx     # Individual reward with redeem button
│   ├── App.jsx                # Route definitions
│   └── main.jsx               # App entry point
├── .env                       # Supabase keys (never commit this)
├── .gitignore                 # Excludes .env and node_modules
├── netlify.toml               # Netlify redirect rules for React Router
├── CLAUDE.md                  # This file
└── index.html                 # Vite HTML entry point
```

## Database Schema

### profiles
Linked to Supabase auth users.
- id (uuid, references auth.users)
- full_name (text)
- email (text)
- total_points (integer, default 0)
- created_at (timestamp)

### purchases
Records every purchase made by a customer.
- id (uuid)
- customer_id (references profiles)
- amount_spent (decimal)
- points_earned (integer)
- description (text)
- created_at (timestamp)

### rewards
The catalog of rewards customers can redeem.
- id (uuid)
- name (text)
- description (text)
- points_required (integer)
- is_active (boolean, default true)
- created_at (timestamp)

### redemptions
Records every time a customer redeems a reward.
- id (uuid)
- customer_id (references profiles)
- reward_id (references rewards)
- points_spent (integer)
- redeemed_at (timestamp)

## Points Logic

- $1 spent = 10 points
- Points are always whole numbers (use Math.floor or Math.round — never decimals)
- Points are added to profiles.total_points on every purchase
- Points are subtracted from profiles.total_points on every redemption
- Never allow a redemption if the customer's total_points < reward.points_required

## Design Guidelines

- Clean, mobile-friendly UI
- Green as the primary accent color (loyalty/trust feel)
- Customer dashboard should feel warm and rewarding
- Admin panel should look clearly distinct from the customer-facing UI

## Route Structure

| Route | Page | Access |
|-------|------|--------|
| /login | Login | Public |
| /signup | Signup | Public |
| /dashboard | Customer Dashboard | Auth required |
| /admin | Admin Panel | Password protected |

## Git Workflow

### Branch Naming
- `feature/auth` — signup and login
- `feature/dashboard` — customer dashboard
- `feature/admin` — admin panel
- `feature/rewards` — rewards catalog and redemption

### Merging Branches
```bash
git status
git branch -a
git merge feature/auth -m "Merge auth: signup, login, route protection"
git merge feature/dashboard -m "Merge dashboard: points, history, rewards"
git merge feature/admin -m "Merge admin: purchase entry, reward management"
git push origin main
```

## Deployment

### Netlify (Production)
```bash
netlify deploy --prod
```

### Preview Deploy
```bash
netlify deploy
```

### Requirements
- Netlify CLI: `npm install -g netlify-cli`
- Authenticated: `netlify login`
- Environment variables set in Netlify dashboard:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

### netlify.toml (must exist in root)
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Common Tasks

### Change the points-per-dollar rate
Search for `10` in the points calculation logic inside `Admin.jsx`. Update the multiplier.

### Add a new reward
Go to `/admin` in the browser → use the "Add Reward" form.

### Update the admin password
Search for the hardcoded password in `Admin.jsx` and replace it.

### Check a customer's points
Go to `/admin` → search by customer email.

## Rules (Important — always follow these)

- Never delete or overwrite the database schema
- Never commit the `.env` file — it contains secret keys
- Always use Supabase for auth — no custom authentication
- Points must always be whole numbers — never store decimals in total_points
- Always check the customer has enough points before processing a redemption
- Keep the netlify.toml file in the root — without it, page refreshes break
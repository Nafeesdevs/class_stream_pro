# ClassStream — Frontend (React + Vite + Tailwind)

UI built to match the SmartList theme (fonts, colours, 3D illustrations, dot grids, motion animations) and wired to the ClassStream Express backend.

## Run
```bash
npm install
cp .env.example .env     # set VITE_API_URL to your backend, e.g. http://localhost:8000/api/v1
npm run dev              # http://localhost:3000
```
Start the backend first. It seeds these accounts on first run:

| Role    | Email                    | Password     |
|---------|--------------------------|--------------|
| Admin   | admin@classstream.com    | admin12345   |
| Student | student@classstream.com  | student12345 |

For payments without Razorpay keys, run the backend with `ALLOW_TEST_PAYMENTS=true`; the frontend then completes a simulated payment automatically. With real keys, Razorpay Checkout opens.

## Pages
**Public:** Home, Classes, Subscription plans, About, Contact, Terms, Privacy, Login, Register
**Student:** Home, Class player, My Classes (assigned only), Subscription + pay, Profile (details, subscription, receipts, delete account)
**Admin (/admin):** Dashboard, Users (create, list, view, activate/deactivate, plan), Plans (create, edit, delete, activate), Classes (create, edit, delete, multiple videos with free/subscription access), Payments, Subscriptions, Deletion requests, Profile

## Class assignment rule (backend)
Playing a *subscription* video the first time assigns that whole class to the student and uses 1 of the plan's class slots. Free videos never use a slot.

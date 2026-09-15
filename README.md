# FDAA — Food Donor & Aid Application

Simple **MERN** app: donors list surplus food, receivers claim it. The UI uses **Framer Motion** for 3D-style tilt, float, and spring motion. Vite keeps the frontend fast; the API compresses responses and falls back to memory if MongoDB is not running.

## Run

From the project root:

```bash
npm install
npm run install:all
npm run dev
```

- Web: http://localhost:5173
- API: http://localhost:5000/api/health

MongoDB is optional. If `mongodb://127.0.0.1:27017/fdaa` is up, donations persist. If not, the server still starts instantly with sample data in memory.

## Test users

Password for every seeded account: **test1234**

| Role | Name | Email |
| --- | --- | --- |
| donor | Spice Garden | donor@fdaa.test |
| donor | Koyambedu stall 12 | stall@fdaa.test |
| donor | Rise Bakery | bakery@fdaa.test |
| receiver | Hope Kitchen | ngo@fdaa.test |
| receiver | Community Kitchen | kitchen@fdaa.test |

Open http://localhost:5173/login and click a card, then **Enter FDAA**.

## Stack

- **MongoDB** + **Express** + **React** + **Node**
- **Framer Motion** for perspective / rotateX / rotateY card scenes
- **Vite** + route `lazy()` + compression for speed

## Deploy (Render API + Vercel frontend)

1. Push this repo to GitHub (already set up as [Arul-2007/FSD-FDA](https://github.com/Arul-2007/FSD-FDA)).
2. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas), allow `0.0.0.0/0`, copy the connection string.
3. On [Render](https://render.com): New **Web Service** from this repo.
   - Root directory: `server`
   - Build: `npm install`
   - Start: `npm start`
   - Env: `MONGODB_URI` (Atlas URI), `CLIENT_ORIGIN` (your Vercel URL, e.g. `https://fsd-fda.vercel.app`)
4. On [Vercel](https://vercel.com): Import this repo.
   - Root directory: `client`
   - Framework: Vite
   - Env: `VITE_API_URL` = your Render URL with **no trailing slash** (e.g. `https://fsd-fda.onrender.com`)
5. Redeploy Render after the Vercel URL is known if `CLIENT_ORIGIN` was a placeholder.


# Book-A-Yute | Premium Talent Roster

A curated talent roster platform represented by Push-A-Yute. Built with React 19, Tailwind CSS, and Framer Motion.

## Tech Stack
- **Frontend**: Vite + React 19 (SPA)
- **Database/Auth**: Supabase
- **Serving**: Node.js + `serve` (with SPA fallback)
- **Deployment**: Google Cloud Run (Docker)

## Local Development
1. `npm install`
2. `npm run dev`

## Production Build & Test (Docker)
To simulate the Google Cloud Run environment locally:
```bash
docker build -t book-a-yute .
docker run -p 8080:8080 -e PORT=8080 book-a-yute
```

## Google Cloud Run Deployment

### 1. Build and Push to Artifact Registry/GCR
Replace `PROJECT_ID` with your actual Google Cloud Project ID.
```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/book-a-yute
```

### 2. Deploy to Cloud Run
```bash
gcloud run deploy book-a-yute \
  --image gcr.io/PROJECT_ID/book-a-yute \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars VITE_SUPABASE_URL=your_url,VITE_SUPABASE_ANON_KEY=your_key
```

### Important Notes
- **SPA Routing**: The Docker container uses `serve -s`, which automatically redirects all unknown requests to `index.html`. This ensures that `react-router-dom` paths work correctly when the page is refreshed.
- **Port Handling**: Cloud Run requires the container to listen on the port defined by the `$PORT` environment variable. The `package.json` start script is pre-configured for this.

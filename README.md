# ayonime

Stream and download anime in HD — free, forever.

Built with Next.js + FastAPI + AnimePahe.

## Features
- HD anime streaming
- MP4 episode downloads with live progress
- Search across thousands of titles
- Currently airing feed
- JP / EN audio selection
- Quality selector (Best / 1080p / 720p / 480p)

## Stack
- **Frontend**: Next.js 14, Tailwind CSS
- **Backend**: FastAPI, Python

## Running locally

```bash
# Backend
cd ../
pip install fastapi uvicorn -r requirements.txt
uvicorn backend.main:app --reload --port 8000

# Frontend
cd anime_vault-main
npm install
npm run dev
```

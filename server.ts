import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Explicitly serve sitemap.xml and robots.txt to prevent SPA fallback issues
  app.get('/sitemap.xml', (req, res) => {
    res.set('Content-Type', 'application/xml');
    res.sendFile(path.join(process.cwd(), 'public', 'sitemap.xml'));
  });

  app.get('/robots.txt', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.sendFile(path.join(process.cwd(), 'public', 'robots.txt'));
  });

  // Determine if we should run in production mode (default to production on Cloud Run/production environments)
  const isProduction = process.env.NODE_ENV === "production" || process.env.NODE_ENV !== "development";

  // Vite middleware for development
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    
    // Serve static files with cache headers since built Vite assets are content-hashed
    app.use(express.static(distPath, {
      maxAge: '1y',
      immutable: true,
      index: false
    }));

    app.get('*', (req, res) => {
      // Prevent returning index.html for static assets that are missing on the server
      if (req.path.startsWith('/assets/') || req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?|eot|ttf|otf)$/i)) {
        res.status(404).set('Content-Type', 'text/plain').send('Asset Not Found');
        return;
      }
      
      // Force custom domains, CDNs, and browsers to always load the latest index.html fresh
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private, max-age=0');
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

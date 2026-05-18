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

  // Serve static files from the public directory
  app.use(express.static(path.join(process.cwd(), 'public')));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

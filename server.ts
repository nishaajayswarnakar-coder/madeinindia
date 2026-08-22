import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/tenders/sync-cppp-gem", (req, res) => {
    // Mocking successful response
    res.json({
      success: true,
      tenders: [
        {
          id: "TND-12345",
          title: "Procurement of Heavy-Duty 33kV Electrical Step-Down Transformers",
          source: "CPPP",
          value: "1.85 CR",
          location: "Nagpur / Pune, MH",
          closingDate: "28-Aug-2026 05:00 PM"
        },
        {
          id: "TND-12346",
          title: "Supply, Commissioning and 3-Year Onsite AMC of Cloud-Ready Rack Server",
          source: "GeM",
          value: "92.5 LAKHS",
          location: "New Delhi, DL",
          closingDate: "02-Sep-2026 03:30 PM"
        }
      ]
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

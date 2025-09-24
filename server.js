// server.js (root)
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    // Import compiled backend (built by tsc -> backend/dist)
    const backendModule = require("./backend/dist/server");
    // support both commonJS and esModule default export
    const backendApp = backendModule.default || backendModule;
    const connectDB =
      backendModule.connectDB || backendModule.default?.connectDB;

    // If backend provides a connectDB function, call it before starting.
    if (typeof connectDB === "function") {
      console.log("🔌 Connecting to the database...");
      await connectDB();
      console.log("🔌 Database connected.");
    } else {
      console.log(
        "⚠️ connectDB not found on backend module. Skipping DB connect."
      );
    }

    // Mount backend at /api (backend routes should be like /hero, /projects etc)
    app.use("/api", backendApp);

    // Serve uploads (backend uploads folder)
    app.use(
      "/api/uploads",
      express.static(path.join(__dirname, "backend/uploads"))
    );

    // Admin static + SPA fallback
    app.use("/admin", express.static(path.join(__dirname, "admin/dist")));
    app.get("/admin/*", (req, res) =>
      res.sendFile(path.join(__dirname, "admin/dist/index.html"))
    );

    // Client static + SPA fallback
    app.use(express.static(path.join(__dirname, "client/build")));
    app.get("*", (req, res) =>
      res.sendFile(path.join(__dirname, "client/build/index.html"))
    );

    // Start the single server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📱 Client: /`);
      console.log(`⚙️ Admin: /admin`);
      console.log(`🔌 API: /api`);
    });
  } catch (err) {
    console.error("❌ Error while starting server:", err);
    process.exit(1);
  }
})();

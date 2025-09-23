const express = require("express");
const path = require("path");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = process.env.PORT || 3000;

// Start backend server
const { spawn } = require("child_process");
const backendProcess = spawn("npm", ["start"], {
  cwd: path.join(__dirname, "backend"),
  stdio: "inherit",
});

// Serve uploads folder
app.use(
  "/api/uploads",
  express.static(path.join(__dirname, "backend/uploads"))
);

// API Proxy - Must be BEFORE static file serving
app.use(
  "/api",
  createProxyMiddleware({
    target: "http://localhost:5000",
    changeOrigin: true,
    logLevel: "info",
  })
);

// Static file serving
app.use("/admin", express.static(path.join(__dirname, "admin/dist")));
app.use(express.static(path.join(__dirname, "client/build")));

// SPA routing - Admin routes
app.get("/admin*", (req, res) => {
  res.sendFile(path.join(__dirname, "admin/dist/index.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});

// Start server after backend is ready
setTimeout(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Web: http://localhost:${PORT}`);
    console.log(`⚙️  Admin: http://localhost:${PORT}/admin`);
    console.log(`🔌 API: http://localhost:${PORT}/api`);
  });
}, 2000);

// Cleanup
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down...");
  backendProcess.kill();
  process.exit();
});

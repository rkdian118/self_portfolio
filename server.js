const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

/* ------------------- 1️⃣  Import backend app ------------------- */
/*  After you build your backend with tsc, export the Express app  */
/*  from backend/dist/index.js (or backend/dist/server.js).        */
const backendApp = require("./backend/dist/server").default;

/* ------------------- 2️⃣  API & uploads ------------------------ */
app.use(
  "/api/uploads",
  express.static(path.join(__dirname, "backend/uploads"))
);
app.use("/api", backendApp); // All backend routes now live at /api

/* ------------------- 3️⃣  Admin static ------------------------- */
app.use("/admin", express.static(path.join(__dirname, "admin/dist")));
app.get("/admin/*", (req, res) =>
  res.sendFile(path.join(__dirname, "admin/dist/index.html"))
);

/* ------------------- 4️⃣  Client static ------------------------ */
app.use(express.static(path.join(__dirname, "client/build")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "client/build/index.html"))
);

/* ------------------- 5️⃣  Start server ------------------------- */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Client: http://localhost:${PORT}`);
  console.log(`⚙️  Admin:  http://localhost:${PORT}/admin`);
  console.log(`🔌 API:    http://localhost:${PORT}/api`);
});

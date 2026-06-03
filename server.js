const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");
const path = require("path");

const dev = false;
const port = process.env.PORT || 3000;

// Diagnóstico al arranque — visible en logs de cPanel
console.log("[ZX] ===== STARTUP DIAGNOSTICS =====");
console.log("[ZX] process.cwd()   :", process.cwd());
console.log("[ZX] __dirname       :", __dirname);
console.log("[ZX] Node version    :", process.version);
console.log("[ZX] NODE_ENV        :", process.env.NODE_ENV);
const _publicImg = path.join(process.cwd(), "public", "img");
const _publicImgDir = path.join(process.cwd(), "public");
console.log("[ZX] public/ exists  :", fs.existsSync(_publicImgDir));
console.log("[ZX] public/img/ exists:", fs.existsSync(_publicImg));
if (fs.existsSync(_publicImg)) {
  console.log("[ZX] public/img/ files :", fs.readdirSync(_publicImg).join(", "));
} else {
  console.log("[ZX] public/img/ NOT FOUND — images will 404");
  // Intentar con __dirname como base alternativa
  const _alt = path.join(__dirname, "public", "img");
  console.log("[ZX] __dirname/public/img exists:", fs.existsSync(_alt));
}
console.log("[ZX] ===================================");
const app = next({ dev, conf: { distDir: ".next" } });
const handle = app.getRequestHandler();

// File watcher — cuando GitHub Actions sube .restart al final del deploy,
// este proceso detecta el cambio y llama process.exit(1).
// Phusion Passenger reinicia el proceso automáticamente con el nuevo build.
const RESTART_FILE = ".restart";
let lastMtime = (() => {
  try {
    return fs.statSync(RESTART_FILE).mtimeMs;
  } catch {
    return 0;
  }
})();

setInterval(() => {
  try {
    const mtime = fs.statSync(RESTART_FILE).mtimeMs;
    if (mtime !== lastMtime) {
      console.log("Restart file updated, restarting...");
      process.exit(1);
    }
  } catch {}
}, 5000);

app
  .prepare()
  .then(() => {
    createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error("Error occurred handling", req.url, err);
        res.statusCode = 500;
        res.end("Internal Server Error");
      }
    })
      .once("error", (err) => {
        console.error(err);
        process.exit(1);
      })
      .listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
      });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });

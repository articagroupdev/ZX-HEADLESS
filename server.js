const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");

const dev = false;
const port = process.env.PORT || 3000;
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

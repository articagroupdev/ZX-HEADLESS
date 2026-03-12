const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

// Forzar modo producción en cPanel para ahorrar recursos
const dev = false;
const port = process.env.PORT || 3000;

// Usar el directorio de build por defecto (.next)
const app = next({ dev, conf: { distDir: ".next" } });
const handle = app.getRequestHandler();

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


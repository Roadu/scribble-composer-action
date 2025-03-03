import { Button, Frog } from "frog";
import { RedisCache } from "./lib/redis";

const title = "Scribble Action";
const browserLocation = "https://scribble-composer-action.roadu.workers.dev";
const externalRoute = "https://scribbleonchain.com";
const aboutUrl = "https://github.com/roadu/scribble-composer-action";
const aboutUrlWorker =
  "https://github.com/roadu/scribble-composer-action";
/* const qrCode =
  "https://r2.fc-clients-cast-action.artlu.xyz/qr-install-keccak256-composer-action.png";
 */
export const app = new Frog<{ Bindings: Bindings }>({
  browserLocation,
  title,
  verify: true,
});

app/* 
  .frame("/qrcode", (c) => c.res({ image: qrCode, imageAspectRatio: "1:1" })) */
  .composerAction(
    "/",
    async (c) => {
      const oneTimeUrl = `${browserLocation}/draw`;

      return c.res({ title, url: oneTimeUrl });
    },
    {
      name: "Scribble",
      description: "Scribble Drawings",
      icon: "pencil",
      aboutUrl: aboutUrlWorker,
      imageUrl:
        "https://scribbleonchain.com/icon-256.png",
    }
  )
  .hono.get("/draw", (c) => {
    const url = new URL(externalRoute);
    url.search = c.req.url.split("?")[1] || ""; // Copy all query parameters

    // Return an HTML page that loads the external content in an iframe
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body, html {
              margin: 0;
              padding: 0;
              min-width: 375px;
              min-height: 667px;
              width: 100%;
              height: 100vh;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            iframe {
              min-width: 375px;
              min-height: 667px;
              width: 100%;
              height: 100%;
              max-width: 100vw;
              max-height: 100vh;
              border: none;
              margin: 0;
              padding: 0;
              overflow: hidden;
              box-sizing: border-box;
            }
          </style>
        </head>
        <body>
          <iframe src="${url.toString()}"></iframe>
          <script>
            // Listen for messages from the iframe and forward them to the parent
            window.addEventListener('message', function(event) {
              // Only forward messages from our trusted external domain
              if (event.origin === '${new URL(externalRoute).origin}') {
                window.parent.postMessage(event.data, '*');
              }
            });
          </script>
        </body>
      </html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  });

export default app;

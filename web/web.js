const http = require("http");
const fs = require("fs");
const path = require("path");

const port = 8000;

http
  .createServer(function (request, response) {
    console.log("Request:", request.url);

    let filePath = "." + request.url;
    if (filePath == "./") {
      filePath = "./index.html";
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
      ".html": "text/html",
      ".js": "text/javascript",
      ".css": "text/css",
      ".json": "application/json",
      ".png": "image/png",
      ".jpg": "image/jpg",
      ".gif": "image/gif",
      ".wav": "audio/wav",
      ".mp4": "video/mp4",
      ".woff": "application/font-woff",
      ".ttf": "application/font-ttf",
      ".eot": "application/vnd.ms-fontobject",
      ".otf": "application/font-otf",
      ".svg": "application/image/svg+xml",
    };

    const contentType = mimeTypes[extname] || "application/octet-stream";

    fs.readFile(filePath, function (error, content) {
      if (error) {
        if (error.code == "ENOENT") {
          response.writeHead(404);
          response.end("404 - Not Found");
        } else {
          response.writeHead(500);
          response.end("500 - Internal Server Error");
        }
      } else {
        response.writeHead(200, { "Content-Type": contentType });
        response.end(content, "utf-8");
      }
    });
  })
  .listen(port);

console.log(`Server running at http://localhost:${port}`);

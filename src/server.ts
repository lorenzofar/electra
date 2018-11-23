/* ===== EXTERNAL MODULES ===== */
require("dotenv").config();
import * as http from "http";

/* ===== CUSTOM MODULES ===== */
import Emitter from "./emitter";

const { PORT = 3000 } = process.env; // Get custom port oof fall back to 3000

/* ===== SERVER INITIALIZATION ===== */
const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end("server up");
})
server.listen(PORT, () => {
    console.log(`> server listening on port ${PORT}`)
});

/* ===== WEBSOCKET CONFIGURATION ===== */
Emitter.configureSocket(server);
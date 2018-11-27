/* ===== EXTERNAL MODULES ===== */
require("dotenv").config();
import * as http from "http";
import * as figlet from "figlet";

/* ===== CUSTOM MODULES ===== */
import Emitter from "./emitter";

const { PORT = 3000 } = process.env; // Get custom port oof fall back to 3000

const dolphin =
`                                                          __
                              .__                         / |
                             /  /                         |  \
                            /   |                     _-------'_
                       ____/     \_________      __--"      _/  \_
         _______------"                    "----"          _-\___/
     _--"                                               _-"
 ___<___                                          ___--"
(-------0                                   __---"
 '--___                                    /
       "--___\                _______-----"
             \\    (____-----"
              \\    \_
               '.'..__\ `

/* ===== SERVER INITIALIZATION ===== */
const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end("server up");
})
server.listen(PORT, () => {
    console.log(figlet.textSync('ELECTRA'));
    console.log(dolphin);
    console.log(`> server listening on port ${PORT}`)
});

/* ===== WEBSOCKET CONFIGURATION ===== */
Emitter.configureSocket(server);

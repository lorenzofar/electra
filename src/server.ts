/* ===== EXTERNAL MODULES ===== */
require("dotenv").config();
import * as http from "http";
import * as figlet from "figlet";

import * as serveStatic from "serve-static";

/* ===== CUSTOM MODULES ===== */
import Emitter from "./emitter";

const { PORT = 3000 } = process.env; // Get custom port oof fall back to 3000

const dolphin =
    `
                                   __
                               _.-~  )
                    _..--~~~~,'   ,-/     _
                 .-'. . . .'   ,-','    ,' )
               ,'. . . _   ,--~,-'__..-'  ,'
             ,'. . .  (@)' ---~~~~      ,'
            /. . . . '~~             ,-'
           /. . . . .             ,-'
          ; . . . .  - .        ,'
         : . . . .       _     /
        . . . . .          '-.:
       . . . ./  - .          )
      .  . . |  _____..---.._/ _____
~---~~~~----~~~~             ~~
`
/* ===== SERVE FILES ===== */
const serve = serveStatic("public", { "index": ["index.html"] });

/* ===== SERVER INITIALIZATION ===== */
const server = http.createServer((req: any, res: any) => {
    serve(req, res, null);
})

server.listen(PORT, () => {
    console.log(figlet.textSync('ELECTRA'));
    console.log(dolphin);
    console.log(`> server listening on port ${PORT}`)
});

/* ===== WEBSOCKET CONFIGURATION ===== */
Emitter.configureSocket(server);

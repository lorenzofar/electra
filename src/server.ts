/* ===== EXTERNAL MODULES ===== */
require("dotenv").config();
import * as express from "express";
import * as cookieParser from "cookie-parser";

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
var app: express.Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.static("./public"));

var router = express.Router();
router.get("/", (req: express.Request, res: express.Response) => {
    res.render("index");
});

app.use("/", router);


const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(figlet.textSync('ELECTRA'));
    console.log(dolphin);
    console.log(`> server listening on port ${PORT}`)
});

/* ===== WEBSOCKET CONFIGURATION ===== */
Emitter.configureSocket(server);

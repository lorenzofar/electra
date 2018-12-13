/* ===== EXTERNAL MODULES ===== */
require("dotenv").config();
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
const cookieSession = require("cookie-session");
import * as path from "path";

import * as http from "http";
import * as figlet from "figlet";

/* ===== CUSTOM MODULES ===== */
import Emitter from "./emitter";
import { TokenData, TokenHelper } from "./tokenHelper";
import Validator from "./validator";

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

/* ===== SERVER INITIALIZATION ===== */
var app: express.Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser());

app.use(cookieSession({
    name: "session",
    keys: [process.env.COOKIE_SECRET]
}));

app.set("view engine", "pug");
app.use(express.static('./public'));

var router = express.Router();
router.get("/", (req: express.Request, res: express.Response) => {
    let token = req.session && req.session.token;

    if (token) {
        // The token exists
        // Check if it is valid
        // If not, remove it
        TokenHelper.parseToken(token, (decoded) => {
            if (decoded != null) {
                // The token is valid
                if (decoded.admin) { // Check if the user is an admin
                    //FIXME: Also handle the case where the user is not an admin
                    res.render("index");
                }
                else {
                    res.render("error");
                }
            }
            else {
                // TODO: Nella pagina di errore mettere anche un pulsante per fare il login
                res.clearCookie("test");
                res.render("error");
            }
        });
    }
    else {
        res.render("login");
    }
});

router.post("/login", (req: express.Request, res: express.Response) => {
    if (!req.body) return res.status(400).end();
    let username = req.body && req.body.username;
    let password = req.body && req.body.password;
    if (!username || !password) return res.status(400).end();

    console.log(`[SERVER] ${username} is trying to load the dashboard`);

    Validator.validateDashboardAccess(username, password, (authorized: boolean, admin: boolean) => {
        if (!authorized) {
            // The user is not authorized to log in
            return res.redirect(403, "../error");
        }

        // Here the user is authorized
        let tokenData: TokenData = {
            username: username,
            password: password,
            admin: admin
        }
        let token = TokenHelper.signToken(tokenData);

        console.log(`[SERVER] dashboard access granted to ${username}`);

        req.session.token = token;
        res.redirect(200, "../");
    });
});

router.get("/logout", (req: express.Request, res: express.Response) => {
    console.log("[SERVER] logging out");
    req.session.token = null;
    res.render("logout");
});

//TODO: Add something to let the user log and retrieve the token
router.get("/credentials", (req: express.Request, res: express.Response) => {
    let token = req.session && req.session.token;
    //TODO: Handle null cookies
    TokenHelper.parseToken(token, (credentials) => {
        if (credentials == null) {
            res.clearCookie("token");
            res.redirect("../error");
        }
        else res.status(200).send(credentials);
    })
});

router.get("/error", (req: express.Request, res: express.Response) => {
    res.render("error");
})

app.use("/", router);

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(figlet.textSync('ELECTRA'));
    console.log(dolphin);
    console.log(`> server listening on port ${PORT}`)
});

/* ===== WEBSOCKET CONFIGURATION ===== */
Emitter.configureSocket(server);

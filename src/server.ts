/* ===== EXTERNAL MODULES ===== */
require("dotenv").config();
import * as express from "express";
import * as cookieParser from "cookie-parser";
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
app.set("view engine", "pug");
app.use(express.static('./public'));

var router = express.Router();
router.get("/", (req: express.Request, res: express.Response) => {
    //TODO: Check cookies
    let token = req.cookies && req.cookies.token;

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

router.get("/login", (req: express.Request, res: express.Response) => {
    console.log(req.query);
    if (!req.query) return res.status(400).end();
    let username = req.query.username;
    let password = req.query.password;
    if (!username || !password) return res.status(400).end();

    console.log(`[SERVER] ${username} is trying to load the dashboard`);

    //FIXME: TODO: Perform a login with NECST APIs
    let loginResult: boolean = true;

    if (!loginResult) return res.status(403).end();

    // Retrieve role

    //Sign token
    let tokenData: TokenData = {
        username: username, 
        password: password,
        admin: true //FIXME:
    }
    let token = TokenHelper.signToken(tokenData);
    res.cookie("token", token);

    console.log(`[SERVER] dashboard access granted to ${username}`);
    console.log(`[SERVER] signed token ${token}`);

    res.status(200).redirect("/");
});

//TODO: Add something to let the user log and retrieve the token
router.get("/credentials", (req: express.Request, res: express.Response) => {
    //TODO: Parse token and return credentials
    console.log(req.cookies);
    let token = req.cookies && req.cookies.token;
    //TODO: Handle null cookies
    TokenHelper.parseToken(token, (credentials) => {
        console.log("I received credentials");
        if (credentials == null) {
            res.clearCookie("token");
            res.redirect("/error");
        }
        else res.status(200).send(credentials);
    })
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

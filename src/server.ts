/* ===== EXTERNAL MODULES ===== */
import * as polka from "polka";
import * as http from "http";

/* ===== CUSTOM MODULES ===== */
import Emitter from "./emitter";

const port = process.env.PORT || 3000;

const app = http.createServer();
Emitter.initialize(app);

polka({ app })
    .get('/', (req, res) => {
        res.end("Server up");
    })
    .listen(port, err => {
        if (err) throw err;
        console.log(`> Running on localhost:3000`);
    });
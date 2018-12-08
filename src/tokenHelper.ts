import * as jwt from "jsonwebtoken";
import * as moment from "moment";

const SEED_MAX = 10000;
const SEED_MIN = 500;

export interface TokenData {
    username: string;
    password: string;
    admin: boolean;
}

interface TokenDataaScrambled extends TokenData{
    seed: number; // random value to scramble encryption
}

export class TokenHelper {
    private static get secret() {
        let { JWT_SECRET = "" } = process.env;
        return JWT_SECRET;
    }

    public static signToken(data: TokenData): string {
        //TODO: Add an expiration date if needed
        if (data == null) return null;
        let scrambled: TokenDataaScrambled = {
            admin: false,
            username: "",
            password: "",
            seed: null
        };
        Object.assign(scrambled, data);
        scrambled.seed = this.seed;
        let token = jwt.sign(scrambled, this.secret);
        return token;
    }

    public static parseToken(token: string, callback: (data: TokenData) => void) {

        jwt.verify(token, this.secret, (err, decoded: TokenData) => {
            if(err) return callback(null);
            callback(decoded);
        })
    }

    private static get seed(){
        // Returns the current timestamp to which is added a random number
        let rand = Math.floor(Math.random() * (SEED_MAX - SEED_MIN) + SEED_MIN);    
        let timestamp = moment().unix();
        return rand + timestamp;
    }
}
import * as messages from "./models/messages";
import CacheManager from "./cacheManager";
import dbClient from "./dbManager";
import * as encryption from "./encryption";

class Validator {
    public static validateHandshake(handshake: messages.socketHandshake, callback: (result: boolean) => void): void {
        /**
         * This method checks if a user can connect to the server or not.
         * It checks:
         *      - whther the username is valid (RegEx)
         *      - whether the username is already connected
         *      - if the password is not empty
         *      - If the credentials are correct
         * If all the above tests are succesfull, the method returns true,
         * if not or if an operation times out (standard http timeout), returns false
         */

        if (!handshake) {
            callback(false); // If data are null, stop
            return;
        }

        let username = handshake.username; // Get provided username
        let password = handshake.password; // Get provided password
        let tempCheckHolder = username != null;
        if (!tempCheckHolder) {
            callback(false); // If the provided username is not valid, stop
            return;
        }

        // Check if the user is present in database
        // Try to login and pass the result back the callcback
        if (handshake.mode === "provider") {
            if (CacheManager.isUserPresent(username)) { // Check if the client associated to the username is already connected
                return callback(false); // The user is already connected
            }
            this.login(username, password, (result) => {
                if (result) callback(true);
                else callback(false);
            });
        }
        else {
            this.validateDashboardAccess(username, password, (authorized, admin) => {
                if (!authorized || (authorized && !admin)) callback(false);
                else callback(true);
            });
        }


    }

    public static validateDashboardAccess(username: string, password: string, callback: (authorized: boolean, admin: boolean) => void) {
        this.login(username, password, (result) => {
            if (!result) callback(false, false);
            else if (result && result.admin) callback(true, true);
            else callback(true, false);
        });
    }

    public static login(username: string, password: string, callback: (result: any) => void) {
        dbClient("users").select("*").where({ username: username })
            .then((result: any[]) => {

                if (!result.length) return callback(null)

                let hashed: string = result[0].password;

                encryption.compare(password, hashed)
                    .then((match: boolean) => {
                        callback(result[0]);
                    })
                    .catch((err) => {
                        callback(null);
                    })
            });
    }
}

export default Validator;
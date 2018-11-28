import * as request from "request";

import * as messages from "./models/messages";
import * as constants from "./constants";
import CacheManager from "./cacheManager";

class Validator {
    public static validateHandshake(handshake: messages.socketHandshake, callback: (result: boolean) => void): void {
        /**
         * This method checks if a user can connect to the server or not.
         * It checks:
         *      - whther the email is valid (RegEx)
         *      - whether the email is already connected
         *      - if the password is not empty
         *      - If the credentials are correct
         * If all the above tests are succesfull, the method returns true,
         * if not or if an operation times out (standard http timeout), returns false
         */

        if (!handshake) {
            callback(false); // If data are null, stop
            return;
        }

        let email = handshake.email; // Get provided email
        let tempCheckHolder = email && constants.MAILADDR_REGEX.test(email); // Test email against regex
        if (!tempCheckHolder) {
            callback(false); // If the provided email is not valid, stop
            return;
        }

        // Check if the email is already connected

        tempCheckHolder = CacheManager.isUserPresent(email); // Check if the client associated to the email is already connected
        if (tempCheckHolder) {
            callback(false); // The user is already connected
            return;
        }

        //FIXME: Use temporary override until APIs are available
        callback(true);

        // try to login 
        /*
        //FIXME: Use Basic authentication when submitting request
        request
            .get(`${constants.BASE_URL}/login`, (err, response, body) => {
                if (err) { // An error occurred performing the request
                    console.log(err);
                    callback(false);
                }
                else { // All's well that ends well
                    callback(true);
                };
            });
        */
    }
}

export default Validator;
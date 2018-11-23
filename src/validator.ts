import * as messages from "./models/messages";

class Validator {
    public static validateHandshake(handshake: messages.socketHandshake): boolean {
        /* TODO: Check if the data provided by the client are valid 
            and if its identity is verified
        */  
        return true;
    }
}

export default Validator;
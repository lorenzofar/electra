import * as socket_io from "socket.io";
import { Server } from "http";

import * as messages from "./models/messages";

import Validator from "./validator";

class Emitter {
    private static io: socket_io.Server = null;

    static initialize() {
        this.incomingConnectionHandler = this.incomingConnectionHandler.bind(this);
        this.disconnectionHandler = this.disconnectionHandler.bind(this);
    }

    public static configureSocket(server: Server) {
        this.io = socket_io(server);
        this.io.on("connection", this.incomingConnectionHandler);
    }

    private static incomingConnectionHandler(socket: socket_io.Socket) {
        /**
         * ===== PURPOSE =====
         * This method is fired each time a client tries to connect to the server
         * It is meant to act as a gate and to let pass only valid clients
         * It should hence check whether the provided data are correct and 
         * if another client with the same identity exists
         * 
         * ===== WORKFLOW =====
         * - The method receives, during handshake, the email and password associated to an account
         * - It first validates the data:
         *      - check if is a valid email
         *      - check if the email has already been used
         *      - check if the password is not empty
         * - Then tries to log the user in with the provided credentials
         * - If the login is succesful, add a new entry in the cache
         * 
         * ===== NOTES =====
         * The client sends just the email and password of the user hence, if we 
         * would like to know its name, we should query the server to return its data.
         */

        // Get handshake provided by candidate client
        let clientData: messages.socketHandshake = socket.handshake.query;

        // Check if the client that is trying to connect can do it
        // If not, send an error message and close the connection

        Validator.validateHandshake(clientData, (result: boolean) => {
            if (!result) {
                socket.send("unathorized").disconnect();
                return;
            }
            // The client passed the test, it can connect
            // Add it to the swarm
            console.log(`${clientData.email} is connnected`);

            // Add disconnection listener to detect when a client goes offline
            socket.on("disconnect", this.disconnectionHandler.bind(this, socket, clientData.email));
            //TODO: Save client data and bind disconnection handler to him
        });
    }

    private static disconnectionHandler(socket: socket_io.Socket, email: string) {
        console.log(`${email} disconnected`);
    }
}

Emitter.initialize();

export default Emitter;

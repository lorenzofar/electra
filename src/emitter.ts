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
        let clientData: messages.socketHandshake = socket.handshake.query;

        // Check if the client that is trying to connect can do it
        // If not, send an error message and close the connection
        if (!Validator.validateHandshake(clientData))
            socket.send("unauthorized").disconnect();

        // The client passed the test, it can connect
        // Add it to the swarm 
        console.log(`${clientData.email} is connnected`);

        // Add disconnection listener to detect when a client goes offline
        socket.on("disconnect", this.disconnectionHandler.bind(this, socket, clientData.email));
        //TODO: Save client data and bind disconnection handler to him

    }

    private static disconnectionHandler(socket: socket_io.Socket, email: string) {
        console.log(`${email} disconnected`);
    }
}

Emitter.initialize();

export default Emitter;
import * as socket_io from "socket.io";
import { Server } from "http";

import * as messages from "./models/messages";

import Validator from "./validator";
import Dispatcher from "./dispatcher";
import SwarmManager from "./swarmManager";
import CacheManager from "./cacheManager";

import Listener from "models/listener";
import Client from "models/client";

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
         * - The method receives, during handshake, the username and password associated to an account
         * - It first validates the data:
         *      - check if is a valid username
         *      - check if the username has already been used
         *      - check if the password is not empty
         * - Then tries to log the user in with the provided credentials
         * - If the login is succesful, add a new entry in the cache
         * 
         * ===== NOTES =====
         * The client sends just the username and password of the user hence, if we 
         * would like to know its name, we should query the server to return its data.
         */

        // Get handshake provided by candidate client
        let clientData: messages.socketHandshake = socket.handshake.query;

        console.log(`[EMITTER] received handshake from ${clientData.username}`);

        // Check if the client that is trying to connect can do it
        // If not, send an error message and close the connection

        Validator.validateHandshake(clientData, (result: boolean) => {
            console.log(`[EMITTER] validation result for ${clientData.username}: ${result}`);
            if (!result) {
                socket.send("unathorized").disconnect();
                return;
            }
            // The client passed the test, it can connect
            // Add it to the swarm
            console.log(`[EMITTER] ${clientData.username} is connnected / mode: ${clientData.mode}`);

            // Add disconnection listener to detect when a client goes offline
            socket.on("disconnect", this.disconnectionHandler.bind(this, socket, clientData.username, clientData.mode));
            //TODO: Save client data and bind disconnection handler to him

            if (clientData.mode == "listener") {
                let newListener: Listener = {
                    socket: socket,
                    username: clientData.username,
                    admin: false
                }
                //TODO: Assign admin rights
                let additionResult = Dispatcher.addListener(newListener);
                if (!additionResult) {
                    socket.send("insertionError").disconnect();
                    return;
                }
            } else {
                let newClient: Client = {
                    socket: socket,
                    username: clientData.username
                }
                let additionResult = SwarmManager.addClient(newClient);
                if (!additionResult) {
                    // Check if the client has been succesfully added to the swarm
                    // If not, send an error message and disconnect
                    socket.send("insertionError").disconnect();
                    return;
                }
                // Add listener for data point events
                // Bind method to client information
                socket.on("data",
                    CacheManager.handleIncomingDataPoint.bind(this, socket, clientData.username)
                );
            }
        });
    }

    private static disconnectionHandler(socket: socket_io.Socket, username: string, mode: "listener" | "provider") {
        //TODO: Find a way to know whether the disconnected client is a listener or a provider
        console.log(`[EMITTER] ${username} disconnected`);
        if (mode === "listener") {
            Dispatcher.removeListener(username);
        }
        else {
            SwarmManager.removeClient(username);
        }
    }

    public static emit(event: string, data: any){
        if(!event || !data) return;
        this.io.emit(event, data);
    }
}

Emitter.initialize();

export default Emitter;

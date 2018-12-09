import * as io from "socket.io-client";

const patch = require("socketio-wildcard")(io.Manager);

interface SubscriptionMap{
    [event: string]: Function[]; // List of handlers for each socket event
}

class SocketManager {
    private socket: SocketIOClient.Socket = null;

    private static subscriptionMap: SubscriptionMap = {};

    constructor(username: string, password: string){
        // Check provided data
        if(!username || !password) return;
              
        let qs = `username=${username}&password=${password}&mode=listener`;
        this.socket = io({query: qs});
        patch(this.socket); // Add socketio wildcard

        this.socket.on("connect", () => {
            console.log("Connected to server");
            this.socket.on("*", this.handleSocketEvent);
        })
    }

    private handleSocketEvent(message: any){
        /**
         * Here we handle events received by the server
         * Becuase of our architecture, we need to notify all the 
         * handlers of those event.
         */
        let event = message.data[0];
        let data = message.data[1];

        console.log(`[SOCKET] arrived ${event} message`);

        if(!(event in SocketManager.subscriptionMap)) return;

        // Pass the data to all the subscribed handlers of the event
        SocketManager.subscriptionMap[event].forEach(handler => handler(data));
    }

    public static subscribe(event: string, handler: Function): boolean{
        if(!event || !handler) return false;
        //FIXME: possible memory leaks if someone keeps pushing the same functio over and over
        if(!(event in this.subscriptionMap)) this.subscriptionMap[event] = [];
        this.subscriptionMap[event].push(handler);
        console.log(`[SOCKET] a module subscribed for ${event} event`);
        return true;
    }
}

export default SocketManager;
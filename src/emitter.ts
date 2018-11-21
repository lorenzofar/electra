import * as socket_io from "socket.io";
import { Server } from "http";

class Emitter {
    private static _instance: Emitter = null;
    private static io: socket_io.Server = null;

    static Emitter(){
        this.incomingConnectionHandler = this.incomingConnectionHandler.bind(this);
    }

    public static initialize(server: Server) {
        this.io = socket_io(server);
        this.io.on("connection", this.incomingConnectionHandler);
    }

    public static getInstance() {
        if (!this._instance) this._instance = new Emitter();
        return this._instance;
    }

    private static incomingConnectionHandler(){
        // Triggered when a new device connects to socket
    }
}

export default Emitter.getInstance();
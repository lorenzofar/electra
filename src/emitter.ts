import * as socket_io from "socket.io";
import { Server } from "http";

class Emitter {
    private static _instance: Emitter = null;
    private static io: socket_io.Server = null;

    private static Emitter() {
        this.incomingConnectionHandler = this.incomingConnectionHandler.bind(this);
    }

    public initialize(server: Server) {
        Emitter.io = socket_io(server);
        Emitter.io.on("connection", Emitter.incomingConnectionHandler);
    }

    public static get Instance(): Emitter {
        if (!this._instance) this._instance = new Emitter();
        return this._instance;
    }

    private static incomingConnectionHandler(socket: socket_io.Socket) {
        // Triggered when a new device connects to socket
    }
}

export default Emitter.Instance;
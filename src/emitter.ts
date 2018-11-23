import * as socket_io from "socket.io";
import { Server } from "http";

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
        console.log("client connected");
        socket.on("disconnect", this.disconnectionHandler);
        //TODO: Save client data and bind disconnection handler to him
        
    }

    private static disconnectionHandler(socket: socket_io.Socket){
        console.log("client disconnected");
    }
}

Emitter.initialize();

export default Emitter;
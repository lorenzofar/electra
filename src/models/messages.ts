/**
 * This interface provides a definition of the messages
 * exchanged by the server and the device
 */

 /**
  * This interface defines the format of messages exchanged during socket handshake
  * It extends the base class of SocketIO.Handshake
  * mode property is used to determine whether a client is providing or listening to data
  */
 export interface socketHandshake extends SocketIO.Handshake{
    username: string;
    password: string;
    mode: "provider" | "listener";
 }
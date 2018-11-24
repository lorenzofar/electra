/**
 * This interface provides a definition of the messages
 * exchanged by the server and the device
 */

 /**
  * This interface defines the format of messages exchanged during socket handshake
  * It extends the base class of SocketIO.Handshake
  */
 export interface socketHandshake extends SocketIO.Handshake{
    email: string;
    password: string;
 }
import Client from "./client";
import Listener from "./listener";
import DataPoint from "./dataPoint";

export default interface cacheEntry{
    user: Client | Listener; // Socket, admin rights and email
    data: DataPoint[]; // Collection of data points
}
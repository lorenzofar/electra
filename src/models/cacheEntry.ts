import Client from "./client";
import DataPoint from "./dataPoint";

export default interface cacheEntry{
    user: Client; // Socket, admin rights and username
    data: DataPoint[]; // Collection of data points
    active: boolean; // Store information about the connection status of the device
    TTL: number;
}
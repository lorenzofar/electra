import * as socket_io from "socket.io";
import * as moment from "moment";

import Cache from "models/cache";
import Client from "models/client";
import DataPoint from "models/dataPoint";

const CACHE_LENGTH = 100; // The number of most recent data points to keep

class CacheManager {
    private static _cache: Cache = {};

    public static initialize(){
        this.isUserPresent = this.isUserPresent.bind(this);
        this.handleIncomingDataPoint = this.handleIncomingDataPoint.bind(this);
    }


    /* ===== CACHE MANAGEMENT ===== */
    public static addEntry(user: Client): boolean {

        if (this.isUserPresent(user.email)) return false;
        this._cache[user.email] = {
            user: user,
            data: []
        };
        return true;
    }

    public static removeEntry(email: string): boolean {
        if (!(this.isUserPresent(email))) return false;
        delete this._cache[email];
        console.log(`[CACHE] remove entry for ${email}`);
        return true;
    }

    /* ===== DATA PROVIDERS ===== */
    public static get keys(): string[] {
        return Object.keys(this._cache);
    }

    public static get users(): Client[]{
        return Object.keys(this._cache).map(k => this._cache[k].user);
    }

    public static getUser(key: string) {
        if (!(key in this._cache)) return null;
        return this._cache[key].user;

    }
    public static getData(key: string) {
        if (!(key in this._cache)) return null;
        return this._cache[key].data;
    }

    /* ===== DATA HANDLING ===== */
    //FIXME: Change datatype of parameter
    public static handleIncomingDataPoint(socket: socket_io.Socket, email: string, dataPoint: DataPoint){
        console.log(`[CACHE] received data point from ${email}`);
        console.log(`[CACHE] ${email} says '${dataPoint}'`);
        // Check if the user exists in the cache
        if(this.isUserPresent(email)){
            let len = this._cache[email].data.length; // Get current number of elements
            if(len > CACHE_LENGTH) this._cache[email].data.shift(); // Remove oldest element id needed
            dataPoint.timestamp = moment().unix(); // Get current timestamp
            this._cache[email].data.push(); // Add data point to cache
        }
        else{
            socket.send("usernotfound").disconnect(); // The user is not connected, disconnect the client
        }
    }

    /* ===== UTILITIES ===== */
    /**
     * Check if a user is already in cache
     * @param id ID of user to test
     */
    public static isUserPresent(id: string): boolean {
        if (id in this._cache) return true;
        else return false;
    }

}

CacheManager.initialize();

export default CacheManager;
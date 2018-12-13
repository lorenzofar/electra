import * as socket_io from "socket.io";
import * as moment from "moment";

import Cache from "./models/cache";
import Client from "./models/client";
import DataPoint from "./models/dataPoint";
import Dispatcher from "./dispatcher";
import Emitter from "./emitter";

const CACHE_LENGTH = 100; // The number of most recent data points to keep

interface parsedCacheEntry {
    username: string;
    data: DataPoint[];
}

class CacheManager {
    private static _cache: Cache = {};

    public static initialize() {
        this.isUserPresent = this.isUserPresent.bind(this);
        this.handleIncomingDataPoint = this.handleIncomingDataPoint.bind(this);
    }


    /* ===== CACHE MANAGEMENT ===== */
    public static addEntry(user: Client): boolean {

        if (this.isUserPresent(user.username)) return false;
        this._cache[user.username] = {
            user: user,
            data: []
        };
        return true;
    }

    public static removeEntry(username: string): boolean {
        if (!(this.isUserPresent(username))) return false;
        delete this._cache[username];
        console.log(`[CACHE] remove entry for ${username}`);
        return true;
    }

    /* ===== DATA PROVIDERS ===== */
    public static get keys(): string[] {
        return Object.keys(this._cache);
    }

    public static get users(): Client[] {
        return Object.keys(this._cache).map(k => this._cache[k].user);
    }

    public static get parsedCache(): parsedCacheEntry[] {
        // Only return usernames and data arrays
        let parsedCache: parsedCacheEntry[] = Object.keys(this._cache).map(k => {
            return {
                username: k,
                data: this._cache[k].data
            };
        });
        return parsedCache;
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
    public static handleIncomingDataPoint(socket: socket_io.Socket, username: string, dataPoint: DataPoint) {
        // Check if the user exists in the cache
        if (this.isUserPresent(username)) {
            let len = this._cache[username].data.length; // Get current number of elements
            if (len > CACHE_LENGTH) this._cache[username].data.shift(); // Remove oldest element id needed
            dataPoint.timestamp = moment().unix(); // Get current timestamp
            this._cache[username].data.push(dataPoint); // Add data point to cache
            let dispatchedPoint = {
                username: username,
                data: dataPoint
            };
            Dispatcher.notifyListeners("datapoint", dispatchedPoint); // Send data point to listeners

        }
        else {
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
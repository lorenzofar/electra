import * as socket_io from "socket.io";
import * as moment from "moment";

import Cache from "./models/cache";
import Client from "./models/client";
import DataPoint from "./models/dataPoint";
import Dispatcher from "./dispatcher";

const CACHE_LENGTH = 100; // The number of most recent data points to keep
const TTL_MAX = 10 /* minutes */ * 60 /*seconds*/; // The maximum time to wait for a device to restore its connection

interface parsedCacheEntry {
    username: string;
    data: DataPoint[];
}

class CacheManager {
    private static _cache: Cache = {};

    public static initialize() {
        this.isUserPresent = this.isUserPresent.bind(this);
        this.handleIncomingDataPoint = this.handleIncomingDataPoint.bind(this);
        this.cacheCleaner = this.cacheCleaner.bind(this);

        setInterval(this.cacheCleaner, 1000); // run cache cleaning job every 1 second
    }

    /* ===== CACHE MANAGEMENT ===== */
    public static addEntry(user: Client): boolean {

        if (this.isUserPresent(user.username)) {
            // Check if the user is not active 
            // This is the case when a user has disconnected but
            // has not yet been removed from cache
            if (!this._cache[user.username].active) {
                // Set the user to active
                this._cache[user.username].active = true;
                // Reincrease its TTL
                this._cache[user.username].TTL = TTL_MAX;
                console.log(`[CACHE] ${user.username} connnected back`);
                return true;
            }
            else return false;
        }
        else {
            this._cache[user.username] = {
                user: user,
                data: [],
                active: true,
                TTL: TTL_MAX
            };
            return true;
        }
    }

    public static removeEntry(username: string): boolean {
        if (!(this.isUserPresent(username))) return false;
        //delete this._cache[username];
        this._cache[username].active = false; // Set connection status to offline
        console.log(`[CACHE] set ${username} offline`);
        return true;
    }

    private static cacheCleaner() {
        //this method is used to keep the cache clean from users that have been inactive for too much time
        // First get all the inactive users
        let inactiveUsers = Object.keys(this._cache).filter(k => !this._cache[k].active);
        // decrease TTL
        inactiveUsers.forEach(k => this._cache[k].TTL--);
        // Get users whose TTL is null
        inactiveUsers = inactiveUsers.filter(k => this._cache[k].TTL <= 0);
        // Remove them from cache
        inactiveUsers.forEach(k => {
            delete this._cache[k];
            console.log(`[CACHE] removed ${k} from cache`);
        });
    }

    /* ===== DATA PROVIDERS ===== */
    public static get keys(): string[] {
        return Object.keys(this._cache);
    }

    public static get users(): Client[] {
        // Only return active clients
        return Object.keys(this._cache).filter(k => this._cache[k].active).map(k => this._cache[k].user);
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
            Dispatcher.notifyData("datapoint", dispatchedPoint); // Send data point to listeners

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
        if (id in this._cache && this._cache[id].active) return true;
        else return false;
    }

}

CacheManager.initialize();

export default CacheManager;
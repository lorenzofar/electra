import * as socket_io from "socket.io";

import Cache from "models/cache";
import Client from "models/client";

class CacheManager {
    private static _cache: Cache = {};

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
    //TODO: Change datatype of parameter
    public static handleIncomingDataPoint(socket: socket_io.Socket, email: string, dataPoint: any){
        console.log(`[CACHE] received data point from ${email}`);
        console.log(`[CACHE] ${email} says '${dataPoint}'`);
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

export default CacheManager;
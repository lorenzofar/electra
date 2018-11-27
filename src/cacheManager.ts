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
        return true;
    }

    /* ===== DATA PROVIDERS ===== */
    public static get keys(): string[] {
        return Object.keys(this._cache);
    }

    public static getUser(key: string) {
        if (!(key in this._cache)) return null;
        return this._cache[key].user;

    }
    public static getData(key: string) {
        if (!(key in this._cache)) return null;
        return this._cache[key].data;
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
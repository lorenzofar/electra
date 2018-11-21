import UsersCache from "models/usersCache";
import User from "models/user";

class CacheManager {

    private static _instance: CacheManager = null;
    private static _cache: UsersCache = {};

    public static get Instance(): CacheManager {
        if (this._instance) this._instance = new CacheManager();
        return this._instance;
    }

    /* ===== CACHE MANAGEMENT ===== */
    public addEntry(user: User): boolean {

        if (this.isUserPresent(user.id)) return false;
        CacheManager._cache[user.id] = {
            user: user,
            data: []
        };
        return true;
    }

    public removeEntry(id: string): boolean {
        if (!(this.isUserPresent(id))) return false;
        delete CacheManager._cache[id];
        return true;
    }

    /* ===== DATA PROVIDERS ===== */
    public get keys(): string[] {
        return Object.keys(CacheManager._cache);
    }

    public getUser(key: string) {
        if (!(key in CacheManager._cache)) return null;
        return CacheManager._cache[key].user;

    }
    public getData(key: string) {
        if (!(key in CacheManager._cache)) return null;
        return CacheManager._cache[key].data;
    }

    /* ===== UTILITIES ===== */
    /**
     * Check if a user is already in cache
     * @param id ID of user to test
     */
    private isUserPresent(id: string): boolean {
        if (id in CacheManager._cache) return true;
        else return false;
    }

}

export default CacheManager.Instance;
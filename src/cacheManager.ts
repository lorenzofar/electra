import UsersCache from "models/usersCache";
import User from "models/user";

class CacheManager {
    private static _cache: UsersCache = {};

    /* ===== CACHE MANAGEMENT ===== */
    public static addEntry(user: User): boolean {

        if (this.isUserPresent(user.email)) return false;
        CacheManager._cache[user.email] = {
            user: user,
            data: []
        };
        return true;
    }

    public static removeEntry(email: string): boolean {
        if (!(this.isUserPresent(email))) return false;
        delete CacheManager._cache[email];
        return true;
    }// Validate email

    /* ===== DATA PROVIDERS ===== */
    public static get keys(): string[] {
        return Object.keys(CacheManager._cache);
    }

    public static getUser(key: string) {
        if (!(key in CacheManager._cache)) return null;
        return CacheManager._cache[key].user;

    }
    public static getData(key: string) {
        if (!(key in CacheManager._cache)) return null;
        return CacheManager._cache[key].data;
    }

    /* ===== UTILITIES ===== */
    /**
     * Check if a user is already in cache
     * @param id ID of user to test
     */
    public static isUserPresent(id: string): boolean {
        if (id in CacheManager._cache) return true;
        else return false;
    }

}

export default CacheManager;
import User from "./models/user";
import CacheManager from "./cacheManager";

class SwarmManager {
    private static _instance: SwarmManager = null;

    public static get Instance(): SwarmManager {
        if (this._instance) this._instance = new SwarmManager();
        return this._instance;
    }

    /* ===== PROVIDERS ===== */
    public get activeUsers() {
        let keys = CacheManager.keys; // Get user ids
        return keys.map(k => CacheManager.getUser(k)); // Get user objects
    }

    /* ===== STACK MANAGEMENT ===== */
    public addUser(user: User): boolean {
        //TODO: Notify cacheManager
        let result = CacheManager.addEntry(user);
        return result;
    }

    public removeUser(user: User): boolean {
        //TODO: Notify cacheManager
        let result = CacheManager.removeEntry(user.email);
        return result;
    }
}
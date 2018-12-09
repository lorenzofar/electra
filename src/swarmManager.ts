import Client from "./models/client";
import CacheManager from "./cacheManager";
import Emitter from "./emitter";

class SwarmManager {
    /* ===== PROVIDERS ===== */
    public static get activeUsers() {
        let keys = CacheManager.keys; // Get user ids
        return keys.map(k => CacheManager.getUser(k)); // Get user objects
    }

    /* ===== STACK MANAGEMENT ===== */
    public static addClient(client: Client): boolean {
        let result = CacheManager.addEntry(client);
        //TODO: Notify listeners
        console.log(`[SWARM] ${client.username} addition: ${result ? "success" : "error"}`);
        if(result) Emitter.emit("deviceconnected", client.username);
        return result;
    }

    public static removeClient(username: string): boolean {
        let result = CacheManager.removeEntry(username);
        //TODO: Notify listeners
        console.log(`[SWARM] ${username} removal: ${result ? "success" : "error"}`);
        if(result) Emitter.emit("devicedisconnected", username);
        return result;
    }
}

export default SwarmManager;
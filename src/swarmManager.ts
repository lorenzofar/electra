import Client from "./models/client";
import CacheManager from "./cacheManager";
import Dispatcher from "./dispatcher";

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
        if (result) Dispatcher.notifyConnectionStatus("deviceconnected", client.username);
        return result;
    }

    public static removeClient(username: string): boolean {
        let result = CacheManager.removeEntry(username);
        //TODO: Notify listeners
        console.log(`[SWARM] ${username} removal: ${result ? "success" : "error"}`);
        if (result) Dispatcher.notifyConnectionStatus("devicedisconnected", username);
        return result;
    }
}

export default SwarmManager;
import Client from "./models/client";
import CacheManager from "./cacheManager";

class SwarmManager {
    /* ===== PROVIDERS ===== */
    public static get activeUsers() {
        let keys = CacheManager.keys; // Get user ids
        return keys.map(k => CacheManager.getUser(k)); // Get user objects
    }

    /* ===== STACK MANAGEMENT ===== */
    public static addClient(client: Client): boolean {
        let result = CacheManager.addEntry(client);
        console.log(`[SWARM] ${client.email} addition: ${result ? "success" : "error"}`);
        return result;
    }

    public static removeClient(email: string): boolean {
        let result = CacheManager.removeEntry(email);
        console.log(`[SWARM] ${email} removal: ${result ? "success" : "error"}`);
        return result;
    }
}

export default SwarmManager;
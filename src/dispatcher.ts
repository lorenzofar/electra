import Listener from "models/listener";
import CacheManager from "./cacheManager";
import SwarmManager from "./swarmManager";
import DataPoint from "./models/dataPoint";


/**
 * This module is used to send broadcast messages to listeners
 * It keeps a list of all the clients listening to data and when triggered send
 */

/**
 * > How to notify all listeners that need to access to data?
 * For a first implementation, we can filter the listeners array
 * to only keep admins or the user the data belong to
 */

interface dispatchedPoint {
    username: string;
    data: DataPoint;
}

class Dispatcher {
    private static listeners: Listener[] = [];

    /**
     * This method is used to add a listener to the queue
     * It receives a subscription request.
     */
    public static addListener(listener: Listener): boolean {
        // Check if the listener has already registered
        if (this.isListenerPresent(listener.username)) {
            console.log(`[DISPATCHER] rejected ${listener.username} as listener`);
            return false;
        }

        console.log(`[DISPATCHER] adding ${listener.username} as listener`);
        this.listeners.push(listener);
        this.sendWelcomeData(listener);

        return true;
    }

    public static removeListener(username: string): boolean {
        if (!this.isListenerPresent(username)) return false;
        let index = this.listeners.map(l => l.username).indexOf(username);
        if (index == -1) return false;
        this.listeners.splice(index, 1);
        console.log(`[DISPATCHER] removed ${username} as listener`);
        return true;
    }

    /**
     * Send a socket message to connected users
     * @param event 
     * @param data 
     */
    public static notifyListeners(event: string, data: dispatchedPoint) {
        if (!event || !data) return;
        // Filter the listeners to only keep admins and the owener of the data
        let allowedListeners = this.listeners.filter(listener => listener.admin || listener.username === data.username);
        allowedListeners.forEach(listener => listener.socket.emit(event, data));
    }

    /**
     * Send the cache back to the listener after its connection
     * 
     */
    private static sendWelcomeData(listener: Listener) {
        console.log(`[DISPATCHER] sending initial data to ${listener.username}`);
        //TODO: Check if the listener is an admin or a user and get data accordingly
        let data = CacheManager.parsedCache; // Get data from cache manager
        listener.socket.emit("welcome", data); // Send those data back to the connected user
    }

    /**
     * Check if the listener has already connected
     * @param username username of listener
     */
    private static isListenerPresent(username: string) {
        let index = this.listeners.map(l => l.username).indexOf(username);
        return index != -1;
    }
}

export default Dispatcher;
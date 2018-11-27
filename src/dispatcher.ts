import Listener from "models/listener";


/**
 * This module is used to send broadcast messages to listeners
 * It keeps a list of all the clients listening to data and when triggered send
 */

/**
 * > How to notify all listeners that need to access to data?
 * For a first implementation, we can filter the listeners array
 * to only keep admins or the user the data belong to
 */

class Dispatcher {
    private static listeners: Listener[] = [];

    /**
     * This method is used to add a listener to the queue
     * It receives a subscription request.
     */
    public static addListener(listener: Listener): boolean {
        // Check if the listener has already registered
        if(this.isListenerPresent(listener.email)) return false;
        
        console.log(`[DISPATCHER] adding ${listener.email} as listener`);
        this.listeners.push(listener);
        this.sendWelcomeData(listener);

        return true;
    }

    /**
     * Send the cache back to the listener after its connection
     * 
     */
    private static sendWelcomeData(listener: Listener) {
        console.log(`[DISPATCHER] sending initial data to ${listener.email}`);
        //TODO: Check if the listener is an admin or a user and get data accordingly
        //TODO: Ask cachemanager for data and send back
        let data = null;
        listener.socket.emit("welcome", data);
    }
    
    /**
     * Check if the listener has already connected
     * @param email email address of listener
     */
    private static isListenerPresent(email: string) {
        let index = this.listeners.map(l => l.email).indexOf(email);
        return index != -1;
    }
}

export default Dispatcher;
/* ===== GLOBAL VARIABLES ===== */
var socket = null;

/* ===== EVENT HOOKS =====*/
document.addEventListener('DOMContentLoaded', openSocketConnection, false);

//TODO: Check localstorage for token
// Retrieve credentials

//TODO: When signing tokens, also add some random data to scramble crypted message


/* ===== SOCKET MANAGER ===== */
function openSocketConnection() {
    // TODO: retrieve credentials from localstorage
    // or use cookies
    let username = ""; 
    let password = "";
    let qs = `username=${username}&password=${password}&mode=listener`;
    socket = io({ query: qs });
    socket.on("connect",() => {
        console.log("CONNECTED");
        socket.on("welcome", initialData => {
            console.log("The server is greeting me");
            console.log(initialData);
        })
    });
}

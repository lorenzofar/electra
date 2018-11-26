import Client from "./client";

export default interface Listener extends Client{
    admin: boolean; // Add a flag to determine if it has admin rights
}
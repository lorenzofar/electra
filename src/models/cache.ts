import cacheEntry from "./cacheEntry";

export default interface Cache {
    [user: string]: cacheEntry;
}
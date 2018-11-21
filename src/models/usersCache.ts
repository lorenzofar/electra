import CacheEntry from "./cacheEntry";

export default interface UsersCache {
    [user: string]: CacheEntry;
}
import User from "./user";

export default interface CacheEntry{
    user: User;
    data: CacheEntry[];
}
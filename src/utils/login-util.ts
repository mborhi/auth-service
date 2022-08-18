import Redis from "ioredis";
import { SpotifyToken } from "../../interfaces";

// TODO: make util file to configure this for prod/dev env
// connect to the Redis client
const redisClient = new Redis({
    host: 'localhost',
    port: 6379 // default Redis port
});

export const generateState = (length: number): string => {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let str = "";
    for (let i = 0; i < length; i++) {
        str += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return str;
}

/**
 * Inserts the given token into the cache
 * @param session_id the session id of the user
 * @param token the token to insert into the cache
 */
export const storeToken = async (session_id: string, token: SpotifyToken): Promise<void> => {
    try {
        await redisClient.set(session_id, JSON.stringify(token));
    } catch (error) {
        throw error;
    }
}
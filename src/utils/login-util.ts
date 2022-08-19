import { SpotifyToken } from "../../interfaces";
import { connectToRedis } from "./redis-utils";

const redisClient = connectToRedis();

/**
 * Generates a state of given length consisting of alphanumeric values
 * @param length the desired length of the state
 * @returns a random string of give length
 */
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
    const oneDay = 3600 * 24;
    try {
        await redisClient.setex(session_id, oneDay, JSON.stringify(token));
    } catch (error) {
        throw error;
    }
}
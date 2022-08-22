import Redis from "ioredis";

/**
 * Connects to the currently running Redis process
 * @returns a connection object to the running Redis process
 * @throws an error if there is no running Redis process 
 */
export const connectToRedis = () => {
    try {
        const redisClient = new Redis({
            host: 'redis',
            port: 6379
        });
        return redisClient;
    } catch (error) {
        throw new Error('You must have an active Redis service running!');
    }
}
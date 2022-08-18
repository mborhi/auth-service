import { SpotifyToken } from "../../interfaces";
import Redis from "ioredis";
import endpointsConfig from "../../endpoints.config";
import fetch from "node-fetch";
import { dataIsError, responseIsError } from "./fetch-utils";

// TODO: make util file to configure this for prod/dev env
// connect to the Redis client
const redisClient = new Redis({
    host: 'localhost',
    port: 6379
});

const baseURL = endpointsConfig.SpotifyAPIBaseURL;

/**
 * Retrieves the access token of the user with the given session id
 * @param session_id the session id of the user requesting the access token
 * @returns the access token
 */
export const getAccessToken = async (session_id: string) => {
    const token: SpotifyToken = JSON.parse(await redisClient.get(session_id));
    if (token === null) {
        return {
            error: {
                status: 404,
                message: "No token associated with given session id"
            }
        }
    }
    if (Date.now() >= token.expires_at) {
        // make request to get new token
        const newToken = await refreshToken(token);
        // validate that new token is not error
        if (dataIsError(newToken)) return newToken;
        // update redis cache
        redisClient.set(session_id, JSON.stringify(newToken));
        // return the access token
        return newToken.access_token;
    }
    return token.access_token;
};

/**
 * Refreshes the given token by making a request to the Spotify Web API
 * @param token the token to refresh
 * @returns a new token
 */
const refreshToken = async (token: SpotifyToken): Promise<SpotifyToken> => {
    const url = baseURL + '/token';
    const client_id = endpointsConfig.ClientId;
    const client_secret = endpointsConfig.ClientSecret;
    const bodyParams = {
        grant_type: 'refresh_token',
        refresh_token: token.refresh_token
    }
    const response = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
        },
        body: JSON.stringify(bodyParams)
    });
    if (responseIsError(response)) return await response.json();
    try {
        const data = await response.json();
        const newToken = { ...data, refresh_token: token.refresh_token }
        return newToken;
    } catch (error) {
        throw error;
    }
}
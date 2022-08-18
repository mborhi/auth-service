import { SpotifyToken } from "../interfaces";
import { getAccessToken } from "../src/utils/token-util";
import Redis from "ioredis";
import fetch from 'node-fetch'
jest.mock('node-fetch');
const { Response } = jest.requireActual('node-fetch');

const mockedFetch = fetch as any;
const redis = new Redis();

/**
 * To run these tests, a Redis must be run locally
 */
describe("Retrieve token from database", () => {


    const mock_session_id = "mock-session-id";
    const mock_token: SpotifyToken = {
        access_token: "mock-token",
        expires_at: Date.now() + 3600 * 1000, // one hour in the future
        token_type: "Bearer",
        scope: "",
        refresh_token: "mock-refresh-token"
    }
    const expired_token: SpotifyToken = {
        access_token: "mock-token",
        expires_at: 100, // low number to trigger refresh request
        token_type: "Bearer",
        scope: "",
        refresh_token: "mock-refresh-token"
    }

    // cleanup
    afterEach(async () => {
        await redis.del(mock_session_id)
    });


    it("correctly retrieves access token from Redis cache", async () => {
        // insert mock token
        await redis.set(mock_session_id, JSON.stringify(mock_token));
        const access_token = await getAccessToken(mock_session_id);
        expect(access_token).toEqual(mock_token.access_token);

    });

    it("correctly makes a request to the Spotify Web API if the token is expired", async () => {
        mockedFetch.mockReturnValueOnce(Promise.resolve(new Response(
            JSON.stringify(mock_token)
        )));
        // insert expired token
        await redis.set(mock_session_id, JSON.stringify(expired_token));
        const access_token = await getAccessToken(mock_session_id);
        expect(access_token).toEqual(mock_token.access_token);
    });

    it("returns error object if the Spotify Web API returns an error on token refresh", async () => {
        const mock_error = { error: { status: 401, message: "Invalid refresh token" } };
        mockedFetch.mockReturnValueOnce(Promise.resolve(new Response(
            JSON.stringify(mock_error), { status: 401 }
        )));
        // insert expired token to trigger refresh request
        await redis.set(mock_session_id, JSON.stringify(expired_token));
        const result = await getAccessToken(mock_session_id);
        expect(result).toEqual(mock_error);
    });

});

// TODO: add LFU for cache
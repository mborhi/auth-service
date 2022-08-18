import { SpotifyToken } from "../interfaces";
import Redis from "ioredis";
import fetch from 'node-fetch'
import { storeToken } from "../src/utils/login-util";
jest.mock('node-fetch');
const { Response } = jest.requireActual('node-fetch');

const mockedFetch = fetch as any;
const redis = new Redis();

describe("Login", () => {

    const mock_session_id = "mock-session-id";
    const mock_token: SpotifyToken = {
        access_token: "mock-token",
        expires_at: Date.now() + 3600 * 1000, // one hour in the future
        token_type: "Bearer",
        scope: "",
        refresh_token: "mock-refresh-token"
    };

    afterEach(async () => {
        await redis.del(mock_session_id);
    });

    it("correctly stores given token with session id", async () => {
        await storeToken(mock_session_id, mock_token);
        const token = JSON.parse(await redis.get(mock_session_id));
        expect(token).toEqual(mock_token);
    });

    // it("correctly makes a request to the Spotify Web API token endpoint on login", () => {

    // });

    // it("correctly handles a token response from the Spotify Web API", () => {

    // });

    // it("correctly handles any errors from the Spotify Web API", () => {

    // });

});
import express from 'express';
import fetch from 'node-fetch';
import uid from 'uid-safe';
import { stringify } from 'querystring';
import endpoints from '../../endpoints.config';
import { generateState, storeToken } from '../utils/login-util';
import { SpotifyToken } from '../../interfaces';
import { dataIsError, responseIsError } from '../utils/fetch-utils';

const router = express.Router();
const client_id = endpoints.ClientId;
const client_secret = endpoints.ClientSecret;
const redirect_uri = endpoints.RedirectUri;

router.get('/', (req, res) => {
    // get scope and state
    const scope = "streaming \
            user-read-private \
            user-read-email \
            user-read-playback-state \
            playlist-read-collaborative \
            playlist-modify-public \
            playlist-read-private \
            playlist-modify-private";
    const state = generateState(16);
    let params = {
        response_type: 'code',
        client_id: client_id,
        redirect_uri: redirect_uri,
        scope: scope,
        state: state
    };
    const url = 'https://accounts.spotify.com/authorize?' + stringify(params);
    res.redirect(url);
});

router.get('/callback', async (req, res) => {
    const code = req.query.code as string || null;

    let params = {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code"
    };
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
        },
        body: stringify(params)
    });
    if (responseIsError(response)) {
        res.send(response);
        res.end();
        return;
    }// redirect back to login page with fail message
    const data = await response.json();
    // validate response
    if (dataIsError(data)) {
        res.send(data);
        res.end();
        return;
    }
    const token: SpotifyToken = await data;
    // create session id
    const session_id = uid.sync(24);
    // store with token
    console.log('session-id:', session_id);
    await storeToken(session_id, token);
    // route to API gateway with session id
    res.redirect('http://localhost:3000/?' + stringify({ session_id: session_id }));
});

export default router;
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

export default {
    ServerURL: process.env.SERVER_URL ?? '',
    ServerPort: process.env.SERVER_PORT ?? 3000,
    SpotifyAPIBaseURL: process.env.SPOTIFY_BASE_URL ?? 'https://api.spotify.com/v1',
    ClientId: process.env.CLIENT_ID ?? '',
    ClientSecret: process.env.CLIENT_SECRET ?? '',
    RedirectUri: process.env.REDIRECT_URI ?? '',
}
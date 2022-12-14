export interface SpotifyToken {
    "access_token": string,
    "token_type": string,
    "scope": string,
    "expires_at": number,
    "refresh_token": string
}
export interface ErrorObject {
    "error": {
        "status": number
        "message": string
    }
}
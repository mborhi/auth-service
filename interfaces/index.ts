// authentication
export interface SpotifyToken {
    "access_token": string,
    "token_type": string,
    "scope": string,
    "expires_at": number,
    "refresh_token": string
}

// API call
export interface ErrorObject {
    "error": {
        "status": number
        "message": string
    }
}

// retrieval
export interface TrackData {
    name: string
    previewURL: string
    trackURI: string
    trackNum: number
    trackAlbumImage: string
}

// playback 
export interface PlaybackStateData {
    progress: number
    availableActions: SpotifyApi.ActionsObject
}
import express from 'express';
import { dataIsError } from '../utils/fetch-utils';
import { getAccessToken } from '../utils/token-util';

const router = express.Router();

// retrieves the token from cache
router.get('/', async (req, res) => {
    const session_id = req.headers.session_id as string; // validated at API gateway
    try {
        const access_token = await getAccessToken(session_id);
        if (dataIsError(access_token)) res.status(access_token.error.status).send(access_token);
        else {
            res.status(200).json({ "access_token": access_token });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            "error": {
                "status": 500,
                "message": "Internal server error"
            }
        });
    }

});

export default router;
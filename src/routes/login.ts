import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.send("Hello from the /login endpoint!");
});

router.get('/callback', (req, res) => {
    res.send("Hello from the /login/callback endpoint!")
});

export default router;
import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.send("Hellow from the /token endpoint!");
});

export default router;
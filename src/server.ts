import express from 'express';
import loginRouter from './routes/login';
import tokenRouter from './routes/token';
import endpoints from '../endpoints.config';

const app = express();
const PORT = endpoints.ServerPort || 3000;

app.use('/login', loginRouter);
app.use('/token', tokenRouter);

app.get('/', (req, res) => {
    res.send("Hello World!");
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
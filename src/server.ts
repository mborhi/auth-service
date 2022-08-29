import express from 'express';
import loginRouter from './routes/login';
import tokenRouter from './routes/token';
import endpoints from '../endpoints.config';

const app = express();
const PORT = endpoints.ServerPort || 8001;

app.use('/login', loginRouter);
app.use('/token', tokenRouter);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
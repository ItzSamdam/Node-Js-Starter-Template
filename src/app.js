import express, { static as static_, urlencoded, json } from 'express';
import cors from 'cors';
import { initialize, use } from 'passport';
import { NOT_FOUND } from 'http-status';
import routes from './routes';
import { jwtStrategy } from './config/passport';
import { errorConverter, errorHandler } from './middlewares/error';
import ApiError from './utilities/ApiError';

process.env.PWD = process.cwd();

const app = express();

// enable cors
app.use(cors());
app.options('*', cors());

app.use(static_(`${process.env.PWD}/public`));

app.use(urlencoded({ extended: true }));
app.use(json());

// jwt authentication
app.use(initialize());
use('jwt', jwtStrategy);

app.get('/', async (req, res) => {

    const data = {
        message: 'Congratulations! You\'re Live!',
        uptime: 'Server Running since '+ Date(),
    }
    res.status(200).send(data);
});
app.use('/api', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);
import db from './models';

// Uncomment this line if you want to sync database model
// db.sequelize.sync()

export default app;

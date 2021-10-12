import * as express from 'express';
import { Request, Response, NextFunction } from 'express';

import * as cors from 'cors';
import * as bodyParser from 'body-parser';

import Router from './routes/web';

export class App {
    private static _instance: App;
    private _app: express.Application;
    private readonly _port: number;

    constructor() {
        this._app = express();
        this._port = 5000;

        this._app.use(cors());
        this._app.use('/', Router.routes);

        this.setBodyParsers();

        this._app.use(this.logErrors);
        this._app.use(this.errorHandler);
    }

    public static get Instance(): App {
        return this._instance || (this._instance = new this())
    }

    public init(): void {
        this._app.listen(this._port, () => console.log('App start on port: ' + this._port ));
    }

    private logErrors(err: Error, req: Request, res: Response, next: NextFunction): void {
        console.error(err.stack);
        next(err);
    }

    private errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
        res.status(500);
        res.send({ error: err });
    }

    private setBodyParsers(): void {
        this._app.use(bodyParser.text());
        this._app.use(bodyParser.urlencoded({ extended: true }));
        this._app.use(bodyParser.json());
    }
}

const app = App.Instance;
app.init();

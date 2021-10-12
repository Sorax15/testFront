import { Router as ExpressRouter } from 'express';

import FilmsController from '../controllers/films.controller';
import TodoController from '../controllers/todo.controller';

import { Url } from '../constants/url.constant';

export default class Router {
    private static _router: ExpressRouter = ExpressRouter();

    public static get routes(): ExpressRouter {
        this._router.use(`/${Url.api}/${Url.films}`, FilmsController.routes());
        this._router.use(`/${Url.api}/${Url.category}`, TodoController.routes());
        return this._router;
    }
}

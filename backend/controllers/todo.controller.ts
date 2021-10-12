import { NextFunction, Request, Response, Router as ExpressRouter } from 'express';
import { FilmCategoryEnum } from '../enums/film-category.enum';

interface IFilmCategoryResponse {
    id: number;
    name: string;
}

export default class TodoController {
    private static _router: ExpressRouter = ExpressRouter();

    private static getFilmCategory(req: Request, res: Response, next: NextFunction): void {
        const filmCategories: IFilmCategoryResponse[] = [
            { id: 1, name: FilmCategoryEnum.Animated },
            { id: 2, name: FilmCategoryEnum.Comedy },
            { id: 3, name: FilmCategoryEnum.Drama },
            { id: 4, name: FilmCategoryEnum.Fantasy },
            { id: 5, name: FilmCategoryEnum.Historical },
            { id: 6, name: FilmCategoryEnum.Western },
        ];

        res.status(200).json(filmCategories);
    }

    public static routes(path: string = '/'): ExpressRouter {
        this._router.get(`${path}`, this.getFilmCategory);
        return this._router;
    }
}

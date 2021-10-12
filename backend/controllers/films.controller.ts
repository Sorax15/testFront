import { Router as ExpressRouter, Request, Response, NextFunction } from 'express';
import * as csv from 'csv-parser';
import * as fs from 'fs';

import { FilmCategoryEnum } from '../enums/film-category.enum';

interface IFilmsFiles {
    id: number;
    genre1: FilmCategoryEnum,
    genre2: FilmCategoryEnum,
    year: number;
    name: string;
}

interface IFilms {
    id: number;
    genre: string;
    year: number;
    name: string;
}

interface IRequest {
    page: number;
    limit: number;
    genre?: FilmCategoryEnum[];
    year?: number[];
}

interface IResponse {
    page: number;
    limit: number;
    count: number;
    items: IFilms[];
}

export default class FilmsController {
    private static _router: ExpressRouter = ExpressRouter();

    private static getAllFilms(req: Request, res: Response, next: NextFunction): void {
        let films: IFilmsFiles[] = [];

        fs.createReadStream('films.csv').pipe(csv({}))
            .on('data', (data) => films.push(data))
            .on('end', () => {
                const query = req.query as unknown as IRequest;

                if (query.genre) {
                    films = films.filter((item) =>
                        query.genre.includes(item.genre2) || query.genre.includes(item.genre1));
                }

                if (query.year) {
                    films = films.filter((item) => query.year.includes(item.year))
                }

                const filmsResponse: IFilms[] = films.map((item) =>
                    ({ id: item.id, genre: [item.genre1, item.genre2].join(', '), year: item.year, name: item.name }));

                const response: IResponse = {
                    page: Math.ceil((filmsResponse.length / query.limit)),
                    limit: query.limit,
                    count: filmsResponse.length,
                    items: filmsResponse.slice(query.page * query.limit - query.limit, query.page * query.limit)
                };

                res.status(200).json(response);
            })
    }

    public static routes(path: string = '/'): ExpressRouter {
        this._router.get(`${path}`, this.getAllFilms);
        return this._router;
    }
}

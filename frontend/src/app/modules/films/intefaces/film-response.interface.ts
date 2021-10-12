import { IFilms } from 'src/app/modules/films/intefaces/film.interface';

export interface IFilmResponse {
  page: number;
  limit: number;
  count: number;
  items: IFilms[];
}

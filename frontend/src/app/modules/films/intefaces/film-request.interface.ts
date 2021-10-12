export interface IFilmRequest {
  page: number;
  limit: number;
  genre?: string[];
  year?: number[];
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '@env/environment';
import { API_CONSTANT } from 'src/app/shared/constants';
import { IFilmList, IFilmRequest, IFilmResponse, } from 'src/app/modules/films/intefaces';

@Injectable()
export class FilmsService {

  constructor(private http: HttpClient) { }

  getFilms(request: IFilmRequest): Observable<IFilmResponse> {
    return this.http.get<IFilmResponse>(`${environment.api}${API_CONSTANT.films}`,
      { params: new HttpParams({ fromObject: (request as any) })}
      );
  }

  getListCategory(): Observable<IFilmList[]> {
    return this.http.get<IFilmList[]>(`${environment.api}${API_CONSTANT.category}`);
  }

  getListYears(): Observable<IFilmList<number, number>[]> {
    return of([
        { id: 1, name: 1980 },
        { id: 2, name: 1972 },
        { id: 3, name: 2000 },
        { id: 4, name: 2011 },
        { id: 5, name: 2021 }
      ]);
  }
}

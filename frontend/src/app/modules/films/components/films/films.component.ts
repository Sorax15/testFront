import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FilmsService } from 'src/app/modules/films/services/films.service';
import { BehaviorSubject, forkJoin, Observable, of, Subject } from 'rxjs';
import { IFilmList, IFilmRequest, IFilms } from 'src/app/modules/films/intefaces';
import { catchError, debounceTime, finalize, map, scan, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

const DEF_COUNT = 21;

interface IFormFilm { genre: string[]; years: number[]; }

@Component({
  selector: 'app-films',
  templateUrl: './films.component.html',
  styleUrls: ['./films.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilmsComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject<void>();
  private total$: BehaviorSubject<number> = new BehaviorSubject<number>(Infinity);
  private currentPage$: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  private currentValue$: BehaviorSubject<IFormFilm> = new BehaviorSubject<IFormFilm>({ genre: [], years: [] });

  form!: FormGroup;
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  films$!: Observable<IFilms[]>;

  categories!: IFilmList[];
  years!: IFilmList<number, number>[];

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private filmsService: FilmsService) {
  }

  get genreControl(): FormControl {
    return this.form.controls.genre as FormControl;
  }

  get yearsControl(): FormControl {
    return this.form.controls.years as FormControl;
  }

  ngOnInit(): void {
    this.initialForm();
    this.loadDataForm();

    this.form.valueChanges.pipe(
      debounceTime(500),
      tap(() => this.currentPage$.next(1)),
      takeUntil((this.unsubscribe))
    ).subscribe((value) => this.currentValue$.next(value));

    this.films$ = this.currentPage$.pipe(
      tap(() => this.loading$.next(true)),
      switchMap((page) => {
        const request = this.getRequest(page);
        return this.filmsService.getFilms(request).pipe(
          tap((response) => this.total$.next(response.count)),
          map((response) => response.items),
          catchError(() => of([])),
          finalize(() => this.loading$.next(false)));
      }),
      withLatestFrom(this.currentPage$),
      scan((acc: IFilms[], [films, page]) => {
        return page === 1 ? films : [...acc, ...films];
      }, []),
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onLoadMore(): void {
    if (this.total$.value > this.currentPage$.value * DEF_COUNT) {
      this.currentPage$.next(this.currentPage$.value + 1);
    }
  }

  private initialForm(): void {
    this.form = this.fb.group({
      genre: new FormControl([]),
      years: new FormControl([])
    });

    this.cdr.detectChanges();
  }

  private loadDataForm(): void {
    forkJoin([
      this.filmsService.getListCategory(),
      this.filmsService.getListYears()
    ])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(([categories, years]) => {
        this.categories = categories;
        this.years = years;
        this.cdr.markForCheck();
      });
  }

  private getRequest(currentPage: number): IFilmRequest {
    const request: IFilmRequest = {
      limit: DEF_COUNT,
      page: currentPage,
    };

    if (this.currentValue$.value.genre.length > 0) {
      request.genre = this.currentValue$.value.genre;
    }

    if (this.currentValue$.value.years.length > 0) {
      request.year = this.currentValue$.value.years;
    }

    return request;
  }
}

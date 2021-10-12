import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

import { FilmsComponent } from 'src/app/modules/films/components/films/films.component';

import { FilmsService } from 'src/app/modules/films/services/films.service';

const routes: Routes = [
  { path: '', component: FilmsComponent }
];

@NgModule({
  declarations: [
    FilmsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatProgressSpinnerModule,
    HttpClientModule,
    MatCardModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatSelectModule
  ],
  providers: [FilmsService]
})
export class FilmsModule { }

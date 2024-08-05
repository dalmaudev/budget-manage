import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TrainingProfileComponent } from './training-profile/training-profile.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'profile/:id',
    component: TrainingProfileComponent,
  },
];

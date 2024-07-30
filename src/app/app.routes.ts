import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { TrainingProfileComponent } from './training-profile/training-profile.component';

export const routes: Routes = [
  {
    path: 'home',
    component: AppComponent,
  },
  {
    path: 'training-profile/:id',
    component: TrainingProfileComponent,
  },
];

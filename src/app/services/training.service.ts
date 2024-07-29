import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Training } from '../../models/training.model';
import { APP_CONSTANTS } from '../constants/constants';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  private readonly APP_CONSTANTS = APP_CONSTANTS;
  private readonly SERVICE_URL =
    this.APP_CONSTANTS.BASE_URL + this.APP_CONSTANTS.TRAINING_API_URL;

  constructor(private http: HttpClient) {}

  getAllTrainings(): Observable<Training[]> {
    return this.http.get<Training[]>(this.SERVICE_URL);
  }

  getTrainingById(id: string) {
    return this.http.get<Training[]>(this.SERVICE_URL + `?workerId=` + id);
  }

  postNewTraining(newTraining: Training): Observable<Training> {
    return this.http.post<Training>(this.SERVICE_URL, newTraining, {
      headers: new HttpHeaders({ 'Content-Type': 'aplication/json' }),
    });
  }
}

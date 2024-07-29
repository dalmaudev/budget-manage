import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Worker } from '../../models/worker.model';
import { APP_CONSTANTS } from '../constants/constants';

@Injectable({
  providedIn: 'root',
})
export class WorkerService {
  private readonly APP_CONSTANTS = APP_CONSTANTS;
  private readonly SERVICE_URL =
    this.APP_CONSTANTS.BASE_URL + this.APP_CONSTANTS.WORKER_API_URL;

  constructor(private http: HttpClient) {}

  getAllWorkers(): Observable<Worker[]> {
    return this.http.get<Worker[]>(this.SERVICE_URL);
  }

  updateWorker(id: any, newData: any) {
    return this.http.put(this.SERVICE_URL + `/${id}`, newData, {
      headers: new HttpHeaders({ 'Content-Type': 'aplication/json' }),
    });
  }
}

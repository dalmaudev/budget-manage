import { DatePipe, NgClass, UpperCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Worker } from '../../models/worker.model';
import { AddTrainingComponent } from '../add-training/add-training.component';
import { WorkerService } from '../services/worker.service';
import { TrainingProfileComponent } from '../training-profile/training-profile.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    UpperCasePipe,
    AddTrainingComponent,
    NgClass,
    TrainingProfileComponent,
    DatePipe,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  workers: Worker[] = [];
  dataWorker!: Worker[];
  isAddingNewTraining = false;
  isJoiningTrainingProfile = false;
  workerSelected!: Worker;

  constructor(private workerService: WorkerService) {}

  ngOnInit(): void {
    this.getWorkersData();
  }

  getWorkersData(): void {
    this.workerService.getAllWorkers().subscribe((response) => {
      this.dataWorker = response;
      console.log(response);
    });
  }

  onAddNewTraining(worker: Worker): void {
    this.workerSelected = worker;
    this.isAddingNewTraining = true;
  }

  onJoinTrainingById(worker: Worker): void {
    this.workerSelected = worker;
    this.isJoiningTrainingProfile = true;
  }

  onCancelAddNewTraining(): void {
    this.isAddingNewTraining = false;
  }

  onCancelTrainingProfile() {
    this.isJoiningTrainingProfile = false;
  }

  onTrainingProfile() {
    this.isJoiningTrainingProfile = true;
  }

  onCreatedTraining() {
    this.isAddingNewTraining = false;
    this.getWorkersData();
  }
}

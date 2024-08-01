import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { Training } from '../../models/training.model';
import { Worker } from '../../models/worker.model';
import { EditTrainingComponent } from '../edit-training/edit-training.component';
import { TrainingService } from '../services/training.service';
import { WorkerService } from '../services/worker.service';

@Component({
  selector: 'app-training-profile',
  standalone: true,
  imports: [EditTrainingComponent, RouterLink, RouterOutlet],
  templateUrl: './training-profile.component.html',
  styleUrl: './training-profile.component.scss',
})
export class TrainingProfileComponent implements OnInit {
  @Input({ required: true }) worker!: Worker;
  @Output() cancel = new EventEmitter<void>();

  isEditingTraining = false;
  trainingDataById!: Training[];
  selectedTraining?: Training;

  constructor(
    private workerService: WorkerService,
    private trainingService: TrainingService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.getTrainingsByWorkerId(id);
    this.getWorkerById(id);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  getTrainingsByWorkerId(id: string): void {
    this.trainingService.getTrainingById(id).subscribe((response) => {
      this.trainingDataById = response;
    });
  }

  getWorkerById(id: string): void {
    this.workerService.getWorkerById(id).subscribe((worker) => {
      this.worker = worker;
    });
  }

  editTraining(training: Training): void {
    this.selectedTraining = { ...training }; // Crear una copia del entrenamiento para edición
  }

  closeEditModal(): void {
    this.trainingService
      .getTrainingById(this.worker.id)
      .subscribe((response) => (this.trainingDataById = response));
    this.selectedTraining = undefined; // Cerrar el modal
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { forkJoin, switchMap, tap } from 'rxjs';
import { Training } from '../../models/training.model';
import { Worker } from '../../models/worker.model';
import { EditTrainingComponent } from '../edit-training/edit-training.component';
import { TrainingService } from '../services/training.service';
import { WorkerService } from '../services/worker.service';

@Component({
  selector: 'app-training-profile',
  standalone: true,
  imports: [EditTrainingComponent, RouterLink, RouterOutlet, FormsModule],
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
      this.trainingDataById = response.map((training) => ({
        ...training,
        selected: false, // Initialize the selected property
      }));
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
      .pipe(
        tap((response) => {
          this.trainingDataById = response.map((training) => ({
            ...training,
            selected: false, // Initialize the selected property
          }));
        }),
        switchMap(() => this.workerService.getWorkerById(this.worker.id))
      )
      .subscribe((response) => (this.worker = response));
    this.selectedTraining = undefined; // Close the modal
  }

  toggleAll(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.trainingDataById.forEach(
      (training) => (training.selected = isChecked)
    );
  }

  checkboxSelected(): void {
    const selectedTrainings = this.trainingDataById.filter((training) => {
      console.log(this.trainingDataById);
      training.selected;
    });

    console.log(selectedTrainings);
  }

  onCheckboxChange(trainingId: string, event: any) {
    const training = this.trainingDataById.find((t) => t.id === trainingId);
    if (training) {
      training.selected = event.target.checked;
    }
    console.log(training);
  }

  deleteSelectedTrainings() {
    const selectedTrainingIds = this.trainingDataById
      .filter((training) => training.selected)
      .map((training) => training.id);

    if (selectedTrainingIds.length > 0) {
      forkJoin(
        selectedTrainingIds.map((id) =>
          this.trainingService.deleteTrainingById(id!)
        )
      ).subscribe(
        () => {
          this.trainingDataById = this.trainingDataById.filter(
            (training) => !training.selected
          );
          console.log('Trainings eliminados exitosamente');
        },
        (error) => {
          console.error('Error eliminando trainings', error);
        }
      );
    }
  }
}

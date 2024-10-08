import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { forkJoin, switchMap, tap } from 'rxjs';
import { Training } from '../../models/training.model';
import { Worker, calculateBudgetRenew } from '../../models/worker.model';
import { AddTrainingComponent } from '../add-training/add-training.component';
import { EditTrainingComponent } from '../edit-training/edit-training.component';
import { TrainingService } from '../services/training.service';
import { WorkerService } from '../services/worker.service';

@Component({
  selector: 'app-training-profile',
  standalone: true,
  imports: [
    EditTrainingComponent,
    RouterLink,
    RouterOutlet,
    FormsModule,
    AddTrainingComponent,
    DatePipe,
  ],
  templateUrl: './training-profile.component.html',
  styleUrl: './training-profile.component.scss',
})
export class TrainingProfileComponent implements OnInit {
  @Input({ required: true }) worker!: Worker;
  @Input() workerSelected!: Worker;
  @Output() cancel = new EventEmitter<void>();

  isEditingTraining = false;
  isAddingNewTraining = false;
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
      worker.budgetRenewal = calculateBudgetRenew(worker.contractDate);
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
      const confirmDelete = confirm(
        `¿Está seguro que desea eliminar este registro?
          Esta acción es irreversible
        `
      );

      if (!confirmDelete) {
        return; // Si el usuario cancela, no se realiza ninguna acción
      }

      forkJoin(
        selectedTrainingIds.map((id) =>
          this.trainingService.deleteTrainingById(id!)
        )
      ).subscribe(
        () => {
          // Actualizar los presupuestos del worker
          this.trainingDataById
            .filter((training) => training.selected)
            .forEach((training) => {
              this.worker.budgetSpent -= training.price!;
              this.worker.budgetLeft += training.price!;
            });

          // Actualizar el worker en el servicio
          this.workerService
            .updateWorker(this.worker.id, this.worker)
            .subscribe(
              () => {
                console.log('Worker actualizado exitosamente');
              },
              (error) => {
                console.error('Error actualizando el worker', error);
              }
            );

          // Filtrar los trainings eliminados
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

  onCancelAddNewTraining() {
    this.isAddingNewTraining = false;
  }

  onCreatedTraining() {
    this.isAddingNewTraining = false;
    this.getTrainingsByWorkerId(this.worker.id);
  }

  openAddTrainingModal(worker: Worker) {
    this.workerSelected = worker;
    this.isAddingNewTraining = true;
  }
}

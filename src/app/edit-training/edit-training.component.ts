import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { switchMap, tap } from 'rxjs/operators';
import { Training } from '../../models/training.model';
import { Worker } from '../../models/worker.model';
import { TrainingService } from '../services/training.service';
import { WorkerService } from '../services/worker.service';

@Component({
  selector: 'app-edit-training',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-training.component.html',
  styleUrls: ['./edit-training.component.scss'],
})
export class EditTrainingComponent implements OnInit {
  private workerToUpdate!: Worker;
  private oldTrainingPrice?: number;

  @Input({
    required: true,
  })
  worker!: Worker; // Datos del trabajador
  @Input() training?: Training; // Datos del training a editar
  @Output() close = new EventEmitter<void>(); // Evento para cerrar el modal

  errorMessage?: string;

  constructor(
    private trainingService: TrainingService,
    private workerService: WorkerService
  ) {}

  ngOnInit(): void {
    this.oldTrainingPrice = this.training?.price;
    this.workerToUpdate = { ...this.worker };
    this.resetWorkerBudgets();
  }

  onSubmit(form: NgForm): void {
    console.log(this.training);

    this.trainingService
      .updateTraining(this.training!.id!, this!.training!)
      .pipe(
        switchMap(() => {
          this.calculateNewWorkerBudgets();
          return this.workerService.updateWorker(
            this.worker.id!,
            this.workerToUpdate!
          );
        }),
        tap(() => this.closeModal())
      )
      .subscribe();
  }

  closeModal(): void {
    this.close.emit(); // Emitir evento para cerrar el modal
  }

  private resetWorkerBudgets(): void {
    if (this.training && this.worker) {
      this.workerToUpdate.budgetLeft =
        this.worker.budgetLeft + this.training.price!;
      this.workerToUpdate.budgetSpent =
        this.worker.budgetSpent - this.training.price!;
    }
  }

  private calculateNewWorkerBudgets(): void {
    if (this.training && this.worker) {
      this.workerToUpdate = { ...this.worker };
      this.workerToUpdate.budgetLeft =
        this.worker.budgetLeft +
        (this.oldTrainingPrice! - this.training.price!);
      this.workerToUpdate.budgetSpent =
        this.worker.budgetSpent -
        (this.oldTrainingPrice! - this.training.price!);
    }
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Worker } from '../../models/worker.model';
import { TrainingService } from '../services/training.service';
import { WorkerService } from '../services/worker.service';

@Component({
  selector: 'app-add-training',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-training.component.html',
  styleUrl: './add-training.component.scss',
})
export class AddTrainingComponent {
  @Input() worker!: Worker;
  @Output() cancel = new EventEmitter<void>();
  @Output() onFinish = new EventEmitter<void>();

  enteredName!: string;
  enteredProvider!: string;
  enteredTrainingPrice!: number;
  enteredTrainingDescription!: string;
  enteredStartDate!: Date;
  enteredEndDate!: Date;

  constructor(
    private trainingService: TrainingService,
    private workerService: WorkerService
  ) {}

  onCancel() {
    this.cancel.emit();
  }

  onAddNewTraining() {
    const newTraining = {
      // id: 'string', se genera automaticamente
      workerId: this.worker!.id, // ojo number o string
      name: this.enteredName,
      provider: this.enteredProvider,
      cost: Number(this.enteredTrainingPrice),
      desc: this.enteredTrainingDescription,
      startDate: this.enteredStartDate,
      finalDate: this.enteredEndDate,
    };

    this.trainingService.postNewTraining(newTraining).subscribe(
      () => {
        this.calculateBudgetSpent();
        this.calculateBudgetLeft();
        this.workerService.updateWorker(this.worker!.id, this.worker).subscribe(
          () => {
            this.onFinish.emit();
          },
          (error) => {
            console.error('Error updating worker:', error);
          }
        );
      },
      (error) => {
        console.error('Error adding new training:', error);
      }
    );
  }

  private calculateBudgetSpent() {
    if (this.worker.budgetSpent && this.worker.budgetSpent > 0) {
      this.worker.budgetSpent =
        this.worker.budgetSpent + this.enteredTrainingPrice;
    } else {
      this.worker.budgetSpent = this.enteredTrainingPrice;
      console.log(this.worker.budgetSpent);
    }
  }
  private calculateBudgetLeft() {
    if (this.worker.budgetLeft && this.worker.budgetLeft > 0) {
      this.worker.budgetLeft =
        this.worker.budgetLeft - this.enteredTrainingPrice;
    } else {
      this.worker.budgetLeft =
        this.worker.totalBudget - this.enteredTrainingPrice;
    }
  }
}

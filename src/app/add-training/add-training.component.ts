import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Worker } from '../../models/worker.model';
import { TrainingService } from '../services/training.service';
import { WorkerService } from '../services/worker.service';

@Component({
  selector: 'app-add-training',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './add-training.component.html',
  styleUrl: './add-training.component.scss',
})
export class AddTrainingComponent implements OnInit {
  @Input() worker!: Worker;
  @Output() cancel = new EventEmitter<void>();
  @Output() onFinish = new EventEmitter<void>();

  profileForm!: FormGroup;

  constructor(
    private trainingService: TrainingService,
    private workerService: WorkerService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.profileForm = new FormGroup({
      enteredName: new FormControl('', Validators.required),
      enteredProvider: new FormControl('', Validators.required),
      enteredTrainingPrice: new FormControl('', [
        Validators.required,
        Validators.max(this.worker.budgetLeft),
      ]),
      enteredTrainingType: new FormControl('', Validators.required),
      selectedTrainingCategory: new FormControl('', Validators.required),
      enteredTrainingDescription: new FormControl('', [
        Validators.required,
        Validators.maxLength(140),
      ]),
      enteredPurchaseDate: new FormControl('', Validators.required),
      enteredStartDate: new FormControl('', Validators.required),
      enteredEndDate: new FormControl('', Validators.required),
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onSubmitNewTraining() {
    const newTraining = {
      workerId: this.worker!.id,
      name: this.profileForm.value.enteredName,
      provider: this.profileForm.value.enteredProvider,
      price: Number(this.profileForm.value.enteredTrainingPrice),
      desc: this.profileForm.value.enteredTrainingDescription,
      startDate: this.profileForm.value.enteredStartDate,
      endDate: this.profileForm.value.enteredEndDate,
      type: this.profileForm.value.enteredTrainingType,
      category: this.profileForm.value.selectedTrainingCategory,
      purchaseDate: this.profileForm.value.enteredPurchaseDate,
    };

    if (this.profileForm.valid) {
      this.trainingService.postNewTraining(newTraining).subscribe(
        () => {
          this.updateBudget(this.profileForm.value.enteredTrainingPrice);
          this.workerService
            .updateWorker(this.worker!.id, this.worker)
            .subscribe(
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
  }

  private updateBudget(newPrice: number): void {
    this.worker.budgetSpent += newPrice;
    this.worker.budgetLeft -= newPrice;
  }
}

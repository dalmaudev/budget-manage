import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
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
  enteredTrainingType!: string;
  selectedTrainingCategory = 'Front End';
  enteredPurchaseDate!: Date;
  errorMessage!: string;

  constructor(
    private trainingService: TrainingService,
    private workerService: WorkerService
  ) {}

  onCancel(): void {
    this.cancel.emit();
  }

  // onAddNewTraining(form: NgForm): void {
  //   const newTraining = {
  //     // id: 'string', se genera automaticamente
  //     workerId: this.worker!.id, // ojo number o string
  //     name: this.enteredName,
  //     provider: this.enteredProvider,
  //     price: Number(this.enteredTrainingPrice),
  //     desc: this.enteredTrainingDescription,
  //     startDate: this.enteredStartDate,
  //     endDate: this.enteredEndDate,
  //     type: this.enteredTrainingType,
  //     category: this.selectedTrainingCategory,
  //     purchaseDate: this.enteredPurchaseDate,
  //   };

  //   if (form.valid) {
  //     this.trainingService.postNewTraining(newTraining).subscribe(
  //       () => {
  //         this.calculateBudgetSpent();
  //         this.calculateBudgetLeft();
  //         this.workerService
  //           .updateWorker(this.worker!.id, this.worker)
  //           .subscribe(
  //             () => {
  //               this.onFinish.emit();
  //             },
  //             (error) => {
  //               console.error('Error updating worker:', error);
  //             }
  //           );
  //       },
  //       (error) => {
  //         console.error('Error adding new training:', error);
  //       }
  //     );
  //     console.log('Form Submitted!', form.value);
  //   }
  // }

  // private calculateBudgetSpent(): void {
  //   if (this.worker.budgetSpent && this.worker.budgetSpent > 0) {
  //     this.worker.budgetSpent =
  //       this.worker.budgetSpent + this.enteredTrainingPrice;
  //   } else {
  //     this.worker.budgetSpent = newPrice;
  //   }
  // }
  // private calculateBudgetLeft(): void {
  //   if (this.worker.budgetLeft && this.worker.budgetLeft > 0) {
  //     this.worker.budgetLeft =
  //       this.worker.budgetLeft - this.enteredTrainingPrice;
  //   } else {
  //     this.worker.budgetLeft = this.worker.totalBudget - newPrice;
  //   }
  // }

  // checkBudget(): void {
  //   if (this.worker) {
  //     const newBudgetSpent = this.calculateBudgetSpent(
  //       this.enteredTrainingPrice
  //     );
  //     const newBudgetLeft = this.calculateBudgetLeft(this.enteredTrainingPrice);

  //     if (newBudgetLeft < 0) {
  //       this.errorMessage =
  //         'The total training cost exceeds the allowed budget!';
  //     } else {
  //       this.errorMessage = '';
  //       this.worker.budgetLeft = newBudgetLeft;
  //       this.worker.budgetSpent = newBudgetSpent;
  //     }
  //   }
  // }

  // onAddNewTraining(form: NgForm): void {
  //   const newTraining = {
  //     // id: 'string', se genera automaticamente
  //     workerId: this.worker!.id, // ojo number o string
  //     name: this.enteredName,
  //     provider: this.enteredProvider,
  //     price: Number(this.enteredTrainingPrice),
  //     desc: this.enteredTrainingDescription,
  //     startDate: this.enteredStartDate,
  //     endDate: this.enteredEndDate,
  //     type: this.enteredTrainingType,
  //     category: this.selectedTrainingCategory,
  //     purchaseDate: this.enteredPurchaseDate,
  //   };

  //   if (form.valid) {
  //     this.trainingService.postNewTraining(newTraining).subscribe(
  //       () => {
  //         this.calculateBudgetSpent();
  //         this.calculateBudgetLeft();
  //         this.workerService
  //           .updateWorker(this.worker!.id, this.worker)
  //           .subscribe(
  //             () => {
  //               this.onFinish.emit();
  //             },
  //             (error) => {
  //               console.error('Error updating worker:', error);
  //             }
  //           );
  //       },
  //       (error) => {
  //         console.log('Form Submitted!', form.value);
  //         console.error('Error adding new training:', error);
  //       }
  //     );
  //   }
  // }
  // private calculateBudgetSpent(): void {
  //   if (this.worker.budgetSpent && this.worker.budgetSpent > 0) {
  //     this.worker.budgetSpent =
  //       this.worker.budgetSpent + this.enteredTrainingPrice;
  //   } else {
  //     this.worker.budgetSpent = this.enteredTrainingPrice;
  //     console.log(this.worker.budgetSpent);
  //   }
  // }
  // private calculateBudgetLeft(): void {
  //   if (this.worker.budgetLeft && this.worker.budgetLeft > 0) {
  //     this.worker.budgetLeft =
  //       this.worker.budgetLeft - this.enteredTrainingPrice;
  //   } else {
  //     this.worker.budgetLeft =
  //       this.worker.totalBudget - this.enteredTrainingPrice;
  //   }
  // }

  onAddNewTraining(form: NgForm): void {
    // Verifica el presupuesto solo cuando se hace clic en "Save"
    if (this.checkBudget(this.enteredTrainingPrice) && this.worker) {
      const newTraining = {
        workerId: this.worker!.id,
        name: this.enteredName,
        provider: this.enteredProvider,
        price: Number(this.enteredTrainingPrice),
        desc: this.enteredTrainingDescription,
        startDate: this.enteredStartDate,
        endDate: this.enteredEndDate,
        type: this.enteredTrainingType,
        category: this.selectedTrainingCategory,
        purchaseDate: this.enteredPurchaseDate,
      };

      if (form.valid) {
        this.trainingService.postNewTraining(newTraining).subscribe(
          () => {
            this.updateBudget(this.enteredTrainingPrice);
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
  }

  private updateBudget(newPrice: number): void {
    this.worker.budgetSpent += newPrice;
    this.worker.budgetLeft -= newPrice;
  }

  private checkBudget(newPrice: number): boolean {
    if (this.worker.budgetLeft < newPrice) {
      this.errorMessage = 'The total training cost exceeds the allowed budget!';
      return false;
    } else {
      this.errorMessage = '';
      return true;
    }
  }
}

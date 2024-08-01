import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Training } from '../../models/training.model';
import { TrainingService } from '../services/training.service';

@Component({
  selector: 'app-edit-training',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-training.component.html',
  styleUrls: ['./edit-training.component.scss'],
})
export class EditTrainingComponent {
  @Input() training?: Training; // Datos del training a editar
  @Output() close = new EventEmitter<void>(); // Evento para cerrar el modal

  errorMessage?: string;

  constructor(private trainingService: TrainingService) {}

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.trainingService
        .updateTraining(this.training!.id!, this!.training!)
        .subscribe(
          (updatedTraining) => {
            console.log('Training updated successfully', updatedTraining);
            this.close.emit(); // Emitir evento para cerrar el modal
          },
          (error) => {
            console.error('Error updating training:', error);
            this.errorMessage =
              'Error updating training. Please try again later.';
          }
        );
    }
  }

  onCancel(): void {
    this.close.emit(); // Emitir evento para cerrar el modal
  }
}

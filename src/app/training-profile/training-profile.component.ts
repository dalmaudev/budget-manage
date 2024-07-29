import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Training } from '../../models/training.model';
import { Worker } from '../../models/worker.model';
import { TrainingService } from '../services/training.service';

@Component({
  selector: 'app-training-profile',
  standalone: true,
  imports: [],
  templateUrl: './training-profile.component.html',
  styleUrl: './training-profile.component.scss',
})
export class TrainingProfileComponent implements OnInit {
  @Input({ required: true }) worker!: Worker;
  @Output() cancel = new EventEmitter<void>();

  trainingDataById!: Training[];

  constructor(private trainingService: TrainingService) {}

  ngOnInit(): void {
    this.getTrainingsByWorkerId(this.worker.id);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  getTrainingsByWorkerId(id: string): void {
    this.trainingService.getTrainingById(id).subscribe((response) => {
      this.trainingDataById = response;
    });
  }
}

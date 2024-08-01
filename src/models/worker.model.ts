import { Training } from './training.model';

export interface Worker {
  id: string;
  name: string;
  surname: string;
  job: string;
  contractDate: Date;
  totalBudget: number;
  currentState: string;
  budgetSpent: number;
  budgetLeft: number;
  trainings: Training[];
}

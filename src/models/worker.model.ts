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
  budgetRenewal: Date;
}

export function calculateBudgetRenew(contractDate: Date): Date {
  const now = new Date();
  let nextRenewal = new Date(contractDate);
  nextRenewal.setFullYear(now.getFullYear());

  if (now > nextRenewal) {
    nextRenewal.setFullYear(now.getFullYear() + 1);
  }

  return nextRenewal;
}

export interface Training {
  id?: string;
  workerId: string;
  name: string;
  provider: string;
  cost: number;
  desc: string;
  startDate?: Date;
  finalDate?: Date;
}

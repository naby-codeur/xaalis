export type TransactionType = "INCOME" | "EXPENSE" | "TRANSFER";

export interface Transaction {
  id: string;
  organizationId: string;
  projectId: string | null;
  type: TransactionType;
  amount: number;
  currency: string;
  description: string | null;
  occurredAt: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

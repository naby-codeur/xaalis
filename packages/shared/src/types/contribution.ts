export type ContributionStatus = "PENDING" | "PAID" | "LATE";

export interface ContributionDto {
  id: string;
  organizationId: string;
  memberId: string | null;
  memberName: string;
  amount: number;
  currency: string;
  period: string;
  status: ContributionStatus;
  dueDate: string;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface OrganizationUserDto {
  membershipId: string;
  userId: string;
  email: string;
  name: string | null;
  role: string;
  joinedAt: string;
}

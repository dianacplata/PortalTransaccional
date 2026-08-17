export enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED',
  VOIDED = 'VOIDED',
  ERROR = 'ERROR',
}

const COMPLETED_STATUSES: ReadonlySet<TransactionStatus> = new Set([
  TransactionStatus.APPROVED,
  TransactionStatus.DECLINED,
  TransactionStatus.VOIDED,
  TransactionStatus.ERROR,
]);

export const isCompleted = (status: TransactionStatus): boolean =>
  COMPLETED_STATUSES.has(status);

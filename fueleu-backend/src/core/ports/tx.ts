export interface TransactionManager {
  runInTx<T>(fn: () => Promise<T>): Promise<T>;
}

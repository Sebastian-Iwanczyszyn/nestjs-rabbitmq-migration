export interface RabbitmqMigrationExecutor {
  execute(): Promise<void>;
}

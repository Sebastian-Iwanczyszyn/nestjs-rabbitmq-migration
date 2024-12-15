import { Injectable, Logger } from '@nestjs/common';
import { RabbitmqMigrationExecutor } from './rabbitmq-migration.executor';
import { Connection } from 'rabbitmq-client';
import { RabbitmqMigration } from '../rabbitmq-migration';
import { RabbitMqMigrationDeclarator } from '../declaration/rabbit-mq-migration.declarator';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class RabbitmqAutowireMigrationExecutor implements RabbitmqMigrationExecutor {
  constructor(
    private readonly logger: Logger,
    private readonly connection: Connection,
    private readonly migrationsPath: string
  ) {
  }

  async execute(): Promise<void> {
    const migrations: RabbitmqMigration[] = await this.loadMigrations();

    for (const migration of migrations) {
      await migration.migrate(new RabbitMqMigrationDeclarator(this.connection));
      this.logger.log(`Migration ${migration.constructor.name} was executed`, this.constructor.name);
    }

    return Promise.resolve();
  }

  private async loadMigrations(): Promise<RabbitmqMigration[]> {
    const migrations: RabbitmqMigration[] = [];

    const files = fs.readdirSync(this.migrationsPath);
    for (const file of files) {
      const filePath = path.join(this.migrationsPath, file);
      if (file.endsWith('.ts')) {
        // const migrationClass = await import(filePath.slice(0, -3));
        const migrationClass = await import('../../example/src/migrations/rabbitmq/example-rabbitmq-migration');

        if (migrationClass) {
          migrations.push(new migrationClass.default()); // Instantiate the class and add it to migrations array
        }
      }
    }

    return migrations;
  }
}

import { DynamicModule, Logger, Module, OnModuleInit } from '@nestjs/common';
import {
  RabbitmqAutowireMigrationExecutor,
} from './executor/rabbitmq-autowire-migration.executor';
import { Connection } from 'rabbitmq-client';
import { ModuleRef } from '@nestjs/core';
import { Service } from './dependency-injection/service';

export interface RabbitmqMigrationModuleOptions {
  connectionString: string;
  migrationsPath: string;
  executeOnInit?: boolean;
}

@Module({})
export class RabbitmqMigrationModule implements OnModuleInit {
  constructor(private ref: ModuleRef) {
  }

  async onModuleInit(): Promise<any> {
    if (!this.ref.get(Service.EXECUTE_ON_INIT)) {
      return
    };

    await this.ref.get(Service.RABBIT_MIGRATION_EXECUTOR).execute();
  }

  static register(options: RabbitmqMigrationModuleOptions): DynamicModule {
    return {
      module: RabbitmqMigrationModule,
      providers: [
        {
          provide: Service.EXECUTE_ON_INIT,
          useValue: options.executeOnInit ?? true,
        },
        {
          provide: Service.CONNECTION_STRING,
          useValue: options.connectionString,
        },
        {
          provide: Service.MIGRATIONS_PATH,
          useValue: options.migrationsPath || 'src/migrations/rabbitmq',
        },
        {
          provide: Service.RABBIT_MIGRATION_EXECUTOR,
          useFactory: (logger: Logger, connectionString: string, migrationsPath: string) => {
            return new RabbitmqAutowireMigrationExecutor(
              logger,
              new Connection(connectionString),
              migrationsPath,
            );
          },
          inject: [Logger, Service.CONNECTION_STRING, Service.MIGRATIONS_PATH],
        },
        Logger,
      ],
      exports: [Service.RABBIT_MIGRATION_EXECUTOR],
    };
  }
}

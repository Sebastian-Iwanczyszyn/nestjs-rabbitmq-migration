import { Injectable } from '@nestjs/common';
import { RabbitMqMigrationDeclarator } from './declaration/rabbit-mq-migration.declarator';

@Injectable()
export abstract class RabbitmqMigration {
  abstract migrate(declarator: RabbitMqMigrationDeclarator): Promise<void>;
}

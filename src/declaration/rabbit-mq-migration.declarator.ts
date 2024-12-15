import { Connection } from 'rabbitmq-client';
import {
  RabbitMqMigrationExchangeContextDeclarator
} from './rabbit-mq-migration-exchange-context.declarator';
import {
  RabbitMqMigrationBindingContextDeclarator
} from './rabbit-mq-migration-binding-context.declarator';
import {
  RabbitMqMigrationQueueContextDeclarator
} from './rabbit-mq-migration-queue-context.declarator';

export class RabbitMqMigrationDeclarator {
  constructor(private readonly connection: Connection) {
  }

  exchange(): RabbitMqMigrationExchangeContextDeclarator {
      return RabbitMqMigrationExchangeContextDeclarator.create(this.connection);
  }

  bindKeys(): RabbitMqMigrationBindingContextDeclarator {
      return RabbitMqMigrationBindingContextDeclarator.create(this.connection);
  }

  queue(): RabbitMqMigrationQueueContextDeclarator {
      return RabbitMqMigrationQueueContextDeclarator.create(this.connection);
  }
}

import { Connection } from 'rabbitmq-client';

export class RabbitMqMigrationQueueContextDeclarator {
  private queuesToCreate: CreateQueue[] = [];
  private queuesToDelete: Queue[] = [];

  private constructor(
    private connection: Connection,
  ) {}

  static create(connection: Connection): RabbitMqMigrationQueueContextDeclarator {
    return new RabbitMqMigrationQueueContextDeclarator(connection);
  }

  create(name: string, durable: boolean): RabbitMqMigrationQueueContextDeclarator {
    this.queuesToCreate.push({
      name,
      durable,
    });
    return this;
  }

  delete(name: string): RabbitMqMigrationQueueContextDeclarator {
    this.queuesToDelete.push({
      name,
    });
    return this;
  }

  async declare(): Promise<void> {
    for (const queue of this.queuesToCreate) {
      await this.connection.queueDeclare({ queue: queue.name, durable: queue.durable });
    }

    for (const queue of this.queuesToDelete) {
      await this.connection.queueDelete({ queue: queue.name });
    }
  }
}

export interface CreateQueue extends Queue {
  durable: boolean;
}

export interface Queue {
  name: string;
}

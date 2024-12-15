import { Connection } from 'rabbitmq-client';

export class RabbitMqMigrationBindingContextDeclarator {
  private bindingKeys: BindingKey[] = [];

  private constructor(
    private connection: Connection,

  ) {
  }

  static create(connection: Connection): RabbitMqMigrationBindingContextDeclarator {
    return new RabbitMqMigrationBindingContextDeclarator(connection);
  }

  bindKey(queueName: string, exchangeName: string, bindingKey: string): RabbitMqMigrationBindingContextDeclarator {
      this.bindingKeys.push({
        exchangeName,
        queueName,
        bindingKey,
      });
      return this;
  }

  async declare(): Promise<void> {
    for (const bindingKey of this.bindingKeys) {
      await this.connection.queueBind({queue: bindingKey.queueName, exchange: bindingKey.exchangeName, routingKey: bindingKey.bindingKey});
    }
  };
}

interface BindingKey {
  exchangeName: string;
  queueName: string;
  bindingKey: string;
}

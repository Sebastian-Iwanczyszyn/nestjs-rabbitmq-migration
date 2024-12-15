import { Connection } from 'rabbitmq-client';
import { ExchangeType } from './enum/exchange-type';

export class RabbitMqMigrationExchangeContextDeclarator {
  private exchangesToCreate: CreateExchange[] = []
  private exchangesToDelete: Exchange[] = []

  private constructor(
    private connection: Connection,
  ) {
  }

  static create(connection: Connection): RabbitMqMigrationExchangeContextDeclarator {
    return new RabbitMqMigrationExchangeContextDeclarator(connection);
  }

  create(name: string, type: ExchangeType): RabbitMqMigrationExchangeContextDeclarator {
      this.exchangesToCreate.push({
        name,
        type,
      });
      return this;
  }

  delete(name: string): RabbitMqMigrationExchangeContextDeclarator {
      this.exchangesToDelete.push({
        name,
      });
      return this;
  }

  async declare(): Promise<void> {
    for (const exchange of this.exchangesToCreate) {
      await this.connection.exchangeDeclare({ exchange: exchange.name, type: exchange.type });
    }

    for (const exchange of this.exchangesToDelete) {
      await this.connection.exchangeDelete({ exchange: exchange.name });
    }
  };
}

export interface CreateExchange extends Exchange{
  type: ExchangeType;
}

export interface Exchange {
  name: string;
}

import { Injectable } from '@nestjs/common';
import { RabbitmqMigration } from '../../../../src';
import { RabbitMqMigrationDeclarator } from '../../../../src/declaration/rabbit-mq-migration.declarator';
import { ExchangeType } from '../../../../src/declaration/enum/exchange-type';

@Injectable()
export default class ExampleRabbitmqMigration extends RabbitmqMigration {
  async migrate(declarator: RabbitMqMigrationDeclarator): Promise<void> {
    await declarator
      .exchange()
      .create('edm.exchange', ExchangeType.TOPIC)
      .declare();

    await declarator
      .queue()
      .create('edm.event', true)
      .declare();

    await declarator
      .bindKeys()
      .bindKey('edm.event', 'edm.exchange', 'edm.*')
      .declare();
  }
}

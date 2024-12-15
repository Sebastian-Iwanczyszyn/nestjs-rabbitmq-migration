import { RabbitmqMigration } from '../../../../src';
import { RabbitMqMigrationDeclarator } from '../../../../src/declaration/rabbit-mq-migration.declarator';
import { ExchangeType } from '../../../../src/declaration/enum/exchange-type';

export default class ExampleRabbitmqMigration extends RabbitmqMigration {
  async migrate(declarator: RabbitMqMigrationDeclarator): Promise<void> {
    await declarator
      .exchange()
      .create('example.exchange', ExchangeType.TOPIC)
      .declare();

    await declarator
      .queue()
      .create('example.event', true)
      .declare();

    await declarator
      .bindKeys()
      .bindKey('example.event', 'example.exchange', 'example.*')
      .declare();
  }
}

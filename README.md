# @purpile-nestjs/rabbitmq-migration

A powerful and intuitive library for managing RabbitMQ migrations, using a **fluent interface** for maximum developer convenience. Define and apply RabbitMQ migrations effortlessly, making queue, exchange, and binding setup clean, predictable, and repeatable.

---

## Table of Contents

1. [Requirements](#requirements)
2. [Installation](#installation)
3. [Usage](#usage)

---

## Requirements

* NestJS 10.0.0^
* rabbitmq-client 5.0.0^

---

## Installation

Install the library using npm or yarn:

```bash
npm install @purpile-nestjs/rabbitmq-migration
# or
yarn add @purpile-nestjs/rabbitmq-migration
```

---

## Usage

### Write your first migration
```typescript
//put it into ./migrations/rabbitmq

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

```

### Run migrations

### Execute it always when module will be initialized

```typescript
import { Module } from '@nestjs/common';
import { RabbitmqMigrationModule } from '@purpile-nestjs/rabbitmq-migration';

@Module({
  imports: [
    RabbitmqMigrationModule.register({
      migrationsPath: './migrations/rabbitmq', // Path to migrations
      connectionString: 'amqp://guest:guest@127.0.0.1:5672', // Your Rabbit connetion
    }),
  ],
})
export class AppModule {}
```
### Execute it as standalone application

1. Create standalone file in `src/rabbitmq-migrations.ts`
2. Copy&Paste this example code
```typescript
import { NestFactory } from '@nestjs/core';
import { RabbitmqMigrationModule } from '@purpile-nestjs/rabbitmq-migration';

async function bootstrap() {
  const app = await NestFactory.create(
    RabbitmqMigrationModule.register({
      migrationsPath: './migrations/rabbitmq', // Path to migrations
      connectionString: 'amqp://guest:guest@127.0.0.1:5672', // Your Rabbit connetion
    }),
  );
  await app.init();
}
bootstrap();
```
3. Run `node src/`

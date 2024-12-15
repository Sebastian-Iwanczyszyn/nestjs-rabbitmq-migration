import { Module } from '@nestjs/common';
import { RabbitmqMigrationModule } from '../../src';

@Module({
  imports: [
    RabbitmqMigrationModule.register({
      migrationsPath: '',
      connectionString: 'amqp://guest:guest@127.0.0.1:5672',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

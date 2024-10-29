import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './users/user.module';
import { TaskModule } from './tasks/task.module';
import { WorkspaceModule } from './workspaces/workspace.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'testuser',
      password: 'testpass',
      database: 'testapi',
      entities: ['entity/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
      dropSchema: true,
    }),
    UserModule,
    TaskModule,
    WorkspaceModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { JenkinsService } from './service/jenkies.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [AppService,JenkinsService],
})
export class AppModule {}

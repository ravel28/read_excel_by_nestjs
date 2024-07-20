import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExcelModule } from './modules/excel/excel.module';

@Module({
  imports: [ExcelModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

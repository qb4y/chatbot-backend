import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WhatsAppService } from './services/whatsapp.service';

@Module({
  imports: [HttpModule], // Agregar HttpModule aquí
  providers: [WhatsAppService],
  exports: [WhatsAppService], // Exportamos para que otros módulos lo usen
})
export class WhatsAppModule {}

import { IsArray, IsObject, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class WhatsAppMessageDto {
  @IsString()
  from: string;

  @IsString()
  id: string;

  @IsString()
  timestamp: string;

  @IsObject()
  text?: { body: string };

  @IsString()
  type: string;
}

class WhatsAppStatusDto {
  @IsString()
  id: string;

  @IsString()
  status: string;

  @IsString()
  timestamp: string;

  @IsString()
  recipient_id: string;
}

class WebhookChangeValueDto {
  @ValidateNested({ each: true })
  @Type(() => WhatsAppMessageDto)
  messages?: WhatsAppMessageDto[];

  @ValidateNested({ each: true })
  @Type(() => WhatsAppStatusDto)
  statuses?: WhatsAppStatusDto[];
}

class WebhookChangeDto {
  @IsObject()
  @ValidateNested()
  @Type(() => WebhookChangeValueDto)
  value: WebhookChangeValueDto;

  @IsString()
  field: string;
}

class WebhookEntryDto {
  @IsString()
  id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WebhookChangeDto)
  changes: WebhookChangeDto[];
}

export class WebhookRequestDto {
  @IsString()
  object: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WebhookEntryDto)
  entry: WebhookEntryDto[];
}

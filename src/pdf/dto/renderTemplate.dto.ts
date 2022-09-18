import { IsOptional, IsString } from 'class-validator';

export class RenderTemplateDto {
  @IsString()
  templateName: string;

  @IsOptional()
  templateParameters: any;
}

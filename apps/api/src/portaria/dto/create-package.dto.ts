import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePackageDto {
  @IsOptional()
  @IsString()
  unitId!: string;

  @IsOptional()
  @IsString()
  recipientPersonId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  carrier?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  trackingCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
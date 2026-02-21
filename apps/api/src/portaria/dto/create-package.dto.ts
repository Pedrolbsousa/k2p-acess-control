import { IsOptional, IsString, MaxLength } from "class-validator";

export class CreatePackageDto {
  @IsString()
  condominiumId!: string;

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
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;
}
import { IsOptional, IsString, MaxLength } from "class-validator";

export class DeliverPackageDto {
  @IsString()
  @MaxLength(120)
  deliveredToName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  deliveredToDocument?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;
}

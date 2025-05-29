import { IsNumber, IsOptional, Min } from "class-validator";

export class UpdateUserInventoryDto {
  @IsNumber()
  @Min(0)
  @IsOptional()
  currentStock?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  incoming?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  consumed?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  total?: number;
}
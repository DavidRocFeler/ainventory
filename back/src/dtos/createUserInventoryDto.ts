import { IsNumber, IsOptional, Min } from "class-validator";

export class CreateUserInventoryDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  productId: number;

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
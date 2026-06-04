import { IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({
    description: "Admin password",
    example: "123456",
  })
  @IsString()
  @MinLength(4)
  password!: string;
}
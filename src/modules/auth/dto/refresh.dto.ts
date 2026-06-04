import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RefreshDto {
  @ApiProperty({
    description: "Refresh token",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2ODg3ODQwMDAsImV4cCI6MTY4ODg0MDgwMH0.abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567890",
  })
  @IsString()
  refresh_token!: string;
}
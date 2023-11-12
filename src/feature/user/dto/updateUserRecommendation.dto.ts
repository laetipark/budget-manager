import { IsBoolean } from 'class-validator';

export class UpdateUserRecommendationDto {
  @IsBoolean({})
  isRecommended!: boolean;
}

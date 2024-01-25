import { Cinema } from './cinema';
import { PaginationQueryDto } from './query';

export class Food {
  id: number;

  name: string;

  description: string;

  quantity: number;

  price: number;

  cinemaId: number;

  cinema?: Cinema;
}

export class CreateFoodDto {
  name: string;

  description: string;

  quantity: number;

  price: number;

  cinemaId: number;
}

export class UpdateFoodDto {
  name?: string;

  description?: string;

  quantity?: number;

  price?: number;
}

export enum FoodQueryInclude {
  Cinema = 'cinema',
}

export const foodQueryIncludes = Object.values(FoodQueryInclude);

export class FoodQueryDto extends PaginationQueryDto {
  ids?: number[];
  excludeId?: number[];
  search?: string;
  cinemaId?: number;
  includes?: FoodQueryInclude[];
}

import { CreateFoodDto, FoodQueryDto, UpdateFoodDto } from 'types/food';
import { authAxiosInstance } from 'utils/axios';

export const getFoods = (query?: FoodQueryDto) => {
  return authAxiosInstance.get('/foods', {
    params: { ...query, includes: query?.includes?.join(',') },
  });
};

export const getFoodById = (id: number | string) => {
  return authAxiosInstance.get(`/foods/${id}`);
};

export const createFood = (data: CreateFoodDto) => {
  return authAxiosInstance.post('/foods', data);
};

export const updateFood = (id: number, data: UpdateFoodDto) => {
  return authAxiosInstance.put(`/foods/${id}`, data);
};

export const deleteFood = (id: number) => {
  return authAxiosInstance.delete(`/foods/${id}`);
};

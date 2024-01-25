import { CreateRoomInputDto, UpdateRoomInputDto } from 'types/room';
import { authAxiosInstance } from 'utils/axios';

export const getRoomsByCinemaId = (cinemaId: number | string) => {
  return authAxiosInstance.get(`/cinemas/${cinemaId}/rooms`);
};

export const getRoomById = (roomId: number | string) => {
  return authAxiosInstance.get(`/rooms/${roomId}`);
};

export const createRoom = (data: CreateRoomInputDto) => {
  return authAxiosInstance.post('/rooms', data);
};

export const updateRoom = (
  roomId: number | string,
  data: UpdateRoomInputDto,
) => {
  return authAxiosInstance.put(`/rooms/${roomId}`, data);
};

export const deleteRoom = (roomId: number | string) => {
  return authAxiosInstance.delete(`/rooms/${roomId}`);
};

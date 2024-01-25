import { BASE_URL } from './axios';

export const DEFAULT_AVATAR_URL =
  'https://st3.depositphotos.com/9998432/13335/v/450/depositphotos_133351928-stock-illustration-default-placeholder-man-and-woman.jpg';

export const getImageUrl = (imageId?: number | null) => {
  if (!imageId) {
    return null;
  }
  return `${BASE_URL}/files/public/image/i/${imageId}`;
};

export const getImageUrlOrDefault = (imageId?: number | null) => {
  if (!imageId) {
    return DEFAULT_AVATAR_URL;
  }
  return getImageUrl(imageId)!;
};

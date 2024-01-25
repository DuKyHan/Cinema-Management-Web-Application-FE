import { Location } from 'types/location';

export const locationToString = (location?: Location | null) => {
  if (location == null) return 'Unknown';
  let result = '';
  if (location.addressLine1) {
    result += location.addressLine1;
    result += ', ';
  }
  if (location.addressLine2) {
    result += location.addressLine2;
    result += ', ';
  }
  if (location.locality) {
    result += location.locality;
    result += ', ';
  }
  if (location.region) {
    result += location.region;
    result += ', ';
  }
  if (location.country) {
    result += location.country;
  }
  return result;
};

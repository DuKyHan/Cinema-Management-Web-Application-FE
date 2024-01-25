import { PaginationQueryDto } from 'types/query';
import { Role } from 'types/role';
import { authAxiosInstance } from 'utils/axios';

export enum GetAccountIncludes {
  VerificationList = 'verification-list',
  BanList = 'ban-list',
  Profile = 'profile',
}

export class BaseAccountQueryDto extends PaginationQueryDto {
  includes?: GetAccountIncludes[];
}

export class GetAccountQueryDto extends BaseAccountQueryDto {
  ids?: number[];

  excludeIds?: number[];

  isBanned?: boolean;

  isVerified?: boolean;

  email?: string;

  search?: string;

  role?: string[];

  excludeRole?: string[];

  createdAt?: Date[];
}

export const getAccounts = (query?: GetAccountQueryDto) => {
  return authAxiosInstance.get('/accounts', {
    params: {
      ...query,
      ids: query?.ids?.join(','),
      excludeIds: query?.excludeIds?.join(','),
      role: query?.role?.join(','),
      excludeRole: query?.excludeRole?.join(','),
      createdAt: query?.createdAt?.map(date => date.toISOString()).join(','),
    },
  });
};

export const updateAccountRole = (id: number, role: Role) => {
  return authAxiosInstance.post(`/accounts/${id}/roles`, { roles: [role] });
};

export const banAccount = (id: number) => {
  return authAxiosInstance.post(`/accounts/${id}/ban`, { isBanned: true });
};

export const unbanAccount = (id: number) => {
  return authAxiosInstance.post(`/accounts/${id}/ban`, { isBanned: false });
};

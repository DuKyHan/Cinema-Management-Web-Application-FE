import { Profile } from './profile';
import { CountQueryDto, PaginationQueryDto } from './query';

export enum ReportType {
  General = 'general',
  Ticket = 'ticket',
}

export const reportTypes = Object.values(ReportType);

export enum ReportStatus {
  Pending = 'pending',
  Cancelled = 'cancelled',
  Completed = 'completed',
  Rejected = 'rejected',
}

export const reportStatuses = Object.values(ReportStatus);

export class ReportMessage {
  id: number;

  senderId: number;

  sender?: Profile;

  content: string;

  files: File[];

  createdAt: Date;

  updatedAt: Date;
}

export class Report {
  id: number;

  type: ReportType;

  status: ReportStatus;

  title: string;

  content: string;

  reporterId: number;

  reporter?: Profile;

  reviewerId: number;

  reviewer?: Profile;

  createdAt: Date;

  updatedAt: Date;

  messages?: ReportMessage[];
}

export enum GetReportQuerySort {
  createdAtAsc = 'createdAt',
  createdAtDesc = '-createdAt',
  updatedAtAsc = 'updatedAt',
  updatedAtDesc = '-updatedAt',
}

export const getReportQuerySorts = Object.values(GetReportQuerySort);

export enum GetReportQueryInclude {
  Reporter = 'reporter',
  Reviewer = 'reviewer',
  Message = 'message',
}

export const getReportQueryIncludes = Object.values(GetReportQueryInclude);

export class BaseGetReportQueryDto {
  include?: GetReportQueryInclude[];
}

export class GetReportQueryDto extends PaginationQueryDto {
  id?: number[];

  reporterId?: number;

  mine?: boolean;

  isReviewer?: boolean;

  name?: string;

  type?: ReportType[];

  status?: ReportStatus[];

  include?: GetReportQueryInclude[];

  sort?: GetReportQuerySort;
}

export class CountReportQueryDto extends CountQueryDto {
  type?: ReportType[];

  status?: ReportStatus[];
}

export class CreateReportMessageInputDto {
  content: string;

  fileIds?: number[];
}

export class CreateReportInputDto {
  type: ReportType;

  title: string;

  message: CreateReportMessageInputDto;
}

export class UpdateReportStatusInputDto {
  message?: string;
}

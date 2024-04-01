export interface BatchAssignDetail {
  id?: number;
  imei: string;
  success: boolean;
}

export interface BatchAssign {
  id?: number;
  batchCode?: string;
  uploadedOn?: Date;
  uploadedBy?: string;
  assignedTo?: string;
  totalRecords?: number;
  uploadedSuccess?: number;
  uploadedFailure?: number;
  details?: BatchAssignDetail[];
}

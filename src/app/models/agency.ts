export interface Agency {
  id?: number;
  name?: string;
  email?: string;
  username?: string;
  password?: string;
  blocked?: boolean;
  level?: Agency.LevelEnum;
  role?: Agency.RoleEnum;
}
export namespace Agency {
  export type LevelEnum = 'MASTER_AGENT' | 'DISTRIBUTOR' | 'RETAILER' | 'EMPLOYEE';
  export const LevelEnum = {
      MasterAgent: 'MASTER_AGENT' as LevelEnum,
      Distributor: 'DISTRIBUTOR' as LevelEnum,
      Retailer: 'RETAILER' as LevelEnum,
      Employee: 'EMPLOYEE' as LevelEnum
  };
  export type RoleEnum = 'ADMIN' | 'EMPLOYEE';
  export const RoleEnum = {
      Admin: 'ADMIN' as RoleEnum,
      Distributor: 'DISTRIBUTOR' as RoleEnum,
      Retailer: 'RETAILER' as RoleEnum,
      Employee: 'EMPLOYEE' as RoleEnum
  };
}

import { Role, UserMetadata, User } from "auth0";
import { PermitRef, WellPermitStatus } from "./WellPermit";


export interface UserData {
  uid: string;
  permits: {
    permitRefs: any
    status: 'requested' | 'approved'
  }
}

export interface AppMetadata {
  permitRefs?: PermitRef[]
}

export type UserManagement = User<AppMetadata, UserMetadata> & { roles?: Role[] }

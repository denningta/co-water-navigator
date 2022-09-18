import { Role, UserMetadata, User } from "auth0";
import { WellPermitStatus } from "./WellPermit";


export interface UserData {
  uid: string;
  permits: {
    permitRefs: any
    status: 'requested' | 'approved'
  }
}

export interface AppMetadata {
  permitRefs?: {
    document_id?: string
    status?: WellPermitStatus
  }[]
}

export type UserManagement = User<AppMetadata, UserMetadata> & { roles?: Role[] }

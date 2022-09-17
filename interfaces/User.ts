import { Role, UserMetadata, AppMetadata, User } from "auth0";


export interface UserData {
  uid: string;
  permits: {
    permitRefs: any
    status: 'requested' | 'approved'
  }
}

export type UserManagement = User<AppMetadata, UserMetadata> & { roles?: Role[] }

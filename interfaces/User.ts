export default interface User {
  email: string;
  key: string;
  roles: string[];
  _token: string;
  _tokenExpiration: Date;
}

export interface UserData {
  uid: string;
  permits: {
    permitRefs: any
    status: 'requested' | 'approved'
  }
}
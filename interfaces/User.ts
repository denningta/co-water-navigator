export default interface User {
  email: string;
  key: string;
  roles: string[];
  _token: string;
  _tokenExpiration: Date;
}

export interface UserData {
  key: string;
  roles: any;
  rolesRequests?: any;
  creationTime: Date;
  email: string;
  notificationAddress: string;
  notifications: boolean;
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  phoneNumber: string;
  wellPermits: string[] // TODO: array of well permits approved or requested by user
}
export class HttpError {
  error: string;
  detail: string;
  status: number;

  constructor(
    error: string,
    detail: string,
    status: number,
  ){
    this.error = error;
    this.detail = detail;
    this.status = status;
  }

}

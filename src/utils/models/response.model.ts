export class ResponseModel<T> {
  statusCode: number;
  response?: T;
  message?: string;
  error?: string;
}

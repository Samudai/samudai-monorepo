export class AppError extends Error {
  statusCode: string;
  status: string;
  constructor(statusCode: string, status: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.status = status;
    this.message = message;
  }
}


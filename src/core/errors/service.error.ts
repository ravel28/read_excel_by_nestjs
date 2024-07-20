import AppError from 'src/core/errors/app.error';

class ServiceError extends AppError {
  constructor(message: string, suberror?: any) {
    super(message, 500, ServiceError.name, suberror);
    Object.setPrototypeOf(this, ServiceError.prototype);
  }

  serializeErrors(): { message: string; status: number; suberrors: any[] }[] {
    return [
      { message: this.message, status: this.status, suberrors: this.suberror },
    ];
  }
}

export default ServiceError;

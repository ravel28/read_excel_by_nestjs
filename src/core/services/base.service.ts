import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import ServiceError from 'src/core/errors/service.error';

abstract class BaseService {
  public logger: Logger;
  private instanceName: string;

  constructor(instance: string) {
    this.logger = new Logger(instance);
    this.instanceName = instance;
  }

  /**
   * Plugin of debug to simple code
   * @param message
   * @param context
   */
  async debug(message: string, context: any) {
    this.logger.debug(message, context);
  }
  
  handleErrorService(error: any) {
    this.logger.error(error.name);
    this.logger.error(error);
    if (error.response.statusCode === 404)
      throw new NotFoundException(error.response);
    if (error.response.statusCode === 400)
      throw new BadRequestException(error.response);
    throw new ServiceError(error);
  }
}

export default BaseService;

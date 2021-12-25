import * as winston from "winston";
import * as path from "path";

// TODO: Make this log errors better.

export default class ServiceLogger {
  private logger: winston.Logger;
  private accessLogger: winston.Logger;
  
  constructor(log_dir_path: string) {
    const serviceLogConfigurationOptions: winston.LoggerOptions = {
      level: 'info',
      format:  winston.format.combine(
        winston.format.timestamp({format: "MM/DD/YYYY HH:mm:ss"}),
        winston.format.simple()
      ),
      defaultMeta: { service: 'oriel-service' },
      transports: [
        new winston.transports.File({ filename: path.join(log_dir_path, "error.log"), level: "error" }),
        new winston.transports.File({ filename: path.join(log_dir_path, "combined_service.log") }),
      ],
    };

    const accessLogConfigurationOptions: winston.LoggerOptions = {
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp({format: "MM/DD/YYYY HH:mm:ss"}),
        winston.format.printf(info => `${info.timestamp} - ${info.message}`)
      ),
      defaultMeta: { service: 'oriel-service' },
      transports: [
        new winston.transports.File({ filename: path.join(log_dir_path, "access.log") }),
      ],
    }
    this.logger = winston.createLogger(serviceLogConfigurationOptions);
    this.accessLogger = winston.createLogger(accessLogConfigurationOptions);
  }

  info(message: string){
    this.logger.info(message);
  }

  error(message?: string, ...meta) {
    this.logger.error(message, meta);
  }

  async _logServiceAccess(req, res, next){
    try {
      if (res.statusCode) {
        const { url, method, rawHeaders, params } = req;
        const useable_headers = this.transformHeaders(rawHeaders);
        await this.accessLogger.info(`${method} - ${url} - ${res.statusCode} - ${useable_headers.user_agent} - ${params.wallet_address || ""}`);
      }
    } catch(e) {
      next(new ServiceLoggerException(e.message));
    }
    next();
  }

  private transformHeaders(rawHeaders: Array<string>) {
    const lowerCaseHeaders = rawHeaders.map(s => {return s.toLowerCase()});
    let jsonHeaders = Object();
    for (let i = 0; i < lowerCaseHeaders.length - 1; i++) {
      if (i % 2 === 0) {
        jsonHeaders[String(lowerCaseHeaders[i]).replace("-", "_")] = String(lowerCaseHeaders[i + 1])
      }
    }
    return jsonHeaders;
  }
}

export class ServiceLoggerException extends Error {
  constructor(message: string, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ServiceLoggerException);
    }

    this.name = "ServiceLoggerException";
    this.message = message;
  }
}

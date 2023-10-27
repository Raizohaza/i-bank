import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import * as chalk from 'chalk';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void): void {
    console.log('******* LoggerMiddleware *******');
    const logger = new Logger('Request');
    logger.log(
      `[${chalk.white(req.method)}] ${chalk.cyan(
        res.statusCode?.toString()
      )} ` +
        `${chalk.white('|')} ${chalk.cyan(req.httpVersion)} ${chalk.white(
          '|'
        )} ${chalk.cyan(req.ip)} ` +
        `[${chalk.white('route:', req.originalUrl)}]` +
        `[${chalk.white('body:', JSON.stringify(req.body))}]` +
        `[${chalk.white('params:', JSON.stringify(req.params))}]` +
        `[${chalk.white('query:', JSON.stringify(req.query))}]`
    );
    next();
  }
}

import { createLogger, format, transports } from 'winston';

const customFormat = format.printf(({ level, message, label, timestamp }) => {
  return `${timestamp} ${label} [${level}]: ${message}`;
});
const nodeEnv = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';

const logger = createLogger({
  level: 'debug',
  format: format.combine(
    format.colorize(),
    format.label({
      label: nodeEnv,
    }),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    customFormat,
  ),
  transports: [new transports.Console()],
});
export default logger;

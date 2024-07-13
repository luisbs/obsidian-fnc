export type LogLevelValue = 0b000 | 0b001 | 0b010 | 0b011 | 0b100
export const LogLevel = {
  ERROR: 0b000 as LogLevelValue,
  WARN: 0b001 as LogLevelValue,
  INFO: 0b010 as LogLevelValue,
  DEBUG: 0b011 as LogLevelValue,
  TRACE: 0b100 as LogLevelValue,
}
export const LogLevelReverse: Record<LogLevelValue, string> = {
  [0b000]: 'ERROR',
  [0b001]: 'WARN ',
  [0b010]: 'INFO ',
  [0b011]: 'DEBUG',
  [0b100]: 'TRACE',
}

export interface LogEntry {
  timestamp: Date
  namespace: string
  level: LogLevelValue
  data: unknown[]
}

export interface LoggerDriver {
  error(prefix: string, data: unknown[]): void
  warn(prefix: string, data: unknown[]): void
  info(prefix: string, data: unknown[]): void
  debug(prefix: string, data: unknown[]): void
  trace(prefix: string, data: unknown[]): void

  /** Starts a logs group, and returns a function to end the group. */
  group(prefix: string, data: unknown[]): () => void
}

export class ConsoleLoggerDriver implements LoggerDriver {
  public error(prefix: string, data: unknown[]): void {
    console.error(prefix, ...data)
  }
  public warn(prefix: string, data: unknown[]): void {
    console.warn(prefix, ...data)
  }
  public info(prefix: string, data: unknown[]): void {
    console.info(prefix, ...data)
  }
  public debug(prefix: string, data: unknown[]): void {
    console.debug(prefix, ...data)
  }
  public trace(prefix: string, data: unknown[]): void {
    console.trace(prefix, ...data)
  }

  public group(prefix: string, data: unknown[]): () => void {
    console.groupCollapsed(...data)
    return console.groupEnd
  }
}

export class FileLoggerDriver implements LoggerDriver {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  public error(prefix: string, data: unknown[]): void {
    throw new Error('FileLogger not implemented')
  }
  public warn(prefix: string, data: unknown[]): void {
    throw new Error('FileLogger not implemented')
  }
  public info(prefix: string, data: unknown[]): void {
    throw new Error('FileLogger not implemented')
  }
  public debug(prefix: string, data: unknown[]): void {
    throw new Error('FileLogger not implemented')
  }
  public trace(prefix: string, data: unknown[]): void {
    throw new Error('FileLogger not implemented')
  }

  public group(prefix: string, data: unknown[]): () => void {
    throw new Error('FileLogger not implemented')
  }
  /* eslint-enable @typescript-eslint/no-unused-vars */
}

export class Logger {
  // TODO: add support for file logging
  protected static drivers: LoggerDriver[] = [new ConsoleLoggerDriver()]
  // public static setDrivers(): void {}

  constructor(protected namespace: string) {}

  protected static prefix(timestamp: Date, namespace: string, level: LogLevelValue): string {
    // [13:14:15.012] LEVEL (namespace): <message>
    //`[${hh}:${mm}:${ss}.${ms}] ${lvl} (${namespace}):`
    // prettier-ignore
    return (
      '[' + String(timestamp.getHours()).padStart(2, '0') +
      ':' + String(timestamp.getMinutes()).padStart(2, '0') +
      ':' + String(timestamp.getSeconds()).padStart(2, '0') +
      '.' + String(timestamp.getMilliseconds()).padStart(3, '0') +
      '] ' + LogLevelReverse[level] + ' (' + namespace + '):'
    )
  }

  public log(timestamp: Date, namespace: string, level: LogLevelValue, data: unknown[]): void {
    const prefix = Logger.prefix(timestamp, namespace, level)

    switch (level) {
      case LogLevel.ERROR:
        return Logger.drivers.forEach((driver) => driver.error(prefix, data))
      case LogLevel.WARN:
        return Logger.drivers.forEach((driver) => driver.warn(prefix, data))
      case LogLevel.INFO:
        return Logger.drivers.forEach((driver) => driver.info(prefix, data))
      case LogLevel.DEBUG:
        return Logger.drivers.forEach((driver) => driver.debug(prefix, data))
      default:
        return Logger.drivers.forEach((driver) => driver.trace(prefix, data))
    }
  }

  public error(...data: unknown[]): void {
    this.log(new Date(), this.namespace, LogLevel.ERROR, data)
  }
  public warn(...data: unknown[]): void {
    this.log(new Date(), this.namespace, LogLevel.WARN, data)
  }
  public info(...data: unknown[]): void {
    this.log(new Date(), this.namespace, LogLevel.INFO, data)
  }
  public debug(...data: unknown[]): void {
    this.log(new Date(), this.namespace, LogLevel.DEBUG, data)
  }
  public trace(...data: unknown[]): void {
    this.log(new Date(), this.namespace, LogLevel.TRACE, data)
  }

  public on(logger: unknown): Logger {
    return logger && logger instanceof Logger ? new LoggerWrapper(this.namespace, logger) : this
  }

  public group(...data: unknown[]): LoggingGroup {
    return new LoggingGroup(this.namespace, ...data)
  }
}

export class LoggerWrapper extends Logger {
  constructor(
    namespace: string,
    private logger: Logger,
  ) {
    super(namespace)
  }

  public error(...data: unknown[]): void {
    this.logger.log(new Date(), this.namespace, LogLevel.ERROR, data)
  }
  public warn(...data: unknown[]): void {
    this.logger.log(new Date(), this.namespace, LogLevel.WARN, data)
  }
  public info(...data: unknown[]): void {
    this.logger.log(new Date(), this.namespace, LogLevel.INFO, data)
  }
  public debug(...data: unknown[]): void {
    this.logger.log(new Date(), this.namespace, LogLevel.DEBUG, data)
  }
  public trace(...data: unknown[]): void {
    this.logger.log(new Date(), this.namespace, LogLevel.TRACE, data)
  }

  public flush(...data: unknown[]): void {
    if (this.logger instanceof LoggingGroup) this.logger.flush(...data)
    else this.logger.log(new Date(), this.namespace, LogLevel.INFO, data)
  }
}

export class LoggingGroup extends Logger {
  #logs: LogEntry[] = []

  constructor(namespace: string, ...data: unknown[]) {
    super(namespace)
    if (data.length > 0) this.info(...data)
  }

  public log(timestamp: Date, namespace: string, level: LogLevelValue, data: unknown[]): void {
    this.#logs.push({ timestamp, namespace, level, data })
  }

  flush(...data: unknown[]): void {
    // TODO: add support for file logging
    const prefix = Logger.prefix(new Date(), this.namespace, LogLevel.INFO)

    // starts logging groups
    const closers = Logger.drivers.map((driver) => driver.group(prefix, data))

    // logs stored entries
    for (const { timestamp, namespace, level, data } of this.#logs) {
      super.log(timestamp, namespace, level, data)
    }

    // ends logging groups
    for (const closer of closers) closer()

    this.#logs = []
  }
}

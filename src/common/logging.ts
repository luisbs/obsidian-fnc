export type LogLevelValue = 0b00 | 0b01 | 0b10 | 0b11
export const LogLevel = {
  ERROR: 0b00 as LogLevelValue,
  WARN: 0b01 as LogLevelValue,
  INFO: 0b10 as LogLevelValue,
  DEBUG: 0b11 as LogLevelValue,
}
export const LogLevelReverse: Record<LogLevelValue, string> = {
  [0b00]: 'ERROR',
  [0b01]: 'WARN ',
  [0b10]: 'INFO ',
  [0b11]: 'DEBUG',
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
    console.log(prefix, ...data)
  }
  public debug(prefix: string, data: unknown[]): void {
    console.debug(prefix, ...data)
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
      default:
        return Logger.drivers.forEach((driver) => driver.debug(prefix, data))
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

  public on(logger: unknown): Logger {
    return logger && logger instanceof Logger ? new LoggerWrapper(this.namespace, logger) : this
  }

  public group(...data: unknown[]): LoggingGroup {
    return new LoggingGroup(this.namespace, ...data)
  }
}

export class LoggerWrapper extends Logger {
  constructor(namespace: string, private logger: Logger) {
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

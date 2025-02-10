import { ConsoleLogDriver, LogDriver } from './LogDrivers'

type RArray<T> = Array<T[] | T | undefined>

export interface LogEntry {
    level: LogLevelValue
    content: unknown[]
    timestamp: Date
}

export type LogLevelValue = 1 | 2 | 3 | 4 | 5
export const LogLevel = Object.freeze({
    TRACE: 1,
    DEBUG: 2,
    INFO: 3,
    WARN: 4,
    ERROR: 5,
})
export const LogLevelReverse: Record<LogLevelValue, string> = Object.freeze({
    [1]: 'TRACE',
    [2]: 'DEBUG',
    [3]: 'INFO ',
    [4]: 'WARN ',
    [5]: 'ERROR',
})

export class Logger {
    #parent?: Logger
    #level?: LogLevelValue
    #format?: string
    #drivers: LogDriver[] = []
    #namespaces: string[] = []

    /** Overrides chain inherited value. */
    get level(): LogLevelValue {
        if (this.#level) return this.#level
        return this.#parent?.level ?? LogLevel.WARN
    }
    get format(): string {
        if (this.#format) return this.format
        return this.#parent?.format ?? '[hh:mm:ss.ms] level (namespace):'
    }
    get namespace(): string {
        const result: string[] = []
        for (let i = 0; i < this.#namespaces.length - 1; i++) {
            result.push(this.#namespaces[i][0])
        }
        result.push(this.#namespaces.at(-1) ?? '')
        return result.join('.')
    }
    get drivers(): readonly LogDriver[] {
        return Object.freeze(this.#drivers)
    }

    /** Change on level is propagated. */
    setLevel(level: LogLevelValue): this {
        this.#level = level
        return this
    }
    /**
     * Change on format is propageted.
     * The valid placeholders are:
     * - `hh` (hour)
     * - `mm` (minute)
     * - `ss` (second)
     * - `ms` (millisecond)
     * - `level`
     * - `namespace`
     * @example '[hh:mm:ss.ms] level (namespace):'
     */
    setFormat(format: string): this {
        this.#format = format
        return this
    }
    /** Change on drivers is not propagated after construction. */
    addDrivers(...drivers: RArray<LogDriver>): this {
        for (const driver of drivers) {
            if (Array.isArray(driver)) this.#drivers.push(...driver)
            else if (driver) this.#drivers.push(driver)
        }
        return this
    }
    /** Change on namespaces is not propagated after construction. */
    addNamespaces(...namespaces: RArray<string>): this {
        for (const namespace of namespaces) {
            if (Array.isArray(namespace)) this.#namespaces.push(...namespace)
            else if (namespace) this.#namespaces.push(namespace)
        }
        return this
    }

    /** Starts a Loggers chain. */
    static consoleLogger(namespace?: string | string[]): Logger {
        const logger = new Logger()
        logger.setLevel(LogLevel.WARN)
        logger.addDrivers(new ConsoleLogDriver())
        logger.addNamespaces(namespace)

        return logger
    }
    /** Spawns a Sub-Logger. */
    make(namespace?: string | string[]): Logger {
        const logger = new Logger()
        logger.#parent = this
        logger.addDrivers(this.#drivers)
        logger.addNamespaces(this.#namespaces, namespace)

        return logger
    }

    /** Prepare the log prefix based on `this.format` */
    protected prefix(timestamp: Date, level: LogLevelValue): string {
        return this.format
            .replace('hh', String(timestamp.getHours()).padStart(2, '0'))
            .replace('mm', String(timestamp.getMinutes()).padStart(2, '0'))
            .replace('ss', String(timestamp.getSeconds()).padStart(2, '0'))
            .replace('ms', String(timestamp.getMilliseconds()).padStart(3, '0'))
            .replace('level', LogLevelReverse[level])
            .replace('namespace', this.namespace)
    }

    log(timestamp: Date, level: LogLevelValue, content: unknown[]): void {
        // only log levels equal or higher
        if (this.level > level) return

        const prefix = this.prefix(timestamp, level)
        switch (this.level) {
            case LogLevel.ERROR:
                this.#drivers.forEach((driver) => driver.error(prefix, content))
                break
            case LogLevel.WARN:
                this.#drivers.forEach((driver) => driver.warn(prefix, content))
                break
            case LogLevel.INFO:
                this.#drivers.forEach((driver) => driver.info(prefix, content))
                break
            case LogLevel.DEBUG:
                this.#drivers.forEach((driver) => driver.debug(prefix, content))
                break
            default:
                this.#drivers.forEach((driver) => driver.trace(prefix, content))
        }
    }

    error(...content: unknown[]): void {
        this.log(new Date(), LogLevel.ERROR, content)
    }
    warn(...content: unknown[]): void {
        this.log(new Date(), LogLevel.WARN, content)
    }
    info(...content: unknown[]): void {
        this.log(new Date(), LogLevel.INFO, content)
    }
    debug(...content: unknown[]): void {
        this.log(new Date(), LogLevel.DEBUG, content)
    }
    trace(...content: unknown[]): void {
        this.log(new Date(), LogLevel.TRACE, content)
    }

    // on(logger: unknown): Logger {
    //   return logger && logger instanceof Logger ? new LoggerWrapper(this.namespace, logger) : this
    // }

    // /** Spawns a Sub-Logger, that groups the logs. */
    group(...content: unknown[]): LoggingGroup {
        const logger = new LoggingGroup()
        logger.#parent = this
        logger.addDrivers(this.#drivers)
        logger.addNamespaces(this.#namespaces)

        logger.log(new Date(), LogLevel.INFO, content)
        return logger
    }
}

// export class LoggerWrapper extends Logger {
//     constructor(
//         namespace: string,
//         private logger: Logger,
//     ) {
//         super(namespace)
//     }

//     public error(...content: unknown[]): void {
//         this.logger.log(new Date(), this.namespace, LogLevel.ERROR, content)
//     }
//     public warn(...content: unknown[]): void {
//         this.logger.log(new Date(), this.namespace, LogLevel.WARN, content)
//     }
//     public info(...content: unknown[]): void {
//         this.logger.log(new Date(), this.namespace, LogLevel.INFO, content)
//     }
//     public debug(...content: unknown[]): void {
//         this.logger.log(new Date(), this.namespace, LogLevel.DEBUG, content)
//     }
//     public trace(...content: unknown[]): void {
//         this.logger.log(new Date(), this.namespace, LogLevel.TRACE, content)
//     }

//     public flush(...content: unknown[]): void {
//         if (this.logger instanceof LoggingGroup) this.logger.flush(...content)
//         else this.logger.log(new Date(), this.namespace, LogLevel.INFO, content)
//     }
// }

export class LoggingGroup extends Logger {
    #logs: LogEntry[] = []

    log(timestamp: Date, level: LogLevelValue, content: unknown[]): void {
        // only log levels equal or higher
        if (this.level > level) return

        this.#logs.push({ timestamp, level, content })
    }

    flush(...content: unknown[]): void {
        // open logging groups
        const prefix = this.prefix(new Date(), LogLevel.INFO)
        const closers = this.drivers.map((driver) =>
            driver.group(prefix, content),
        )

        // logs stored entries
        for (const { timestamp, level, content } of this.#logs) {
            super.log(timestamp, level, content)
        }

        // close logging groups
        closers.forEach((close) => close())

        this.#logs = []
    }
}

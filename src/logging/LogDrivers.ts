export interface LogDriver {
    error(prefix: string, content: unknown[]): void
    warn(prefix: string, content: unknown[]): void
    info(prefix: string, content: unknown[]): void
    debug(prefix: string, content: unknown[]): void
    trace(prefix: string, content: unknown[]): void

    /** Starts a log group, and returns a function to end the group. */
    group(prefix: string, content: unknown[]): () => void
}

export class ConsoleLogDriver implements LogDriver {
    public error(prefix: string, content: unknown[]): void {
        console.error(prefix, ...content)
    }
    public warn(prefix: string, content: unknown[]): void {
        console.warn(prefix, ...content)
    }
    public info(prefix: string, content: unknown[]): void {
        console.info(prefix, ...content)
    }
    public debug(prefix: string, content: unknown[]): void {
        console.debug(prefix, ...content)
    }
    public trace(prefix: string, content: unknown[]): void {
        console.trace(prefix, ...content)
    }

    public group(prefix: string, content: unknown[]): () => void {
        console.groupCollapsed(prefix, ...content)
        return console.groupEnd
    }
}

// TODO: add support for file logging
// export class FileLogDriver implements LogDriver {
//     public error(prefix: string, content: unknown[]): void {
//         throw new Error('FileLogger not implemented')
//     }
//     public warn(prefix: string, content: unknown[]): void {
//         throw new Error('FileLogger not implemented')
//     }
//     public info(prefix: string, content: unknown[]): void {
//         throw new Error('FileLogger not implemented')
//     }
//     public debug(prefix: string, content: unknown[]): void {
//         throw new Error('FileLogger not implemented')
//     }
//     public trace(prefix: string, content: unknown[]): void {
//         throw new Error('FileLogger not implemented')
//     }

//     public group(prefix: string, content: unknown[]): () => void {
//         throw new Error('FileLogger not implemented')
//     }
// }

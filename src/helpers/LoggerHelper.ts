let logBuffer: string[] = [];

function format(type: string, message: string): string{
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${type.toUpperCase()}] ${message}`;
}

function push(type: string, message: string){
    const entry = format(type, message);
    logBuffer.push(entry);
    console.log(entry);
}

export const logger = {
    info: (message: string) => push('info', message),
    warn: (message: string) => push('warn', message),
    verify: (message: string) => push('verify', message),
    bug: (message: string) => push('bug', message),
    step: (message: string) => push('step', message),

    getLogs: () => logBuffer.join('\n'),
    clear: () => {
        logBuffer = [];
    }
};
import fs from "node:fs";

export interface ILogger {
    info: (message: string) => void;
    error: (message: string) => void;
}

export class Logger implements ILogger {
    constructor() {
        //create server.log file   
        fs.appendFileSync(`${import.meta.dirname}/server.log`, `Server started at ${new Date().toISOString()}, on ${import.meta.dirname}\n`);
    }
    info(message: string) {
        fs.appendFileSync(`${import.meta.dirname}/server.log`, `${new Date().toISOString()} - I: ${message}\n`);
    }
    error(message: string) {
        fs.appendFileSync(`${import.meta.dirname}/server.log`, `${new Date().toISOString()} - E: ${message}\n`);
    }
}   
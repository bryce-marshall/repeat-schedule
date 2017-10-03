import { ArgumentException } from "@brycemarshall/exception";

export function trunc(n: number): number {
    return n >= 0 ? Math.floor(n) : Math.ceil(n);
}

export function validateNumber(parameterName: string, value: number) {
    if (typeof (value) != "number") throw new ArgumentException(parameterName, "Must be a number.");
}

export function validateInteger(parameterName: string, value: number) {
    if (typeof (value) != "number" || value != trunc(value)) throw new ArgumentException(parameterName, "Must be an integer.");
}
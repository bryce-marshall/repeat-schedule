import { ArgumentException } from "@brycemarshall/exception";

export class ArgumentValidator {

    static validateNumber(parameterName: string, value: number) {
        if (typeof (value) != "number") throw new ArgumentException(parameterName, "Must be a number.");
    }

    static validateInteger(parameterName: string, value: number) {
        if (typeof (value) != "number" || value != Math.trunc(value)) throw new ArgumentException(parameterName, "Must be an integer.");
    }
}
import { ArgumentNullException, ArgumentException } from "@brycemarshall/exception";
import { Timespan } from "@brycemarshall/timespan";

export class DateHelper {
    /**
     * Returns a copy of the specified Date object.
     * @param value The date to copy.
     * */
    static clone(value: Date) {
        if (value == null) throw new ArgumentNullException("value");
        return new Date(value.getTime());
    }

    /**
     * Returns a Date object representing the date component of another Date (with the hour, minute, second, and millisecond components set to zero).
     * @param date The Date from which to extract the date part.
     * @param utcTime If true, the result will be expressed as UTC time, otherwise the result will be expressed in local system time.
     */
    static datePart(value: Date, utcTime?: boolean) {
        if (value == null) throw new ArgumentNullException("value");
        return utcTime ?
            new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate(), 0, 0, 0, 0))
            : new Date(value.getFullYear(), value.getMonth(), value.getDate(), 0, 0, 0, 0);
    }

    static applyTime(timeSource: Date, target: Date): Date {
        if (timeSource == null) throw new ArgumentNullException("timeSource");
        if (target == null) throw new ArgumentNullException("target");
        target.setMilliseconds(timeSource.getMilliseconds());
        target.setSeconds(timeSource.getSeconds());
        target.setMinutes(timeSource.getMinutes());
        target.setHours(timeSource.getHours());
        return target;
    }

    static setTime(target: Date, hours?: number, minutes?: number, seconds?: number, milliseconds?: number) {
        if (target == null) throw new ArgumentNullException("target");
        target.setMilliseconds(milliseconds ? milliseconds : 0);
        target.setSeconds(seconds ? seconds : 0);
        target.setMinutes(minutes ? minutes : 0);
        target.setHours(hours ? hours : 0);
    }

    static resolveMilliseconds(value: number | Date | Timespan): number {
        if (value == null) throw new ArgumentNullException("value");

        if (typeof (value) == "number")
            return Math.trunc(value);

        let result: number = null;

        if (typeof ((<any>value).getTime) == "function")
            result = (<Date>value).getTime();
        else
            result = (<Timespan>value).totalMilliseconds;

        if (typeof (result) != "number")
            throw new ArgumentException("value")

        return Math.trunc(result);
    }

    static isLeapYear(value: number | Date) {
        if (value == null) throw new ArgumentNullException("value");
        if (typeof (value) == "number")
            value = Math.trunc(value);
        else if (typeof ((<any>value).getFullYear) == "function")
            value = value.getFullYear();

        if (<any>value % 4 != 0) return false;
        if (<any>value % 100 != 0) return true;

        return (<any>value % 400 == 0);
    }

    static lastDayOfMonth(date: Date): number {
        if (date == null) throw new ArgumentNullException("date");

        switch (date.getMonth()) {
            case 3:
            case 5:
            case 8:
            case 10:
                return 30;
            case 1:
                return DateHelper.isLeapYear(date.getFullYear()) ? 29 : 28;
        }

        return 31;
    }
}
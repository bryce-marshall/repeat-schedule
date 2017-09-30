import { Repeat } from "./repeat";
import { ArgumentNullException, ArgumentOutOfRangeException } from "@brycemarshall/exception";
import { ArgumentValidator } from "./argument-validator";
import { DateHelper } from "./date-helper";

/**
 * A Repeat for an event that occurs at the same time of day on a specified calendar day of the month, at intervals of a specified number of months.
 * If the specified calendar day is greater than the last calendar day of the event month, then the last day of that month is used.
 * 
 * Remarks:
 * 
 * Specify a calendar date of 32 to ensure that the event always occurs on the last day of the event month.
 */
export class MonthRepeat extends Repeat {

    constructor(public readonly date: number, public readonly interval?: number) {
        super();
        if (date == null) throw new ArgumentNullException("date");
        ArgumentValidator.validateInteger("date", date);
        if (date < 1 || date > 32)
            throw new ArgumentOutOfRangeException("date", 1, 32);

        if (this.interval == null)
            this.interval = 1;
        else {
            ArgumentValidator.validateInteger("interval", interval);
            if (interval < 1)
                throw new ArgumentOutOfRangeException("interval", 1);
        }
    }

    /**
     * Returns the time of the next scheduled event occurring AFTER evalDate, or null if no future events are scheduled.
     * @param start The start time (and absolute lower bound) of the schedule as it applies to the sequence to be derived. 
     * @param evalTime The time after which to evaluate the next event in the schedule, or null to return the first event in the schedule occurring at or following start.
     */
    nextEvent(start: Date, evalTime: Date): Date {
        if (start == null) throw new ArgumentNullException("start");
        let result: Date;
        if (evalTime == null || evalTime < start)
            result = DateHelper.clone(start);
        else {
            let mths = (evalTime.getFullYear() - start.getFullYear()) * 12 + evalTime.getMonth() - start.getMonth();
            result = DateHelper.clone(evalTime);
            result.setDate(1);
            result.setMonth(result.getMonth() + mths % this.interval + this.interval)
        }

        result.setDate(Math.min(this.date, DateHelper.lastDayOfMonth(result)));
        return result;
    }
}
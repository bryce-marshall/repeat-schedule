import { Repeat } from "./repeat";
import { ArgumentException, ArgumentOutOfRangeException, ArgumentNullException } from "@brycemarshall/exception";
import { DateHelper } from "./date-helper";
import { trunc, validateInteger } from "./functions";

/**
 * A Repeat for an event that occurs at the same time of the same calendar day at intervals of a specified number of years.
 */
export class YearRepeat extends Repeat {

    constructor(public interval?: number) {
        super();

        if (this.interval == null)
            this.interval = 1;
        else {
            validateInteger("interval", interval);
            if (interval < 1)
                throw new ArgumentOutOfRangeException("interval", 1);
        }
    }

    /**
     * Returns the time of the next scheduled event occurring AFTER evalDate, or null if no future events are scheduled.
     * 
     * Remarks:
     * 
     * If startDate specifies February 29 on a leap year, then the event will occur on February 29 for all subsequent years that are leap years, 
     * and on February 28 for all subsequent years that are not.
     * @param start The start time (and absolute lower bound) of the schedule as it applies to the sequence to be derived. 
     * @param evalTime The time after which to evaluate the next event in the schedule, or null to return the first event in the schedule occurring at or following start.
     */
    nextEvent(start: Date, evalTime: Date): Date {
        if (start == null) throw new ArgumentNullException("start");
        if (evalTime == null || evalTime < start)
            return DateHelper.clone(start);

        let result = DateHelper.clone(start);
        result.setDate(1);
        result.setFullYear(evalTime.getFullYear() + this.interval - trunc((evalTime.getFullYear() - start.getFullYear())) % this.interval);
        result.setDate(Math.min(start.getDate(), DateHelper.lastDayOfMonth(result)));

        return result;
    }
}
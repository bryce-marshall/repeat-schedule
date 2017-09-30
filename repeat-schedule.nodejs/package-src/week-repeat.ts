import { Repeat } from "./repeat";
import { ArgumentNullException, ArgumentOutOfRangeException } from "@brycemarshall/exception";
import { ArgumentValidator } from "./argument-validator";
import { DateHelper } from "./date-helper";

/**
 * A Repeat for an event that occurs at the same time of day at intervals of a specified number of weeks.  
 */
export class WeekRepeat extends Repeat {

    constructor(public readonly interval?: number) {
        super();
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
        if (evalTime == null || evalTime < start)
            return DateHelper.clone(start);

        let intv = this.interval * 7;
        let result = DateHelper.clone(evalTime);
        result.setDate(evalTime.getDate() + intv - Math.floor((evalTime.getTime() - start.getTime()) / 86400000) % intv);

        return result;
    }
}
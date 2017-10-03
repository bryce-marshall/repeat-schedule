import { ArgumentNullException, ArgumentOutOfRangeException } from "@brycemarshall/exception";
import { Timespan } from "@brycemarshall/timespan";
import { Repeat } from "./repeat";
import { validateInteger } from "./functions";

/**
 * A Repeat for an event that occurs at a specified time interval.
 */
export class TimeRepeat extends Repeat {
    private _ms: number;

    constructor(interval: Timespan | number) {
        if (interval == null) throw new ArgumentNullException("interval");
        if (typeof (interval) == "number")
            validateInteger("interval", interval);
        else
            interval = (<Timespan>interval).totalMilliseconds;

        if (!interval || interval <= 0)
            throw new ArgumentOutOfRangeException("interval");

        super();
        this._ms = interval;
    }

    /**
     * Returns an integer representing the repeat interval in milliseconds.
     */
    get interval(): number {
        return this._ms;
    }

    /**
     * Returns the time of the next scheduled event occurring AFTER evalDate, or null if no future events are scheduled.
     * @param start The start time (and absolute lower bound) of the schedule as it applies to the sequence to be derived. 
     * @param evalTime The time after which to evaluate the next event in the schedule, or null to return the first event in the schedule occurring at or following start.
     */
    nextEvent(start: Date, evalTime: Date): Date {
        if (start == null) throw new ArgumentNullException("start");
        if (evalTime == null || evalTime < start)
            return start;

        let ems = evalTime.getTime();
        return new Date(ems - ((ems - start.getTime()) % this._ms) + this._ms);
    }
}
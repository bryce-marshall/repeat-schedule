import { Repeat } from "./repeat";
import { DayOfWeek } from "./enums";
import { ArgumentNullException, ArgumentException } from "@brycemarshall/exception";
import { DateHelper } from "./date-helper";

/**
 * A Repeat for an event that occurs at the same time on the specified weekday(s).
 */
export class DayRepeat extends Repeat {
    constructor(public readonly days: DayOfWeek) {
        super();
        if (days == null) throw new ArgumentNullException("days");
        if (days < 0 || days > DayOfWeek.All) throw new ArgumentException("days")
    }

    /**
     * Returns the time of the next scheduled event occurring AFTER evalDate, or null if no future events are scheduled.
     * @param start The start time (and absolute lower bound) of the schedule as it applies to the sequence to be derived. 
     * @param evalTime The time after which to evaluate the next event in the schedule, or null to return the first event in the schedule occurring at or following start.
     */
    nextEvent(start: Date, evalTime: Date): Date {
        if (start == null) throw new ArgumentNullException("start");
        if (this.days == DayOfWeek.None) return null;

        if (evalTime == null || evalTime < start)
            evalTime = DateHelper.clone(start);
        else {
            let w = DateHelper.applyTime(start, DateHelper.clone(evalTime));
            if (w >= evalTime)
                w.setDate(w.getDate() + 1);

            evalTime = w;
        };

        if (this.days == DayOfWeek.All) return evalTime;

        let count = 0;
        while (true) {
            if (((1 << evalTime.getDay()) & this.days) != 0)
                break;

            evalTime.setDate(evalTime.getDate() + 1);
            count++;
        }

        return evalTime;
    }
}
import { Repeat } from "./repeat";
import { DayOfWeek, OrdinalDayOfMonth } from "./enums";
import { ArgumentNullException, ArgumentOutOfRangeException } from "@brycemarshall/exception";
import { DateHelper } from "./date-helper";
import { Timespan } from "@brycemarshall/timespan";
import { stringFormat } from "@brycemarshall/string-format";

/**
 * A Repeat for an event that occurs on the specified ordinal instance(s) of the specified weekday(s) within each calendar month.
 * 
 * (examples: First Monday of each month; Last Friday of each month; First and Third Wednesday of each month; Second Tuesday and Thursday of each month).
 */
export class DayOfMonthRepeat extends Repeat {
    constructor(public readonly days: DayOfWeek, public readonly instances: OrdinalDayOfMonth) {
        super();
        if (days == null) throw new ArgumentNullException("days");
        if (instances == null) throw new ArgumentNullException("weeks");
        if (days < 0 || days > DayOfWeek.All) throw new ArgumentOutOfRangeException("days", "DayOfWeek.None", "DayOfWeek.All")
        if (instances < 0 || instances > OrdinalDayOfMonth.All) throw new ArgumentOutOfRangeException("weeks", "OrdinalDayOfMonth.None", "OrdinalDayOfMonth.All")
    }

    /**
     * Returns the time of the next scheduled event occurring AFTER evalDate, or null if no future events are scheduled.
     * @param start The start time (and absolute lower bound) of the schedule as it applies to the sequence to be derived. 
     * @param evalTime The time after which to evaluate the next event in the schedule, or null to return the first event in the schedule occurring at or following start.
     */
    nextEvent(start: Date, evalTime: Date): Date {
        if (start == null) throw new ArgumentNullException("start");
        if (this.days == DayOfWeek.None || this.instances == OrdinalDayOfMonth.None) return null;

        if (evalTime == null || evalTime < start)
            evalTime = new Date(start.getFullYear(), start.getMonth(), 1);
        else if (Timespan.timeComponent(evalTime) >= Timespan.timeComponent(start)) {
            evalTime = DateHelper.datePart(evalTime);
            evalTime.setDate(evalTime.getDate() + 1);
        }

        // Prime the loop for the initial evalTime
        let d = evalTime.getDate();
        let mask = this.getDayMask(evalTime);
        let mask1 = mask >> ((d - 1) % 7);
        let ldm = DateHelper.lastDayOfMonth(evalTime);
        let wend = Math.ceil(d / 7);
        let wk: OrdinalDayOfMonth = Math.pow(2, wend - 1);
        wend = Math.min(wend * 7, ldm);
        if (wend == ldm)
            wk |= OrdinalDayOfMonth.Last;

        do {
            while (wk) { // Week iteration
                if (this.instances & wk) {
                    while (mask1 && d <= ldm) { // Day iteration
                        if (mask1 & 1) {
                            evalTime.setDate(d);
                            DateHelper.applyTime(start, evalTime);
                            return evalTime;
                        }
                        d++;
                        mask1 >>= 1;
                    }
                }
                d = wend + 1;
                if (d <= ldm) {
                    mask1 = mask;
                    wend = Math.min(wend + 7, ldm);
                    wk <<= 1;
                    if (wend == ldm)
                        wk |= OrdinalDayOfMonth.Last; // This is the last logical week of the month, so ensure the mask bit is set.
                }
                else
                    wk = OrdinalDayOfMonth.None; // Exit condition for week iteration
            }
            evalTime.setDate(1);
            evalTime.setMonth(evalTime.getMonth() + 1);
            mask1 = mask = this.getDayMask(evalTime);
            wk = OrdinalDayOfMonth.First;
            d = 1;
            wend = 7;
            ldm = DateHelper.lastDayOfMonth(evalTime);
        } while (true); // Month iteration
    }

    private getDayMask(date: Date): number {
        let d: number;
        if (date.getDate() == 1)
            d = date.getDay();
        else
            d = new Date(date.getFullYear(), date.getMonth(), 1).getDay();

        if (d == 0)
            return this.days;

        // Rotate the default mask by the number of bits that the first day of the current month is offset from the default first day of the week (Sunday).
        return (this.days >> d | this.days << 7 - d) & DayOfWeek.All;
    }
}

import { Repeat } from "./repeat";

/**
 * A Repeat for an event that occurs only once.
 */
export class NoRepeat extends Repeat {
    /**
     * Returns start if evalTime is null or less than start, otherwise returns null.
     * @param start The time of the scheduled event.
     * @param evalTime The time of the elapsed event, or null if the event has not yet occurred.
     */    
    nextEvent(start: Date, evalTime: Date): Date {        
        if (evalTime == null || start > evalTime) return start;
        return null;
    }
}

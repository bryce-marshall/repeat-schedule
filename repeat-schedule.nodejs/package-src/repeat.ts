
export interface Sequencer {
    // TODO: Define prevEvent method? May be required by Cycle instances in order to derive upper and lower bounds
    nextEvent(start: Date, evalTime: Date): Date;
}

/**
 * The base class for types that derive a sequence of event times based upon a start time and sequencing rules.
 */
export abstract class Repeat implements Sequencer {
    /**
     * Returns the time of the next scheduled event occurring AFTER evalDate, or null if no future events are scheduled.
     * @param start The start time (and absolute lower bound) of the schedule as it applies to the sequence to be derived. 
     * @param evalTime The time after which to evaluate the next event in the schedule, or null to return the first event in the schedule occurring at or following start.
     */
    abstract nextEvent(start: Date, evalTime: Date): Date;
}

/**
 * Describes a cycle which defines recurring bounds from which sequenced events may be derived.
 * A Cycle instance uses a bondary sequencer to determine the start and duration of a cycle.
 * 
 * The bounds of a Cycle, C, are: C(n) >= C(n).startTime < C(n + 1).startTime.
 * 
 * Remarks:
 * 
 * It is important to recognise that, from an implementation perspective, the sequences of a cycle are not required to be unform in duration.
 * There is no interval between cycles. Cycle(n) ends immediately at the bondary of Cycle(n + 1).
 */
export class Cycle implements Sequencer {
    nextEvent(start: Date, evalTime: Date): Date {
        throw new Error("Not implemented");
        // TODO: Derive the start and end times of the sequence
    }
}


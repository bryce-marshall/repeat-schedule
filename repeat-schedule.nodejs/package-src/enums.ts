// /**
//  * Represents the days in a seven-day calendar week.
//  */
// export enum Weekday {
//     Unspecified = 0,
//     Monday,
//     Tuesday,
//     Wednesday,
//     Thursday,
//     Friday,
//     Saturday,
//     Sunday
// }

/**
 * Represents a set of the days of a seven-day calendar week.
 */
export enum DayOfWeek {
    None = 0,
    Sunday = 1,
    Monday = 2,
    Tuesday = 4,
    Wednesday = 8,
    Thursday = 16,
    Friday = 32,
    Saturday = 64,
    All = Sunday | Monday | Tuesday | Wednesday | Thursday | Friday | Saturday
}

/**
 * Represents a set of the ordinal positions of a weekday relative to the number of times it occurs within a given calendar month.
 */
export enum OrdinalDayOfMonth {
    None = 0,
    First = 1,
    Second = 2,
    Third = 4,
    Fourth = 8,
    Last = 16,
    All = First | Second | Third | Fourth | Last
}

// /**
//  * Represents the event repeat frequency implemented by a RepeatSchedule.
//  */
// export enum RepeatFrequency {
//     /**
//      * No repeat frequency is specified.
//      */
//     Unspecified = 0,
//     /**
//      * The event occurs only once.
//      */
//     None,
//     /**
//      * The event repeats at intervals of a specified time.
//      */
//     Time,
//     /**
//      * The event repeats on the specified day/s of the week.
//      */
//     Day,
//     /**
//      * The event repeats at intervals of a specified number of weeks.  
//      */
//     Week,
//     /**
//      * The event repeats on the specified calendar day of the month. If the specified calendar day is greater than the last calendar day of a given month, then the last day of that month is used.
//      */
//     Month,
//     /**
//      * The event repeats on the ordinal specified weekday of each month (example First, Second, Third, Fourth, or Last Monday of the month).
//      */
//     DayOfMonth,
//     /**
//      * The event repeats on the specified calendar date at intervals of a specified number of years. 
//      * ?? How to deal with Feb 29? Optional Last day of Month (calendar date 32)?
//      */
//     Year,
// }
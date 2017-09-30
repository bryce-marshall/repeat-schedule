import { suite, test, timeout } from "mocha-typescript";
import { expect } from "chai";

import { stringFormat } from "@brycemarshall/string-format";
import { DayOfMonthRepeat } from "./package-src/day-of-month-repeat";
import { DayOfWeek, OrdinalDayOfMonth } from "./package-src/enums";
import { DateHelper } from "./package-src/date-helper";

@suite class DayOfMonthRepeatTests {
    @test("First Day Offset") firstDayOffset() {
        this.test(
            new DayOfMonthRepeat(DayOfWeek.Friday, OrdinalDayOfMonth.First),
            new Date(2017, 8, 1),
            null,
            [
                new Date(2017, 8, 1),
                new Date(2017, 9, 6),
                new Date(2017, 10, 3),
                new Date(2017, 11, 1),
                new Date(2018, 0, 5),
                new Date(2018, 1, 2),
                new Date(2018, 2, 2),
                new Date(2018, 3, 6),
                new Date(2018, 4, 4),
                new Date(2018, 5, 1),
                new Date(2018, 6, 6),
                new Date(2018, 7, 3),
                new Date(2018, 8, 7),
                new Date(2018, 9, 5),
                new Date(2018, 10, 2),
                new Date(2018, 11, 7),
            ]
        );
    }

    @timeout(10000)
    @test("100 Years All Days All Instances") allDaysAllInst100Y() {
        LinearTester.years250(DayOfWeek.All, OrdinalDayOfMonth.All);
    }

    @timeout(10000)
    @test("100 Years All Days First Instance") allDaysFirstInst100Y() {
        LinearTester.years250(DayOfWeek.All, OrdinalDayOfMonth.First);
    }

    @timeout(10000)
    @test("100 Years All Days Second Instance") allDaysSecondInst100Y() {
        LinearTester.years250(DayOfWeek.All, OrdinalDayOfMonth.Second);
    }

    @timeout(10000)
    @test("100 Years All Days Third Instance") allDaysThirdInst100Y() {
        LinearTester.years250(DayOfWeek.All, OrdinalDayOfMonth.Third);
    }

    @timeout(10000)
    @test("100 Years All Days Fourth Instance") allDaysFourthInst100Y() {
        LinearTester.years250(DayOfWeek.All, OrdinalDayOfMonth.Fourth);
    }

    @timeout(10000)
    @test("100 Years All Days Last Instance") allDaysLastInst100Y() {
        LinearTester.years250(DayOfWeek.All, OrdinalDayOfMonth.Last);
    }

    test(r: DayOfMonthRepeat, start: Date, evalTime: Date, expected: Date[]) {
        let count = 0;
        while (count < expected.length) {
            evalTime = r.nextEvent(start, evalTime);
            expect(evalTime.getTime()).to.equal(expected[count].getTime(), stringFormat("iteration {0} - expected {1}, actual {2}", count, expected[count], evalTime));
            count++;
        }
    }
}

class LinearTester {
    private _dayMatrix: boolean[];
    private _date: Date;
    private _ldm: number;
    private _r: DayOfMonthRepeat;

    constructor(days: DayOfWeek, instances: OrdinalDayOfMonth, date: Date, private totalMonths: number) {
        this._dayMatrix = new Array<boolean>(7);
        this._date = DateHelper.clone(date);
        this._r = new DayOfMonthRepeat(days, instances);
    }

    static years100(days: DayOfWeek, instances: OrdinalDayOfMonth) {
        LinearTester.createYears(days, instances, new Date(1970, 1, 1), 100).execute();
    }

    static years250(days: DayOfWeek, instances: OrdinalDayOfMonth) {
        LinearTester.createYears(days, instances, new Date(1970, 1, 1), 250).execute();
    }

    static createYears(days: DayOfWeek, instances: OrdinalDayOfMonth, date: Date, totalYears: number): LinearTester {
        return new LinearTester(days, instances, date, totalYears * 12);
    }

    execute() {
        let m = this.totalMonths;
        let evalTime: Date = null;
        while (m > 0) {
            let expected: Date[] = [];
            this.initMonth();
            let d = 1;
            let wend = 7;

            let wk = OrdinalDayOfMonth.First;
            while (wk) {
                if (this._r.instances & wk) {
                    while (d <= wend) {
                        if (this._dayMatrix[(7 + d - 1) % 7]) {
                            let dr = DateHelper.clone(this._date);
                            dr.setDate(d);
                            expected.push(dr);
                        }
                        d++;
                    }
                }

                d = wend + 1;
                if (d <= this._ldm) {
                    wend = Math.min(wend + 7, this._ldm);
                    wk <<= 1;
                    if (wend == this._ldm)
                        wk |= OrdinalDayOfMonth.Last; // This is the last logical week of the month, so ensure the mask bit is set.
                }
                else
                    wk = OrdinalDayOfMonth.None;
            }

            evalTime = this.testMonth(evalTime, expected);
            this._date.setMonth(this._date.getMonth() + 1);
            m--;
        }
    }

    private testMonth(evalTime: Date, expected: Date[]): Date {
        if (expected == null || expected.length == 0) return evalTime;

        let count = 0;
        while (count < expected.length) {
            // console.log("*** Expected = " + expected[count]);
            evalTime = this._r.nextEvent(this._date, evalTime);
            expect(evalTime.getTime()).to.equal(expected[count].getTime(), stringFormat("iteration {0} - expected {1}, actual {2}", count, expected[count], evalTime));
            count++;
        }
    }

    private initMonth() {
        this._date.setDate(1);
        this._ldm = DateHelper.lastDayOfMonth(this._date);
        let d = this._date.getDay();

        for (let i = 0; i < 7; i++) {
            // console.log(stringFormat("(i - d) % 7 = ({0} - {1}) % 7 = {2}", i, d, (7 + i - d) % 7));
            this._dayMatrix[(7 + i - d) % 7] = (this._r.days & Math.pow(2, i)) != 0;
        }

        // console.log(this._dayMatrix);
    }
}
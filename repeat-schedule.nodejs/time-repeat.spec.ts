import { suite, test } from "mocha-typescript";
import { expect } from "chai";

import { stringFormat } from "@brycemarshall/string-format";
import { Timespan } from "./package-src/index";
import { TimeRepeat } from "./package-src/time-repeat";
import { DateHelper } from "./package-src/date-helper";

@suite class TimeRepeatTests {
    @test("24-hour Interval") test24h() {
        let start = this.createDay(2017, 9, 1);
        let last = this.cycle(start, start, Timespan.fromHours(24), 8);
        expect(last.getTime()).to.equal(this.createDay(2017, 9, 8).getTime(), "last event");
    }

    @test("1-week Interval") test1w() {
        let start = this.createDay(2017, 9, 1);
        let last = this.cycle(start, start, Timespan.fromWeeks(1), 5);
        expect(last.getTime()).to.equal(this.createDay(2017, 9, 29).getTime(), "last event");
    }

    cycle(start: Date, expectedFirst: Date, interval: Timespan, count: number, evalTime?: Date): Date {
        start = DateHelper.clone(start);
        expectedFirst = DateHelper.clone(expectedFirst);

        let r = new TimeRepeat(interval);
        let n = r.nextEvent(start, evalTime);
        expect(n.getTime()).to.equal(expectedFirst.getTime(), "expectedFirst");
        let step = 1;

        while (step++ < count) {
            n = r.nextEvent(start, n);
            expect(n.getTime()).to.equal(start.getTime() + (interval.totalMilliseconds * (step - 1)), stringFormat("nextEvent iteration {0}", step));
        }

        return n;
    }

    createDay(year: number, month: number, day: number): Date {
        return new Date(year, month, day, 0, 0, 0, 0);
    }
}
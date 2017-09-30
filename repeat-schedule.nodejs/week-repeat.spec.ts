import { suite, test } from "mocha-typescript";
import { expect } from "chai";

import { stringFormat } from "@brycemarshall/string-format";
import { WeekRepeat } from "./package-src/week-repeat";

@suite class WeekRepeatTests {
    @test("Jan 1 1 week interval Default") jan1int1Default() {
        this.test(
            new WeekRepeat(1),
            new Date(2017, 0, 1),
            null,
            [
                new Date(2017, 0, 1),
                new Date(2017, 0, 8),
                new Date(2017, 0, 15),
                new Date(2017, 0, 22),
                new Date(2017, 0, 29),
                new Date(2017, 1, 5),
            ]
        );
    }

    @test("Jan 1 2 week interval Default") jan1int2Default() {
        this.test(
            new WeekRepeat(2),
            new Date(2017, 0, 1),
            null,
            [
                new Date(2017, 0, 1),
                new Date(2017, 0, 15),
                new Date(2017, 0, 29),
                new Date(2017, 1, 12),
                new Date(2017, 1, 26),
            ]
        );
    }

    @test("Jan 1 2 week interval Offset Start") jan1int2Offset() {
        this.test(
            new WeekRepeat(2),
            new Date(2017, 0, 1),
            new Date(2017, 0, 18),
            [
                new Date(2017, 0, 29),
                new Date(2017, 1, 12),
                new Date(2017, 1, 26),
            ]
        );
    }

    @test("Jan 1 9 week interval Offset Start") jan1int9Offset() {
        this.test(
            new WeekRepeat(9),
            new Date(2017, 0, 1),
            new Date(2017, 1, 24),
            [
                new Date(2017, 2, 5),
                new Date(2017, 4, 7),
                new Date(2017,6, 9),
            ]
        );
    }    

    test(r: WeekRepeat, start: Date, evalTime: Date, expected: Date[]) {
        let count = 0;
        while (count < expected.length) {
            evalTime = r.nextEvent(start, evalTime);
            expect(evalTime.getTime()).to.equal(expected[count].getTime(), stringFormat("iteration {0} - expected {1}, actual {2}", count, expected[count], evalTime));
            count++;
        }
    }
}
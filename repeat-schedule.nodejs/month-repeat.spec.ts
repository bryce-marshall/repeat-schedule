import { suite, test } from "mocha-typescript";
import { expect } from "chai";

import { stringFormat } from "@brycemarshall/string-format";
import { MonthRepeat } from "./package-src/month-repeat";

@suite class MonthRepeatTests {
    @test("Jan 1 1 month interval Default") jan1int1Default() {
        this.test(
            new MonthRepeat(1),
            new Date(2017, 0, 1),
            null,
            [
                new Date(2017, 0, 1),
                new Date(2017, 1, 1),
                new Date(2017, 2, 1),
                new Date(2017, 3, 1),
                new Date(2017, 4, 1),
            ]
        );
    }

    @test("Jan 1 1 month interval Offset") jan1int1Offset() {
        this.test(
            new MonthRepeat(1),
            new Date(2017, 0, 1),
            new Date(2017, 0, 21),
            [
                new Date(2017, 1, 1),
                new Date(2017, 2, 1),
                new Date(2017, 3, 1),
                new Date(2017, 4, 1),
            ]
        );
    }

    @test("Jan 1 3 month interval Default") jan1int3Default() {
        this.test(
            new MonthRepeat(1, 3),
            new Date(2017, 0, 1),
            null,
            [
                new Date(2017, 0, 1),
                new Date(2017, 3, 1),
                new Date(2017, 6, 1),
                new Date(2017, 9, 1),
                new Date(2018, 0, 1),
            ]
        );
    }

    @test("Jan 1 1 month interval Last Day of Month Default") jan1int1LastDayDefault() {
        this.test(
            new MonthRepeat(32),
            new Date(2017, 0, 1),
            null,
            [
                new Date(2017, 0, 31),
                new Date(2017, 1, 28),
                new Date(2017, 2, 31),
                new Date(2017, 3, 30),
                new Date(2017, 4, 31),
                new Date(2017, 5, 30),
                new Date(2017, 6, 31),
                new Date(2017, 7, 31),
                new Date(2017, 8, 30),
                new Date(2017, 9, 31),
                new Date(2017, 10, 30),
                new Date(2017, 11, 31),
            ]
        );
    }

    test(r: MonthRepeat, start: Date, evalTime: Date, expected: Date[]) {
        let count = 0;
        while (count < expected.length) {
            evalTime = r.nextEvent(start, evalTime);
            expect(evalTime.getTime()).to.equal(expected[count].getTime(), stringFormat("iteration {0} - expected {1}, actual {2}", count, expected[count], evalTime));
            count++;
        }
    }
}
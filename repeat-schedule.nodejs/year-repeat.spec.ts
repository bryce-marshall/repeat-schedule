import { suite, test } from "mocha-typescript";
import { expect } from "chai";

import { stringFormat } from "@brycemarshall/string-format";
import { YearRepeat } from "./package-src/year-repeat";

@suite class YearRepeatTests {
    @test("Jan 1 1 Year interval Default") jan1int1Default() {
        this.test(
            new YearRepeat(1),
            new Date(2017, 0, 1),
            null,
            [
                new Date(2017, 0, 1),
                new Date(2018, 0, 1),
                new Date(2019, 0, 1),
                new Date(2020, 0, 1),]
        );
    }

    @test("Leap Year Leap Day") leapYearLeapDay() {
        this.test(
            new YearRepeat(1),
            new Date(2012, 1, 29),
            null,
            [
                new Date(2012, 1, 29),
                new Date(2013, 1, 28),
                new Date(2014, 1, 28),
                new Date(2015, 1, 28),
                new Date(2016, 1, 29),
                new Date(2017, 1, 28),
            ]
        );
    }

    test(r: YearRepeat, start: Date, evalTime: Date, expected: Date[]) {
        let count = 0;
        while (count < expected.length) {
            evalTime = r.nextEvent(start, evalTime);
            expect(evalTime.getTime()).to.equal(expected[count].getTime(), stringFormat("iteration {0} - expected {1}, actual {2}", count, expected[count], evalTime));
            count++;
        }
    }
}
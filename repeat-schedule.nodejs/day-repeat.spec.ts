import { suite, test } from "mocha-typescript";
import { expect } from "chai";

import { stringFormat } from "@brycemarshall/string-format";
import { Timespan } from "./package-src/index";
import { DayRepeat } from "./package-src/day-repeat";
import { DateHelper } from "./package-src/date-helper";
import { DayOfWeek } from "./package-src/enums";

@suite class DayRepeatTests {
    @test("Mon midnight") monMidnight() {
        this.test(
            new Date(2017, 8, 1),
            null,
            DayOfWeek.Monday,
            [
                new Date(2017, 8, 4),
                new Date(2017, 8, 11),
                new Date(2017, 8, 18),
                new Date(2017, 8, 25),
                new Date(2017, 9, 2),
            ]
        );
    }

    @test("Mon|Wed midnight") monWedMidnight() {
        this.test(
            new Date(2017, 8, 1),
            null,
            DayOfWeek.Monday | DayOfWeek.Wednesday,
            [
                new Date(2017, 8, 4),
                new Date(2017, 8, 6),
                new Date(2017, 8, 11),
                new Date(2017, 8, 13),
                new Date(2017, 8, 18),
                new Date(2017, 8, 20),
                new Date(2017, 8, 25),
                new Date(2017, 8, 27),
                new Date(2017, 9, 2),
                new Date(2017, 9, 4),
            ]
        );
    }

    // @test("Single Day") testSingle() {
    //     expect(DateHelper.createUTC(2017, 0, 1).getTime()).to.equal(DateHelper.createUTC(2017, 0, 1).getTime(), "My Test");
    //     expect(new Date(2017, 0, 1).getTime()).to.equal(new Date(2017, 0, 1).getTime(), "My Test");
    //     this.test(
    //         DateHelper.createUTC(2017, 11, 1),
    //         null,
    //         DayOfWeek.Monday,
    //         [
    //             DateHelper.createUTC(2017, 11, 4),
    //             DateHelper.createUTC(2017, 11, 11),
    //             DateHelper.createUTC(2017, 11, 18),
    //             DateHelper.createUTC(2017, 11, 25),
    //         ]
    //     );
    // }    

    test(start: Date, evalTime: Date, days: DayOfWeek, expected: Date[]) {
        let r = new DayRepeat(days);
        let count = 0;
        while (count < expected.length) {
            evalTime = r.nextEvent(start, evalTime);
            expect(evalTime.getTime()).to.equal(expected[count].getTime(), stringFormat("iteration {0} - expected {1}, actual {2}", count, expected[count], evalTime));
            count++;
        }
    }
}
"use strict";
const Table = require("cli-table");
const getSumArray = (arr) => {
    return arr.reduce((a, b) => a + b, 0);
};
const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
});
let frame = 0;
let scores = [];
for (let i = 1; i <= 10; i++) {
    scores.push({ frame: i, rolls: [], score: 0 });
}
const generateScore = () => {
    scores.map((frame, index) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        if (index < 9) {
            // strike
            if (frame.rolls[0] === 10) {
                if (index === 8 && ((_a = scores[9]) === null || _a === void 0 ? void 0 : _a.rolls.length) > 1) {
                    // 9h frame
                    frame.score =
                        ((_b = scores[index - 1]) === null || _b === void 0 ? void 0 : _b.score) +
                            10 +
                            getSumArray([scores[9].rolls[0], scores[9].rolls[1]]);
                }
                else if (scores[index + 1].rolls.length === 2 ||
                    (((_c = scores[index + 1]) === null || _c === void 0 ? void 0 : _c.rolls.length) === 1 &&
                        ((_d = scores[index + 2]) === null || _d === void 0 ? void 0 : _d.rolls.length) > 0)) {
                    // next is spare / strike / normal
                    frame.score =
                        (index > 0 ? (_e = scores[index - 1]) === null || _e === void 0 ? void 0 : _e.score : 0) +
                            10 +
                            getSumArray(scores[index + 1].rolls) +
                            (((_f = scores[index + 1]) === null || _f === void 0 ? void 0 : _f.rolls.length) === 1 &&
                                ((_g = scores[index + 2]) === null || _g === void 0 ? void 0 : _g.rolls.length) > 0
                                ? scores[index + 2].rolls[0]
                                : 0);
                }
                // spare
            }
            else if (getSumArray(frame.rolls) === 10 &&
                scores[index + 1].rolls.length === 1) {
                frame.score =
                    (index > 0 ? (_h = scores[index - 1]) === null || _h === void 0 ? void 0 : _h.score : 0) +
                        10 +
                        scores[index + 1].rolls[0];
                // normal
            }
            else if (((_j = frame.rolls) === null || _j === void 0 ? void 0 : _j.length) === 2 && getSumArray(frame.rolls) < 10) {
                frame.score =
                    (index > 0 ? (_k = scores[index - 1]) === null || _k === void 0 ? void 0 : _k.score : 0) + getSumArray(frame.rolls);
            }
            // 10th frame
        }
        else if (index === 9 && (frame === null || frame === void 0 ? void 0 : frame.rolls.length) > 1) {
            frame.score = ((_l = scores[index - 1]) === null || _l === void 0 ? void 0 : _l.score) + getSumArray(frame.rolls);
        }
    });
};
const sortTable = () => {
    generateScore();
    let table = new Table({
        head: ["Frame", "Frame score", "Total score"],
        colWidths: [10, 15, 15],
    });
    scores.forEach((frame) => {
        table.push([
            frame.frame,
            frame.rolls.includes(10)
                ? "X"
                : frame.rolls[0] + frame.rolls[1] === 10
                    ? [frame.rolls[0], "/"]
                    : frame.rolls,
            frame.score,
        ]);
    });
    console.log(table.toString());
};
const recursiveReadLine = () => {
    readline.question("How many pins fell ? ", (firstPins) => {
        scores[frame].rolls.push(parseInt(firstPins));
        sortTable();
        if (parseInt(firstPins) < 10 || (frame === 9 && scores[9].rolls.length < 3))
            readline.question("How many pins fell on roll 2 ? ", (secondPins) => {
                scores[frame].rolls.push(parseInt(secondPins));
                sortTable();
                frame < 9 && (frame = ++frame);
                frame === 9 &&
                    scores[9].rolls.length === 2 &&
                    !scores[9].rolls.includes(10) &&
                    getSumArray(scores[9].rolls) < 10
                    ? readline.close()
                    : recursiveReadLine();
            });
        else
            frame = ++frame;
        if (scores[9].rolls.length === 3)
            readline.close();
        else
            recursiveReadLine();
    });
};
//# sourceMappingURL=index.js.map
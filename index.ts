const Table = require("cli-table");

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

interface ScoresType {
  frame: number;
  rolls: number[];
  score: number;
}

let frame: number = 0;

let scores: ScoresType[] = [];

for (let i = 1; i <= 10; i++) {
  scores.push({ frame: i, rolls: [], score: 0 });
}

const getSumArray = (arr: number[]) => {
  return arr.reduce((a, b) => a + b, 0);
};

const generateScore = (): void => {
  scores.map((frame: ScoresType, index: number) => {
    if (index < 9) {
      // strike
      if (frame.rolls[0] === 10) {
        if (index === 8 && scores[9]?.rolls.length > 1) {
          // 9h frame
          frame.score =
            scores[index - 1]?.score +
            10 +
            getSumArray([scores[9].rolls[0], scores[9].rolls[1]]);
        } else if (
          scores[index + 1].rolls.length === 2 ||
          (scores[index + 1]?.rolls.length === 1 &&
            scores[index + 2]?.rolls.length > 0)
        ) {
          // next is spare / strike / normal
          frame.score =
            (index > 0 ? scores[index - 1]?.score : 0) +
            10 +
            getSumArray(scores[index + 1].rolls) +
            (scores[index + 1]?.rolls.length === 1 &&
            scores[index + 2]?.rolls.length > 0
              ? scores[index + 2].rolls[0]
              : 0);
        }
        // spare
      } else if (
        getSumArray(frame.rolls) === 10 &&
        scores[index + 1].rolls.length === 1
      ) {
        frame.score =
          (index > 0 ? scores[index - 1]?.score : 0) +
          10 +
          scores[index + 1].rolls[0];
        // normal
      } else if (frame.rolls?.length === 2 && getSumArray(frame.rolls) < 10) {
        frame.score =
          (index > 0 ? scores[index - 1]?.score : 0) + getSumArray(frame.rolls);
      }
      // 10th frame
    } else if (index === 9 && frame?.rolls.length > 1) {
      frame.score = scores[index - 1]?.score + getSumArray(frame.rolls);
    }
  });
};

const sortTable = (): void => {
  generateScore();

  let table = new Table({
    head: ["Frame", "Frame score", "Total score"],
    colWidths: [10, 15, 15],
  });

  scores.forEach((frame: ScoresType, index: number) => {
    table.push([
      frame.frame,
      frame.rolls.includes(10)
        ? [
            frame.rolls.map((item: number | string) => {
              return item === 10 ? "X" : item;
            }),
          ]
        : frame.rolls[0] + frame.rolls[1] === 10
        ? [frame.rolls[0], "/"]
        : frame.rolls,
      frame.score,
    ]);
  });

  console.log(table.toString());
};

const recursiveReadLine = (): void => {
  readline.question("How many pins fell ? ", (firstPins: string) => {
    scores[frame].rolls.push(parseInt(firstPins));
    sortTable();

    if (parseInt(firstPins) < 10 || (frame === 9 && scores[9].rolls.length < 3))
      readline.question(
        "How many pins fell on roll 2 ? ",
        (secondPins: string) => {
          scores[frame].rolls.push(parseInt(secondPins));
          sortTable();

          frame < 9 && (frame = ++frame);

          frame === 9 &&
          scores[9].rolls.length === 2 &&
          !scores[9].rolls.includes(10) &&
          getSumArray(scores[9].rolls) < 10
            ? readline.close()
            : recursiveReadLine();
        }
      );
    else frame = ++frame;

    if (scores[9].rolls.length === 3) readline.close();
    else recursiveReadLine();
  });
};

recursiveReadLine();

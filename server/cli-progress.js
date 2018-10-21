function progress({ current, max, message }) {
  const fillChar = "🌕";
  const emptyChar = "🌑";
  const pbLength = 50;
  const filledPt = current / max;
  const filledChars = Math.floor(filledPt * pbLength);
  let progressBar = Array(pbLength)
    .fill(fillChar)
    .fill(emptyChar, filledChars)
    .join("");

  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(
    `${message}: [${progressBar}] | ${current} of ${max} | ${Math.floor(
      filledPt * 100
    )}%`
  );
}

module.exports = { progress };

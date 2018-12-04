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

  consoleRewrite(
    `${message}: [${progressBar}] | ${current} of ${max} | ${Math.floor(
      filledPt * 100
    )}%`
  );
}

function consoleRewrite(message) {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(message);
}

module.exports = { progress, consoleRewrite };

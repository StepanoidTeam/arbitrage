const { PAIRS } = require("../configs/globalPairs");
const { selectFromList } = require("./selectFromList");

(async () => {
  console.log(await selectFromList(["some", "options", "here"]));

  const pair = await selectFromList(
    Object.entries(PAIRS)
      .slice(0, 50)
      .map(([key]) => key)
  );

  console.log("pair is", pair);
})();

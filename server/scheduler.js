function delayer(delay = 1000) {
  return new Promise(resolve => setTimeout(resolve, delay));
}

let errorCount = 0;

async function* scheduler(asyncTask, delay = 1000) {
  while (true) {
    let result = await asyncTask().catch(error => {
      console.warn(error);
      errorCount++;
      return null;
    });

    if (result === null) {
      console.warn("error freeze");
      await delayer(delay * errorCount ** 2);
      continue;
    }

    if (errorCount > 10) {
      console.warn("error limit reached");
      break;
    }

    console.log("shd", Date.now());
    yield result;
    await delayer(delay);
  }
}

module.exports = { scheduler };

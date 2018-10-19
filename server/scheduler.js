function delayer(delay = 1000) {
  return new Promise(resolve => setTimeout(resolve, delay));
}

async function* scheduler(asyncTask, delay = 1000) {
  while (true) {
    let result = await asyncTask();
    console.log("shd", result);
    yield result;
    await delayer(delay);
  }
}

module.exports = { scheduler };

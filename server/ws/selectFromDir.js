const { getDirFiles } = require("../helpers/file");
const { selectFromList } = require("./selectFromList");

async function selectFromDir(path, regex) {
  const files = getDirFiles(path, regex);

  const selectedFile = await selectFromList(files);

  return `${path}/${selectedFile}`;
}

module.exports = { selectFromDir };

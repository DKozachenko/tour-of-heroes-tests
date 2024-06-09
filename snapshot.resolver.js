const path = require("path");

const SNAPSHOT_DIRECTORY = "snapshots";

// https://jestjs.io/ru/docs/configuration#snapshotresolver-string
module.exports = {
  resolveSnapshotPath: (testPath, snapshotExtension) => {
    const filename = path.basename(testPath);
    return (
      testPath.replace(filename, `${SNAPSHOT_DIRECTORY}/${filename}`) +
      snapshotExtension
    );
  },
  resolveTestPath: (snapshotFilePath, snapshotExtension) =>
    snapshotFilePath
      .replace(`${SNAPSHOT_DIRECTORY}/`, "")
      .replace(snapshotExtension, ""),
  testPathForConsistencyCheck: "src/components/app.component.spec.ts",
};

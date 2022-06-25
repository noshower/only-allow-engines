const path = require("path");
const semver = require("semver");
const boxen = require("boxen");

function logAndExit(msg) {
  const boxenOptions = {
    title: "only-allow-engines",
    titleAlignment: "center",
    borderColor: "red",
    borderStyle: "classic",
  };
  console.log(boxen(msg, boxenOptions));
  process.exit(1);
}

function onlyAllowPM(engines) {
  const userAgent = process.env.npm_config_user_agent;
  const [currentPM, currentPMVersion] = userAgent.split(" ")[0].split("/");
  const expectedPMVersion = engines[currentPM];

  if (expectedPMVersion) {
    if (!semver.satisfies(currentPMVersion, expectedPMVersion)) {
      logAndExit(
        `Invalid "${currentPM}" version. Expected ${expectedPMVersion} but got ${currentPMVersion}`
      );
    }
  } else {
    logAndExit(
      `"${currentPM}" is not a valid package manager in this project!`
    );
  }
}

function onlyAllowNode(engines) {
  const expectedNodeVersion = engines.node;
  const currentNodeVersion = process.version;
  if (
    expectedNodeVersion &&
    !semver.satisfies(currentNodeVersion, expectedNodeVersion)
  ) {
    logAndExit(
      `Invalid "node" version. Expected ${expectedNodeVersion} but got ${currentNodeVersion}`
    );
  }
}

function isObject(obj) {
  return obj && typeof obj === "object";
}

function onlyAllowEngines(engines) {
  if (engines !== undefined) {
    if (isObject(engines)) {
      onlyAllowPM(engines);
      onlyAllowNode(engines);
    } else {
      throw new Error(
        `Invalid function argument. Expected object but got ${typeof engines}`
      );
    }
  } else {
    const packageJSONPath = path.resolve(process.cwd(), "package.json");
    try {
      const { engines: enginesFiled } = require(packageJSONPath);
      if (enginesFiled) {
        onlyAllowPM(enginesFiled);
        onlyAllowNode(enginesFiled);
      } else {
        logAndExit(`Please add engines field in your package.json`);
      }
    } catch (e) {
      logAndExit(e.message.split("Require stack")[0].trim());
    }
  }
}

module.exports = onlyAllowEngines;

const path = require('path');
const execSync = require('child_process').execSync;

const chalk = require('chalk');
const Confirm = require('prompt-confirm');
const jsonfile = require('jsonfile');
const semver = require('semver');

const rootDir = path.resolve(__dirname, '..');

function exec(cmd) {
  return execSync(cmd, { env: process.env }).toString();
}

function invariant(cond, message) {
  if (!cond) throw new Error(message);
}

async function getRepoVersion() {
  let packageJson = await jsonfile.readFile(path.join(rootDir, 'package.json'));
  return packageJson.version;
}

function getNextVersion(currentVersion, givenVersion, prereleaseId) {
  invariant(
    givenVersion != null,
    `Missing next version. Usage: node version.js [nextVersion] [prereleaseId]`
  );

  if (/^pre/.test(givenVersion)) {
    invariant(
      prereleaseId != null,
      `Missing prerelease id. Usage: node version.js [nextVersion] [prereleaseId]`
    );
  }

  let nextVersion = semver.inc(currentVersion, givenVersion, prereleaseId);

  invariant(nextVersion != null, `Invalid version specifier: ${givenVersion}`);

  return nextVersion;
}

async function prompt(question) {
  let confirm = new Confirm(question);
  let answer = await confirm.run();
  return answer;
}

async function updatePackageJson(dir, updater) {
  let file = path.join(dir, 'package.json');
  let packageJson = await jsonfile.readFile(file);
  updater(packageJson);
  await jsonfile.writeFile(file, packageJson, { spaces: 2 });
}

async function updateRepoConfig(updater) {
  return await updatePackageJson(rootDir, updater);
}

async function updatePackageConfig(packageName, updater) {
  let packageDir = path.join(rootDir, 'packages', packageName);
  return await updatePackageJson(packageDir, updater);
}

function ensureCleanWorkingDirectory() {
  let status = exec(`git status --porcelain`);
  let lines = status.replace(/\n+$/).split('\n');
  invariant(
    lines.every(line => line.startsWith('?')),
    'Working directory is not clean. Please commit or stash your changes first.'
  );
}

async function run() {
  try {
    let args = process.argv.slice(2);
    let givenVersion = args[0];
    let prereleaseId = args[1];

    // 0. Make sure the working directory is clean
    ensureCleanWorkingDirectory();

    // 1. Get the next version number
    let currentVersion = await getRepoVersion();
    let version;
    if (semver.valid(givenVersion)) {
      version = givenVersion;
    } else {
      version = getNextVersion(currentVersion, givenVersion, prereleaseId);
    }

    // 2. Confirm the next version number
    let answer = await prompt(
      `Are you sure you want to bump version ${currentVersion} to ${version}? [Yn] `
    );

    if (answer === false) return 0;

    // 3. Update repo version
    await updateRepoConfig(config => {
      config.version = version;
    });
    console.log(chalk.green(`  Updated repo to version ${version}`));

    // 4. Update react-router version
    await updatePackageConfig('react-router', config => {
      config.version = version;
    });
    console.log(chalk.green(`  Updated react-router to version ${version}`));

    // 5. Update react-router-dom version + react-router peer dep
    await updatePackageConfig('react-router-dom', config => {
      config.version = version;
      config.peerDependencies['react-router'] = version;
    });
    console.log(
      chalk.green(`  Updated react-router-dom to version ${version}`)
    );

    // 6. Update react-router-native version + react-router peer dep
    await updatePackageConfig('react-router-native', config => {
      config.version = version;
      config.peerDependencies['react-router'] = version;
    });
    console.log(
      chalk.green(`  Updated react-router-native to version ${version}`)
    );

    // 7. Commit and tag
    exec(`git commit --all --message="Version ${version}"`);
    exec(`git tag v${version}`);
    console.log(chalk.green(`  Committed and tagged version ${version}`));
  } catch (error) {
    console.log();
    console.error(chalk.red(`  ${error.message}`));
    console.log();
    return 1;
  }

  return 0;
}

run().then(code => {
  process.exit(code);
});

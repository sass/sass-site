const { spawn: nodeSpawn } = require('node:child_process');
const fs = require('node:fs/promises');

const chalk = require('kleur');

const VERSION_CACHE_PATH = './source/_data/versionCache.json';

// Promise version of `spawn` to avoid blocking the main thread while waiting
// for the child processes
function spawn(cmd, args, options) {
  return new Promise((resolve, reject) => {
    const child = nodeSpawn(cmd, args, options);
    const stderr = [];
    const stdout = [];
    child.stdout.on('data', (data) => {
      stdout.push(data.toString());
    });
    child.on('error', (e) => {
      stderr.push(e.toString());
    });
    child.on('close', () => {
      if (stderr.length) reject(stderr.join(''));
      else resolve(stdout.join(''));
    });
  });
}

// Retrieve the highest stable version of `repo`, based on its git tags
// Store results in `VERSION_CACHE_PATH` for faster future runs
async function getLatestVersion(repo) {
  let versionCache;
  try {
    versionCache = JSON.parse(await fs.readFile(VERSION_CACHE_PATH));
  } catch (err) {
    if (err.code === 'ENOENT') {
      versionCache = {}; // Cache is missing and needs to be created
    } else {
      throw err;
    }
  }
  let latestVersion = versionCache[repo];
  if (latestVersion !== undefined) return latestVersion;

  // eslint-disable-next-line no-console
  console.info(chalk.cyan(`[11ty] Fetching version information for ${repo}`));
  const { parseSemVer, compareSemVer } = await import('semver-parser');
  let stdout;
  try {
    stdout = await spawn(
      'git',
      ['ls-remote', '--tags', '--refs', `https://github.com/${repo}`],
      { env: { ...process.env, GIT_TERMINAL_PROMPT: 0 } },
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(chalk.red(`[11ty] Failed to fetch git tags for ${repo}`));
    throw err;
  }
  const isNotPreRelease = (version) => {
    const parsed = parseSemVer(version);
    return parsed.matches && !parsed.pre;
  };
  latestVersion = stdout
    .split('\n')
    .map((line) => line.split('refs/tags/').at(-1))
    .filter(isNotPreRelease)
    .sort(compareSemVer)
    .at(-1);

  versionCache[repo] = latestVersion;
  await fs.writeFile(VERSION_CACHE_PATH, JSON.stringify(versionCache));
  return latestVersion;
}

function getReleaseUrl(repo, version = null) {
  return `https://github.com/${repo}/releases${
    version ? `/tag/${version}` : ''
  }`;
}

module.exports = async () => {
  const data = {};
  const repos = ['sass/libsass', 'sass/dart-sass', 'sass/migrator'];
  for (const repo of repos) {
    const version = await getLatestVersion(repo);
    const url = getReleaseUrl(repo, version);
    data[repo.replace('sass/', '')] = { version, url };
  }
  return data;
};

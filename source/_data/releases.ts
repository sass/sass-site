import {
  spawn as nodeSpawn,
  SpawnOptionsWithoutStdio,
} from 'node:child_process';
import fs from 'node:fs/promises';

import deepEqual from 'deep-equal';
import kleur from 'kleur';
import { compare, parse } from 'semver';

type VersionCache = Record<string, string>;

const VERSION_CACHE_PATH = './source/_data/versionCache.json';

/**
 * Promise version of `spawn` to avoid blocking the main thread while waiting
 * for the child processes.
 */
const spawn = (
  cmd: string,
  args: string[],
  options: SpawnOptionsWithoutStdio,
) => {
  return new Promise((resolve, reject) => {
    const child = nodeSpawn(cmd, args, options);
    const stderr: string[] = [];
    const stdout: string[] = [];
    child.stdout.on('data', (data: Buffer) => {
      stdout.push(data.toString());
    });
    child.on('error', (e: Error) => {
      stderr.push(e.toString());
    });
    child.on('close', () => {
      if (stderr.length) {
        reject(stderr.join(''));
      } else {
        resolve(stdout.join(''));
      }
    });
  });
};

/**
 * Retrieves cached version object from cache file.
 */
const getCacheFile = async () => {
  let versionCache;
  try {
    const versionFile = await fs.readFile(VERSION_CACHE_PATH);
    versionCache = JSON.parse(versionFile.toString()) as VersionCache;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      versionCache = {}; // Cache is missing and needs to be created
    } else {
      throw err;
    }
  }
  return versionCache;
};

/**
 * Writes version object to cache file.
 */
const writeCacheFile = async (cache: VersionCache) => {
  // eslint-disable-next-line no-console
  console.info(kleur.green(`[11ty] Writing version cache file...`));
  await fs.writeFile(VERSION_CACHE_PATH, JSON.stringify(cache));
};

/**
 * Retrieves the highest stable version of `repo`, based on its git tags.
 */
const getLatestVersion = async (repo: string) => {
  // eslint-disable-next-line no-console
  console.info(kleur.cyan(`[11ty] Fetching version information for ${repo}`));
  let stdout;
  try {
    stdout = (await spawn(
      'git',
      ['ls-remote', '--tags', '--refs', `https://github.com/${repo}`],
      { env: { ...process.env, GIT_TERMINAL_PROMPT: '0' } },
    )) as string;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(kleur.red(`[11ty] Failed to fetch git tags for ${repo}`));
    throw err;
  }
  const isNotPreRelease = (version: string) => {
    const parsed = parse(version);
    return parsed && parsed.prerelease.length === 0;
  };
  const version = stdout
    .split('\n')
    .map((line) => line.split('refs/tags/').at(-1) ?? '')
    .filter(isNotPreRelease)
    .sort(compare)
    .at(-1);

  return version ?? '';
};

/**
 * Returns the version and URL for the latest release of all implementations.
 */
module.exports = async () => {
  const repos = ['sass/libsass', 'sass/dart-sass', 'sass/migrator'];
  const cache = await getCacheFile();

  const versions = await Promise.all(
    repos.map(async (repo) => [
      repo,
      cache[repo] ?? (await getLatestVersion(repo)),
    ]),
  );
  const data = Object.fromEntries(
    versions.map(([repo, version]) => [
      repo.replace('sass/', ''),
      { version, url: `https://github.com/${repo}/releases/tag/${version}` },
    ]),
  );

  const nextCache = Object.fromEntries(versions) as VersionCache;
  if (!deepEqual(cache, nextCache)) {
    await writeCacheFile(nextCache);
  }

  return data;
};

import puppeteer, {Page, WaitForSelectorOptions} from 'puppeteer';
import {ChildProcess, spawn} from 'child_process';

const BASE_URL = 'http://localhost:8080';
const PLAYGROUND_PATH =
  'playground/#eJwzNFQpz0gssVJIzs/PseZySElNKk1XCE4sLlbILFZQrgbLKmgrqCuq1ypYAwBSvg3M';

/**
 * Waits for the server to be ready by polling the `url`. Throws an error if the
 * server doesn't respond before the timeout ends.
 *
 * @param url to check for server readiness.
 * @param options.timeout before canceling the test, in millis.
 * @param options.pollRate between each loading attempt, in millis.
 */
async function waitForServer(
  url: string,
  options = {timeout: 120_000, pollRate: 3_000},
): Promise<void> {
  console.log(`Waiting for ${url}...`);
  const startTime = Date.now();
  do {
    try {
      const response = await fetch(url);
      if (response.ok) {
        console.log('Server is ready!');
        return;
      }
    } catch {
      // Server not up yet, ignore and try again
      const elapsed = Date.now() - startTime;
      console.log(`Server was not ready after ${elapsed}ms, retrying...`);
    }
    await new Promise(resolve => setTimeout(resolve, options.pollRate));
  } while (Date.now() - startTime < options.timeout);
  throw new Error('Timeout waiting for server to start.');
}

/** Starts the dev sever in the background. */
async function startSever(): Promise<ChildProcess> {
  console.log('Starting dev server...');
  return spawn('npm', ['run', 'serve'], {stdio: 'ignore', detached: false});
}

/**
 * Waits for an element matching `selector` to contain `text`.
 *
 * Throws an error if such element is not found. Supports all options of
 * `page.waitForSelector`, but defaults to a visible element and a 3 second
 * timeout.
 */
async function waitForElementWithText(
  page: Page,
  selector: string,
  text: string,
  options: WaitForSelectorOptions = {visible: true, timeout: 3000},
): Promise<void> {
  await page.waitForSelector(selector, options);

  // The callback in the `$$eval` method has a different context and needs to
  // receive the `text` as an argument to the "page function".
  const foundText = await page.$$eval(
    selector,
    (elements, text) => elements.some(el => el.textContent?.includes(text)),
    text,
  );
  if (!foundText)
    throw new Error(
      `Could not find an element "${selector}" containing "${text}"`,
    );
}

/**
 * Loads the playground and makes sure it loads correctly.
 *
 * We just thest that the playground loads the default code and that it has
 * been compiled by looking for the presence of a console line from a `@debug`
 * statement.
 *
 * Loading times out after 10 seconds.
 */
async function checkPlayground(url: string): Promise<void> {
  console.log('Launching headless browser...');
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();

  console.log(`loading ${url}...`);
  await page.goto(url, {waitUntil: 'networkidle0', timeout: 10_000});

  console.log('Checking for playground output...');
  await waitForElementWithText(page, '.console-line', 'Sass is cool!');

  console.log('Closing browser...');
  await browser.close();
}

async function main(): Promise<void> {
  let serverProcess: ChildProcess | undefined;
  try {
    serverProcess = await startSever();
    await waitForServer(BASE_URL);
    await checkPlayground(`${BASE_URL}/${PLAYGROUND_PATH}`);
  } finally {
    if (serverProcess && !serverProcess?.killed) {
      console.log('Shutting down dev server...');
      serverProcess.kill('SIGKILL');
    }
  }
}

main().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});

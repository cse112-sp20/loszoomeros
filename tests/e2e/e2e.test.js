const puppeteer = require('puppeteer');
const extensionPath = '../../../../../dist';

jest.setTimeout(35000);

describe('UI test', () => {

  var browser, page;

  beforeEach (async () => {
    browser = await puppeteer.launch({
      headless: false,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
      ],
      slowMo: 100
    });
    page = await browser.newPage();
    await page.goto('chrome-extension://fobcbgbgmbpjhhdagnhhpcmdlmplnhnj/popup/popup.html');
  });

  afterEach (async () => {
    await browser.close();
  });

  it('Add a mode', async () => {
    var mode, mode_name;

    // create a mode
    await page.click('a[href="#mode-input"]');
    await page.type('input[id="mode-in-field"]', 'test');
    await page.click('button[href="#mode-input"]');

    // validation
    mode = await page.$('div[class="col my-auto text-left mode-title"]');
    mode_name = await page.evaluate(element => element.textContent, mode);
    mode_name = mode_name.trim();
    expect(mode_name).toBe('test');
  });

  it('Add a site to openlist', async () => {
    var site, site_name;

    // create a mode
    await page.click('a[href="#mode-input"]');
    await page.type('input[id="mode-in-field"]', 'test');
    await page.click('button[href="#mode-input"]');

    // add a site
    await page.click('a[href="#X116xX101xX115xX116x"]');
    await page.click('a[href="#X116xX101xX115xX116xauto"]');
    await page.type('input[placeholder="Enter url..."]', 'stackoverflow.com');
    await page.click('button[href="#X116xX101xX115xX116xauto"]');

    // validation
    site = await page.$('div[class="col my-auto text-left"]');
    site_name = await page.evaluate(element => element.textContent, site);
    site_name = site_name.trim();
    expect(site_name).toBe('stackoverflow.com');
  });

  it('Add a site to blacklist', async () => {
    var site, site_name, input;

    // create a mode
    await page.click('a[href="#mode-input"]');
    await page.type('input[id="mode-in-field"]', 'test');
    await page.click('button[href="#mode-input"]');

    // add a site
    await page.click('a[href="#X116xX101xX115xX116x"]');
    await page.click('a[href="#X116xX101xX115xX116xblock"]');
    input = (await page.$$('input[placeholder="Enter url..."]'))[1];
    await input.type('facebook.com');
    await page.click('button[href="#X116xX101xX115xX116xblock"]');

    // validation
    site = await page.$('div[class="col my-auto text-left"]');
    site_name = await page.evaluate(element => element.textContent, site);
    site_name = site_name.trim();
    expect(site_name).toBe('facebook.com');
  })

  it ('Removing a mode', async () => {

    // create a mode
    await page.click('a[href="#mode-input"]');
    await page.type('input[id="mode-in-field"]', 'test');
    await page.click('button[href="#mode-input"]');

    // delete the mode
    await page.click('div[class="col-1 my-auto"]');

    // validation
    expect(await page.$('div[class="col my-auto text-left mode-title"]')).toBeNull();
  });

  it ('Removing a site from openlist', async () => {

    // create a mode
    await page.click('a[href="#mode-input"]');
    await page.type('input[id="mode-in-field"]', 'test');
    await page.click('button[href="#mode-input"]');

    // add a site
    await page.click('a[href="#X116xX101xX115xX116x"]');
    await page.click('a[href="#X116xX101xX115xX116xauto"]');
    await page.type('input[placeholder="Enter url..."]', 'stackoverflow.com');
    await page.click('button[href="#X116xX101xX115xX116xauto"]');

    // remove the site
    await page.click('a[class="del-site"]');

    // validation
    expect(await page.$('div[class="col my-auto text-left"]')).toBeNull();
  });

  it ('Removing a site from blocklist', async () => {
    var input;

    // create a mode
    await page.click('a[href="#mode-input"]');
    await page.type('input[id="mode-in-field"]', 'test');
    await page.click('button[href="#mode-input"]');

    // add a site
    await page.click('a[href="#X116xX101xX115xX116x"]');
    await page.click('a[href="#X116xX101xX115xX116xblock"]');
    input = (await page.$$('input[placeholder="Enter url..."]'))[1];
    await input.type('facebook.com');
    await page.click('button[href="#X116xX101xX115xX116xblock"]');

    // delete the site
    await page.click('a[class="del-site"]');

    // validation
    expect(await page.$('div[class="col my-auto text-left"]')).toBeNull();
  });

  it ('Toggle mode', async () => {
    var button, toggle;

    // create a mode
    await page.click('a[href="#mode-input"]');
    await page.type('input[id="mode-in-field"]', 'test');
    await page.click('button[href="#mode-input"]');

    // toggle the mode
    await page.click('label[class="my-auto vue-js-switch toggled"]');

    // check value
    button = await page.$('span[class="v-switch-label v-right"]');
    toggle = await page.evaluate(element => element.textContent, button);
    expect(toggle).toBe('off');
  });

  it ('Open a site', async () => {
    var pages, url;

    // create a mode
    await page.click('a[href="#mode-input"]');
    await page.type('input[id="mode-in-field"]', 'test');
    await page.click('button[href="#mode-input"]');

    // add a site
    await page.waitForSelector('a[href="#X116xX101xX115xX116x"]');
    await page.click('a[href="#X116xX101xX115xX116x"]');
    await page.click('a[href="#X116xX101xX115xX116xauto"]');
    await page.type('input[placeholder="Enter url..."]', 'stackoverflow.com');
    await page.click('button[href="#X116xX101xX115xX116xauto"]');

    // power on
    await page.click('a[class="my-auto"]');

    // validation
    pages = await browser.pages();
    url = await pages[2].url();
    expect(url).toBe('https://stackoverflow.com/');
  });

  it ('Block a site', async () => {
    var input, newPage, pages, url;

    // create a mode
    await page.click('a[href="#mode-input"]');
    await page.type('input[id="mode-in-field"]', 'test');
    await page.click('button[href="#mode-input"]');

    // add a site
    await page.click('a[href="#X116xX101xX115xX116x"]');
    await page.click('a[href="#X116xX101xX115xX116xblock"]');
    input = (await page.$$('input[placeholder="Enter url..."]'))[1];
    await input.type('facebook.com');
    await page.click('button[href="#X116xX101xX115xX116xblock"]');

    // open the site
    newPage = await browser.newPage();
    await newPage.goto('https://facebook.com');

    // power on
    await page.bringToFront();
    await page.click('a[class="my-auto"]');

    // reload the page
    await newPage.bringToFront();
    try {
      await newPage.reload();
    } catch(e) {}

    // validation
    pages = await browser.pages();
    for (var i = 0; i < pages.length; i++) {
      url = await pages[i].url();
      expect(url).not.toBe('https://www.facebook.com/');
    }   
  });
});
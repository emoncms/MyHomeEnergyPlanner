# Group module tests
We run the tests using Jasmine (testing framework for JavaScript), Selenium server (for interactions with browsers) and WebdriverIO (webdriver bindings for JavaScript)
Only the test files are included here. In order to run them locally you need to do the setup below.

## Set up

To install all dependencies
`npm install`

To install selenium stand alone server
`./node_modules/.bin/selenium-standalone install`

To install the webdrivers, download:
 - The [most recent ChromeDriver](https://sites.google.com/a/chromium.org/chromedriver/home)
 - The [most recent GeckoDriver for Firefox] (https://github.com/mozilla/geckodriver/releases)

Include their location in your PATH environment variable (/etc/environment)

## To run the tests
First start the selenium server
`./node_modules/.bin/selenium-standalone start`

Run the tests
`./node_modules/.bin/wdio wdio.conf.js`

Run then tests in headless mode:
`HEADLESS=true ./node_modules/.bin/wdio wdio.conf.js`

Run the test with debug info:
`DEBUG=true ./node_modules/.bin/wdio wdio.conf.js`

By default tests are run in Chrome, to use Firefox:
`BROWSER=firefox ./node_modules/.bin/wdio wdio.conf.js`
# Group module tests
We run the tests using Jasmine (testing framework for JavaScript), Selenium server (for interactions with browsers) and WebdriverIO (webdriver bindings for JavaScript)
Only the test files are included here. In order to run them locally you need to do some basic setup. Follow the instructions in http://webdriver.io/guide.html

## Running the tests locally
We assume you have done the setup in this `tests` directory.

First start selenium server
```java -jar -Dwebdriver.gecko.driver=./geckodriver selenium-server-standalone-3.14.0.jar

Then start the tests 
```./node_modules/.bin/wdio wdio.conf.js


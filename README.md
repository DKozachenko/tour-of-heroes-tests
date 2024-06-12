# tour-of-heroes-tests

[Tutorial Project](https://angular.io/tutorial/tour-of-heroes) from Angular documentation.

The test application uses:
* [Jest](https://jestjs.io/ru/)
* [Playwright](https://playwright.dev/)
* [Cypress](https://www.cypress.io/)

The code in this project is different from the [original](https://stackblitz.com/run?file=src%2Fapp%2Fhero.service.ts).

Here are some changes:

* removing packages for testing using karma, jasmine, protractor, namely:
  * protractor
  * copyfiles
  * karma
  * karma-chrome-launcher
  * karma-coverage
  * karma-jasmine
  * karma-jasmine-html-reporter
  * @types/jasmine
  * jasmine-core
  * jasmine-marbles
  * jasmine-spec-reporter
* adding dependencies for testing using jest and playwright, namely:
  * jest
  * jest-preset-angular
  * @types/jest
  * jest-marbles
  * ts-jest
  * jest-slow-test-reporter
  * jest-junit
  * ts-mockito
  * ng-mocks
* changing **typescript** versions from *~4.9.3* to *~5.3.3* to avoid conflicts between versions of other packages
* restructuring the project, adding [barrel](https://basarat.gitbook.io/typescript/main-1/barrel) files

### Scripts

| Script                                     | Description                                                                                                                |
|--------------------------------------------|----------------------------------------------------------------------------------------------------------------------------|
| npm run start                              | Running the application                                                                                                    |
| npm run start:in:test:e2e:cy               | Running an application for E2E tests on Cypress locally in Docker (with snapshot updates)                                  |
| npm run test:unit:local                    | Running unit tests on JEST locally                                                                                         |
| npm run test:unit:local:us                 | Running unit tests on JEST locally (with snapshot updates)                                                                 |
| npm run test:unit:ci                       | Running unit tests on JEST in CI                                                                                           |
| npm run test:unit:coverage                 | Running unit tests on JEST with a coverage report located in the `coverage` directory                                      |
| npm run test:unit:report                   | Running unit tests on JEST with a report (in **.XML** format) about the results located in the `report` directory          |
| npm run test:e2e:pw:local                  | Running E2E tests on Playwright locally                                                                                    |
| npm run test:e2e:pw:local:docker           | Running E2E tests on Playwright locally in docker                                                                          |
| npm run test:e2e:pw:local:docker:serve     | Running E2e tests on Playwright in UI mode locally in Docker (with the ability to update snapshots)                        |
| npm run test:e2e:pw:ci                     | Running E2E tests on Playwright in CI                                                                                      |
| npm run test:e2e:pw:report                 | Running E2E tests on Playwright with a report (in **.XML** format) about the results located in the `report` directory     |
| npm run test:e2e:cy:local                  | Running E2E tests on Cypress locally                                                                                       |
| npm run test:e2e:cy:local:docker           | Running E2E tests on Cypress locally in docker                                                                             |
| npm run test:e2e:cy:local:docker:run       | Running E2e tests on Cypress locally in docker (with snapshot updates)                                                     |
| npm run test:e2e:cy:ci                     | Running E2E tests on Cypress in CI                                                                                         |
| npm run pretest:e2e:cy:report              | Cleaning directories before running `npm run test:e2e:cy:report`                                                           |
| npm run test:e2e:cy:report                 | Running E2E tests on Cypress with a report (in **.XML** format) about the results located in the `report` directory        |
| npm run posttest:e2e:cy:report             | Generating reports about execution results in different formats after running `npm run test:e2e:cy:report`                 |
| npm run test:e2e:cy:merge:reports          | Combining **.XML** reports into one                                                                                        |
| npm run test:e2e:cy:merge:json:reports     | Combining **.JSON** reports into one                                                                                       |
| npm run test:e2e:cy:generate:html:report   | Creating a **.HTML** report based on a **.JSON** report                                                                    |

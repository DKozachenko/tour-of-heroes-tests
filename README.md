# tour-of-heroes-tests

[Учебный проект](https://angular.io/tutorial/tour-of-heroes) из документации Angular.

В приложении для тестов используются:
* [Jest](https://jestjs.io/ru/)
* [Playwright](https://playwright.dev/)
* [Cypress](https://www.cypress.io/)

Код в этом проекте отличается от [оригинального](https://stackblitz.com/run?file=src%2Fapp%2Fhero.service.ts).

Вот некоторые изменения:

* удаление пакетов для тестирования с помощью karma, jasmine, protractor, а именно:
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
* добавление зависимостей для тестирования с помощью jest и playwright, а именно:
  * jest
  * jest-preset-angular
  * @types/jest
  * jest-marbles
  * ts-jest
  * jest-slow-test-reporter
  * jest-junit
  * ts-mockito
  * ng-mocks
* изменение версий **typescript** c *~4.9.3* на *~5.3.3* во избежание конфликтов версий других пакетов
* реструктурирование проекта, добавление [barrel](https://basarat.gitbook.io/typescript/main-1/barrel) файлов

### Команды

| Команда                                 | Описание                                                                                             |
|-----------------------------------------|------------------------------------------------------------------------------------------------------|
| npm run start                           | Запуск приложения                                                                                    |
| npm run test:unit:local                 | Запуск unit тестов локально                                                                          |
| npm run test:unit:local:us              | Запуск unit тестов локально (с обновлением снепшотов)                                                |
| npm run test:unit:ci                    | Запуск unit тестов в CI                                                                              |
| npm run test:unit:coverage              | Запуск unit тестов с отчетом о покрытии, расположенном в `coverage` директории                       |
| npm run test:unit:report                | Запуск unit тестов с отчетом (в формате **.XML**) о результатах, расположенном в `report` директории |
| npm run test:e2e:local                  | Запуск e2e тестов локально                                                                           |
| npm run test:e2e:local:docker           | Запуск e2e тестов локально в докере                                                                  |
| npm run test:e2e:local:docker:serve     | Запуск Playwright в UI режиме локально в докере (с обновлением снепшотов)                            |
| npm run test:e2e:ci                     | Запуск e2e тестов в CI                                                                               |
| npm run test:e2e:report                 | Запуск e2e тестов с отчетом (в формате **.XML**) о результатах, расположенном в `report` директории  |

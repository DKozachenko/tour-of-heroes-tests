# angular-tutorials-test

Репозиторий с двумя учебными приложениями из документации Angular: [tour of heroes](https://angular.io/tutorial/tour-of-heroes), [first angular app](https://angular.dev/tutorials/first-app).

В приложении [Tour of heroes](./tour-of-heroes/README.md) для тестов используются:
* [Jest](https://jestjs.io/ru/)
* [Playwright](https://playwright.dev/)

В приложении [Rent houses](./rent-houses/README.md) для тестов используются:
* [Jest](https://jestjs.io/ru/)
* [Cypress](https://www.cypress.io/)

## Команды


| Команда                        | Описание                                                                                                                   |
|--------------------------------|----------------------------------------------------------------------------------------------------------------------------|
| npm run start:toh              | Запуск приложения tour-of-heroes                                                                                           |
| npm run test:toh:unit:local    | Запуск unit тестов приложения tour-of-heroes локально                                                                      |
| npm run test:toh:unit:local:us | Запуск unit тестов приложения tour-of-heroes локально (с обновлением снепшотов)                                            |
| npm run test:toh:unit:ci       | Запуск unit тестов приложения tour-of-heroes в CI приложения                                                               |
| npm run test:toh:unit:coverage | Запуск unit тестов приложения tour-of-heroes с отчетом о покрытии, расположенном в `coverage` директории                   |
| npm run test:toh:unit:report   | Запуск unit тестов приложения tour-of-heroes с отчетом (в формате .XML) о результатах, расположенном в `report` директории |

Также команды есть внутри папки каждого приложения отдельно.
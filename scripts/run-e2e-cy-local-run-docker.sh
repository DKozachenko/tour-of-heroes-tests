docker compose -f ./e2e-cypress/docker-compose.local.run.yml build
docker compose -f ./e2e-cypress/docker-compose.local.run.yml up --exit-code-from cypress --abort-on-container-exit
docker compose -f ./e2e-cypress/docker-compose.local.run.yml down

docker compose -f ./e2e-cypress/docker-compose.local.yml build
docker compose -f ./e2e-cypress/docker-compose.local.yml up --exit-code-from cypress --abort-on-container-exit
docker compose -f ./e2e-cypress/docker-compose.local.yml down

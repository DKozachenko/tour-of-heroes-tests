config=$1
config_path="e2e-cypress/cypress.config.$config.ts"
# Running in chrome and firefox
npx cypress run --e2e --browser chrome --config-file="$config_path"
npx cypress run --e2e --browser firefox --config-file="$config_path"


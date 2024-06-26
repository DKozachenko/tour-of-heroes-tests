# Necessary for correct volume creation on Windows
# https://stackoverflow.com/questions/50608301/docker-mounted-volume-adds-c-to-end-of-windows-path-when-translating-from-linux
export MSYS_NO_PATHCONV=1

docker build . -t e2e-local-docker -f ./e2e-playwright/Dockerfile.local
docker run -v $(pwd)/e2e-playwright/snapshots:/app/e2e-playwright/snapshots -v $(pwd)/e2e-playwright/test-output:/app/e2e-playwright/test-output -p 5000:5000 -it e2e-local-docker:latest

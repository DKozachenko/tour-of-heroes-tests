# Нужно для корректного создания volume
# https://stackoverflow.com/questions/50608301/docker-mounted-volume-adds-c-to-end-of-windows-path-when-translating-from-linux
export MSYS_NO_PATHCONV=1

docker build . -t e2e-local-docker -f ./e2e/Dockerfile.local
docker run -v $(pwd)/e2e/snapshots:/app/e2e/snapshots -v $(pwd)/e2e/test-output:/app/e2e/test-output -p 5000:5000 -it e2e-local-docker:latest

container:
    docker build -t penumbra_dapp .
    docker run -p 9012:9012 -it penumbra_dapp

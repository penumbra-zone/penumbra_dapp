container:
    docker build -t penumbra_dapp .
    docker run -p 9012:9012 -it penumbra_dapp

dev-shell:
    docker build -t penumbra_dapp .
    docker run -p 9012:9012 -v $PWD:/usr/src/app -it penumbra_dapp bash

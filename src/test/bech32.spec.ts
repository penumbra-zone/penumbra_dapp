import {fromBase64} from "@cosmjs/encoding";
import {bech32, bech32m} from "bech32";
import {expect, jest, test, describe, it} from '@jest/globals';


describe("penumbraAddress", () => {

    // Most of RPC methods relating to addresses return a base64-encoded string.
    // In order to confirm we can parse an address correctly, we must:
    //
    //   1. Convert a base64 message to an array of uint8s, 80 elements long.
    //   2. Convert the byte arrays to a readable Penumbra string representation.
    //   3. Confirm that the Penumbra string representation matches our expectations.
    //
    const penumbraAddress = "penumbrav2t1hrhrzvnfh8zuzwqh2dxxgayzhzm6k5yxtsqph8j3wjeftjws4xzhhwz9hnl9zjsq992wucaxuzjtqfzq6t69l5apzvt2mrs7m4kygg022f6nkut9fa4ju797w2w3e0yav3m37k";
    const penumbraAddressBase64 = "uO4xMmm5xcE4F1NMZHSCuLerUIZcABueUXSylcnQqYV7uEW8/lFKAClU7mOm4KSwJEDS9F/ToRMWrY4e3WxEIepSdTtxZU9rLni+cp0cvJ0=";
    const penumbraAddressByteArray = fromBase64(penumbraAddressBase64);
    const penumbraAddressLimit = 146;

    const addresses = [
        "penumbrav2t1hrhrzvnfh8zuzwqh2dxxgayzhzm6k5yxtsqph8j3wjeftjws4xzhhwz9hnl9zjsq992wucaxuzjtqfzq6t69l5apzvt2mrs7m4kygg022f6nkut9fa4ju797w2w3e0yav3m37k",
        "penumbrav2t13vh0fkf3qkqjacpm59g23ufea9n5us45e4p5h6hty8vg73r2t8g5l3kynad87u0n9eragf3hhkgkhqe5vhngq2cw493k48c9qg9ms4epllcmndd6ly4v4dw2jcnxaxzjqnlvnw",
        "penumbrav2t1ty7ns3hwcnqelrtmn6f72znf49td8hzxntchjglntl2evx42zl00y3u939zk83l2v2f8zj55gn50k78wxdvnfqk97kv4azlwjyle893zqgg9cqa6rycs9ucq3lf9ae4jk5vtrf",
        "penumbrav2t1s5p3dlh42p8skam328sl6r9qyj0nc3p75p5rftjyg9rw8wlhc34gruwkwj4pw4yj93muglftpjwh406edc6n07xp3u7dxg54mveqgc5wvac4srs2wzg9zp2eu385gn6g8rsyh2",
        "penumbrav2t1qj9045mzfavgkfe0st9fthmrrup99xgnnrqn88nkf3pyfekg8gg4t5k2zwgtxa0584cz7j907js3enuh3lz84qjv35hlu36r9n28a82dr2pt5ysx3slqnr0xp6tvlfqvgl55p6"
    ]

    describe("toBytes", () => {
        it("works", () => {
            expect(penumbraAddressByteArray.length).toBe(80);
            penumbraAddressByteArray.forEach((i) => {
                expect(i).toBeGreaterThanOrEqual(0);
                expect(i).toBeLessThanOrEqual(255);
            });
        });
    })

    describe("toBech32", () => {
        it("works", () => {
            expect(bech32.encode(
                'penumbrav2t',
                bech32.toWords(penumbraAddressByteArray),
                penumbraAddressLimit,
            )).toEqual(penumbraAddress);
        });
    })


    describe("decode and encode", () => {
        addresses.forEach( address => {
            it("works " + address, () => {
                let decoded = bech32.decode(
                    address,
                    penumbraAddressLimit);

                expect(decoded.prefix).toEqual("penumbrav2t");

                expect(bech32.encode(
                    decoded.prefix,
                    decoded.words,
                    penumbraAddressLimit,
                )).toEqual(address);
            });
        });

    })

});

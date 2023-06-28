import {fromBase64} from "@cosmjs/encoding";
import {bech32} from "bech32";
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
});

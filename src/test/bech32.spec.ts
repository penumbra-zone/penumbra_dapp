import {fromBase64} from "@cosmjs/encoding";
import {bech32m} from "bech32";
import {expect, jest, test, describe, it} from '@jest/globals';


describe("bech32", () => {

    const addressByteArray = fromBase64("uO4xMmm5xcE4F1NMZHSCuLerUIZcABueUXSylcnQqYV7uEW8/lFKAClU7mOm4KSwJEDS9F/ToRMWrY4e3WxEIepSdTtxZU9rLni+cp0cvJ0=");


    describe("toBech32", () => {
        it("works", () => {

            expect(bech32m.encode(
                'penumbrav2t',
                bech32m.toWords(addressByteArray),
                156
            )).toEqual("penumbrav2t1hrhrzvnfh8zuzwqh2dxxgayzhzm6k5yxtsqph8j3wjeftjws4xzhhwz9hnl9zjsq992wucaxuzjtqfzq6t69l5apzvt2mrs7m4kygg022f6nkut9fa4ju797w2w3e0yav3m37k");
        });
    })
});
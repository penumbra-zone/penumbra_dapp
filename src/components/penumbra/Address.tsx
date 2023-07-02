

import { Address } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/crypto/v1alpha1/crypto_pb';
import { bech32m } from 'bech32';
import React from 'react';
import toast from 'react-hot-toast';
import { CopySvg } from '../Svg';

// A Penumbra address in short form with a copy button
export const AddressComponent: React.FC<{ address: Address }> = ({ address }) => {
    const prefix = 'penumbrav2t';
    const address_str = bech32m.encode(
        prefix,
        bech32m.toWords(address.inner),
        160,
    );
    const address_str_short = address_str.slice(0, prefix.length + 1 + 24) + "…";

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success('Successfully copied', {
            position: 'top-center',
            icon: '👏',
            style: {
                borderRadius: '15px',
                background: '#141212',
                color: '#fff',
            },
        })
    }

    return (
        <> {

            <div style={{ display: "inline-block" }}>
                <span className="monospace">{address_str_short}</span>
                <span
                    className='cursor-pointer hover:no-underline hover:opacity-75'
                    onClick={() => copyToClipboard(address_str)}
                    style={{ display: "inline-block", margin: "0 5px" }}
                >
                    <CopySvg width='1em' height='1em' fill='#524B4B' />
                </span>
            </div>
        }
        </>
    )
}
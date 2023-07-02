

import { Address } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/crypto/v1alpha1/crypto_pb';
import { bech32m } from 'bech32';
import React from 'react';
import toast from 'react-hot-toast';
import { CopySvg } from '../Svg';
import { copyToClipboard } from '@/lib/copyToClipboard';

function truncateHash(hash: string | null, length: number = 6): string {
    if (hash === null) {
        return '';
    }
    if (hash.length <= 2 * length) {
        return hash;
    }
    return hash.slice(0, length) + '…' + hash.slice(-length);
}

// A transaction hash, optionally in short form, with a copy button
export const TransactionHashComponent: React.FC<{ hash: string, short_form?: boolean }> = ({ hash, short_form }) => {
    let display_hash = short_form ? truncateHash(hash, 8) : hash;

    return (
        <> {
            <div style={{ display: "inline-block" }}>
                <span className="monospace">{display_hash}</span>
                <span
                    className='cursor-pointer hover:no-underline hover:opacity-75'
                    onClick={() => copyToClipboard(hash)}
                    style={{ display: "inline-block", margin: "0 5px" }}
                >
                    <CopySvg width='1em' height='1em' fill='#524B4B' />
                </span>
            </div>
        }
        </>
    )
}
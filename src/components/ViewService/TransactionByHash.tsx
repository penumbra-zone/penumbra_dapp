import React from 'react'
import { useEffect, useState } from 'react';
import { ProviderPenumbra } from '../../utils/ProviderPenumbra';

export const TransactionByHash = () => {
  const [res, setRes] = useState<string>('');

  const getData = async () => {
    const penumbra = new ProviderPenumbra();

    const txs = await penumbra.getTransactions();

    const firstTx = txs[0];
    if (!firstTx) {
      return;
    }

    const data = await penumbra.getTransactionByHash({
      txHash: firstTx.txHash,
    });

    setRes(JSON.stringify(data));
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="w-[100%] flex flex-col bg-brown rounded-[15px] px-[24px] py-[12px] text_body break-words">
      {res}
    </div>
  );
};

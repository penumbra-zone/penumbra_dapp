import { TransactionByHashRequest } from '@buf/bufbuild_es_penumbra-zone_penumbra/penumbra/view/v1alpha1/view_pb';
import { useEffect, useState } from 'react';

export const TransactionByHash = () => {
  const [res, setRes] = useState<string>('');

  const getData = async () => {
    const txs = await window.penumbra.getTransactions();

    const firstTx = txs[0];
    if (!firstTx) {
      return setRes('[]');
    }

    const data = await window.penumbra.getTransactionByHash({
      txHash: firstTx.txHash,
    } as TransactionByHashRequest);

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

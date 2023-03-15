import { useEffect, useState } from 'react';
import { ProviderPenumbra } from '../../utils/ProviderPenumbra';

export const TransactionHashes = () => {
  const [res, setRes] = useState<string>('');

  const getData = async () => {
    const penumbra = new ProviderPenumbra();

    const data = await penumbra.getTransactionHashes();

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

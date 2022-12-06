import { useEffect, useState } from 'react';

export const Transactions = () => {
  const [res, setRes] = useState<string>('');

  const getData = async () => {
    const data = await window.penumbra.getTransactions();

    console.log(data);
    

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

import { useEffect, useState } from 'react';

export const FmdParameters = () => {
  const [res, setRes] = useState('');

  const getData = async () => {
    const data = await window.penumbra.getFmdParameters();

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

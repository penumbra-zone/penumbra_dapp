import { NotesResponse } from '@buf/bufbuild_es_penumbra-zone_penumbra/penumbra/view/v1alpha1/view_pb';
import { useEffect, useState } from 'react';

export const Notes = () => {
  const [res, setRes] = useState('');

  const getData = async () => {
    const data: NotesResponse[] = await window.penumbra.getNotes();
    console.log(data.map(i => i.noteRecord?.noteCommitment?.inner.length));
    

    // setRes(JSON.stringify(data));
  };

  useEffect(() => {
    const interval = setTimeout(getData, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <div className="w-[100%] flex flex-col bg-brown rounded-[15px] px-[24px] py-[12px] text_body break-words">
      {res}
    </div>
  );
};

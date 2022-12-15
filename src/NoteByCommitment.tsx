import { useEffect, useState } from 'react';

export const NoteByCommitment = () => {
  const [res, setRes] = useState<string>('');

  const getData = async () => {
    const notes = await window.penumbra.getNotes();

    console.log(notes);

    const firstNote: any = notes[0];
    if (!firstNote) {
      return setRes('[]');
    }

    console.log({ noteCommitment: firstNote.noteRecord.noteCommitment });

    const data = await window.penumbra.getNoteByCommitment({
      noteCommitment: firstNote.noteRecord.noteCommitment,
    } as any);

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

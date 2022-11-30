import { useEffect, useState } from 'react';

export const Notes = () => {
  const [res, setRes] = useState([]);

  const getData = async () => {
    const data = await window.penumbra.getNotes();

    setRes(data);
  };

  useEffect(() => {
    const interval = setTimeout(getData, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <div>
      <p>Notes</p>
      <p>{JSON.stringify(res)}</p>
    </div>
  );
};

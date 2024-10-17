import { ToneContext } from '@/helpers/tonecontext';
import React, { useContext } from 'react';

const Sidebar = () => {
  const { tone, setTone } = useContext(ToneContext);

  const handleToneChange = (event) => {
    setTone(event.target.value);
  };

  return (
    <div className="sidebar bg-slate-500/15 rounded-l-2xl text-white md:block md:w-45 lg:w-72 z-3">
      <h2 className='text-slate-500 text-2xl my-2'>Change Tone</h2>
      <select className='relative bg-inherit px-5 rounded-xl py-2 w-68 text-slate-300' value={tone} onChange={handleToneChange}>
        <option value="normal">Normal</option>
        <option value="professional">Professional</option>
        <option value="informal">Informal</option>
        <option value="gen-z">Gen-Z</option>
      </select>
    </div>
  );
};

export default Sidebar;
import React, { useState } from 'react';
import { Share2 } from 'lucide-react';

const ShareButton = ({label = 'Share', Icon = Share2, url = 'www.google.com'}) => {

  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    window.open(`https://${url}`)
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`border border-white/40 rounded-lg flex items-center gap-3 px-6 py-2.5 transition-all ease-linear active:bg-white/20 active:backdrop-blur-3xl hover:bg-white/5 hover:backdrop-blur-3xl
        `}
      >
        <Icon className= 'w-5 h-5' />
        <span className="text-xl font-medium">{label}</span>
      </button>
    </>
  );
};

export default ShareButton;

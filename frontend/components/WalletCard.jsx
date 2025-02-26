import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Trash2, ShareIcon } from 'lucide-react';

const WalletCard = ({ title, address, network, balance, nfts, onRemove, onView, status = "connected" }) => {
  return (
    <div className='w-full border-[0.2px] border-white py-5 rounded-2xl'>
      <div className='w-full px-5 pb-4 border-b border-b-white flex flex-col gap-5'>
        <div className='flex justify-between items-center'>
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-6 flex-wrap'>
              <h3 className='text-white md:text-2xl text-lg font-bold'>{title}</h3>
              <button
                className={`flex px-2 py-1 rounded-2xl md:text-sm text-xs items-center gap-1 ${
                    status === 'connected'
                    ? 'bg-[#485074] text-green-300'
                    : 'bg-gray-600 text-red-300'
                }`}
                >
                {status === 'connected' ? <Check size={18} /> : <X size={18} />}  
                {status === 'connected' ? 'Connected' : 'Disconnected'}
              </button>
            </div>
            <p className="text-white hidden sm:block">{address}</p>
            <p className="text-white block sm:hidden">
            {address.slice(0, 6)}...{address.slice(-4)}
            </p>
          </div>
          <button className='text-red-600' onClick={onRemove}>
            <Trash2 size={18} />
          </button>
        </div>
        <div className='grid md:grid-cols-3 grid-cols-1 gap-5'>
          <div className='w-full border-white border rounded-lg p-5'>
            <h3 className='text-gray-400 tablet:text-xl text-base font-bold'>Network</h3>
            <p className='text-white'>{network}</p>
          </div>
          <div className='w-full border-white border rounded-lg p-5'>
            <h3 className='text-gray-400 tablet:text-xl text-base font-bold'>Balance</h3>
            <p className='text-white'>{balance}</p>
          </div>
          <div className='w-full border-white border rounded-lg p-5'>
            <h3 className='text-gray-400 tablet:text-xl text-base font-bold'>NFTs Collected</h3>
            <p className='text-white'>{nfts}</p>
          </div>
        </div>
      </div>
      <div className='px-5 pt-4 flex'>
        <Button type='submit' className='bg-white text-black' onClick={onView}>
          View Details <ShareIcon />
        </Button>
      </div>
    </div>
  );
};

export default WalletCard;

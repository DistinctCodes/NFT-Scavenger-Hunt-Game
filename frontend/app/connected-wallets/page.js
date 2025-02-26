"use client";

import AnimatedBlurBackground from '@/components/AnimatedBlurBackground';
import WalletCard from '@/components/WalletCard';
import { useState } from 'react';

const ConnectedWallets = () => {
  const [wallets, setWallets] = useState([
    {
      id: 1,
      title: 'Primary Wallet',
      address: '0x10e0271ec47d55511a047516f2a7301801d55eab',
      network: 'Starknet Mainnet',
      balance: '0.00 ETH',
      nfts: 0,
    },
    {
      id: 2,
      title: 'Secondary Wallet',
      address: '0x2a1234567890abcdef1234567890abcdef123456',
      network: 'Ethereum Mainnet',
      balance: '1.25 ETH',
      nfts: 3,
    },
  ]);

  const removeWallet = (id) => {
    setWallets(wallets.filter((wallet) => wallet.id !== id));
  };

  const viewDetails = (id) => {
    console.log('Viewing details for wallet:', id);
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-black via-purple-900 to-black">
      {/* Animated background blur */}
      <AnimatedBlurBackground />

      {/* Content */}
      <div className="relative flex min-h-screen flex-col items-center justify-center p-6 sm:p-24">
        {/* Glass card container */}
        <div className="backdrop-blur-lg bg-white/10 p-8 sm:p-12 rounded-2xl shadow-2xl border border-white/20 max-w-3xl w-full">
          {/* Grid effect */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/10 to-transparent opacity-20"
            style={{
              backgroundSize: "4px 4px",
              backgroundImage:
                "linear-gradient(to right, rgb(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgb(139, 92, 246, 0.1) 1px, transparent 1px)",
            }}
          />

          <div className='z-30'>
            <h1 className="text-3xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Connected Wallets
            </h1>

            <p className="text-lg sm:text-xl mb-8 text-gray-300 max-w-xl mx-auto text-center">
                Manage your connected wallets to track progress, collect NFTs, and compete in the global leaderboard.
            </p>

            <div className="w-full grid gap-8">
                {wallets.map((wallet) => (
                <WalletCard
                    key={wallet.id}
                    title={wallet.title}
                    address={wallet.address}
                    network={wallet.network}
                    balance={wallet.balance}
                    nfts={wallet.nfts}
                    onRemove={() => removeWallet(wallet.id)}
                    onView={() => viewDetails(wallet.id)}
                />
                ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ConnectedWallets;

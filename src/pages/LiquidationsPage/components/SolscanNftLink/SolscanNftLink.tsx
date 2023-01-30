import { FC } from 'react';
import { Solscan } from '@frakt/icons';

const SolscanNftLink: FC<{ nftMint: string }> = ({ nftMint }) => {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={`https://solscan.io/token/${nftMint}`}
    >
      <Solscan />
    </a>
  );
};

export default SolscanNftLink;

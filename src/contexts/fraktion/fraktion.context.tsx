import React, { useContext, useEffect, useState } from 'react';
import { keyBy } from 'lodash';
import { PublicKey } from '@solana/web3.js';
import { getAllVaults } from 'fraktionalizer-client-library';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

import {
  fetchVaultsFunction,
  FraktionContextType,
  SafetyBox,
  VaultData,
  VaultsMap,
  VaultState,
} from './fraktion.model';
import {
  buyout,
  createFraktionsMarket,
  fraktionalize,
  redeem,
} from './fraktion';
import fraktionConfig from './config';
import { getArweaveMetadataByMint } from '../../utils/getArweaveMetadata';
import verifyMints from '../../utils/verifyMints';
import { getMarkets } from '../../utils/markets';

const FraktionContext = React.createContext<FraktionContextType>({
  loading: false,
  error: null,
  vaults: [],
  vaultsMarkets: [],
  fraktionalize: () => Promise.resolve(null),
  buyout: () => Promise.resolve(null),
  redeem: () => Promise.resolve(null),
  createFraktionsMarket: () => Promise.resolve(null),
  refetch: () => Promise.resolve(null),
  patchVault: () => {},
});

export const FraktionProvider = ({
  children = null,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const {
    publicKey: walletPublicKey,
    signTransaction,
    signAllTransactions,
  } = useWallet();
  const { connection } = useConnection();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [vaults, setVaults] = useState<VaultData[]>([]);
  const [vaultsMarkets, setVaultsMarkets] = useState([]);

  const fetchVaultsMarkets = async () => {
    try {
      const markets = await getMarkets();
      setVaultsMarkets(markets);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  const fetchVaults: fetchVaultsFunction = async () => {
    try {
      setLoading(true);
      const { safetyBoxes: rawSafetyBoxes, vaults: rawVaults } =
        await getAllVaults(
          new PublicKey(fraktionConfig.FRAKTION_PUBKEY),
          connection,
        );

      const nftMints = (rawSafetyBoxes as SafetyBox[]).map(
        ({ tokenMint }) => tokenMint,
      );

      const metadataByMint = await getArweaveMetadataByMint(nftMints);
      const verificationByMint = await verifyMints(nftMints);

      const safetyBoxes = rawSafetyBoxes as SafetyBox[];
      const vaultsMap = keyBy(rawVaults, 'vaultPubkey') as VaultsMap;

      const vaultsData: VaultData[] = safetyBoxes.reduce(
        (
          acc,
          { vault: vaultPubkey, tokenMint: nftMint, safetyBoxPubkey, store },
        ) => {
          const vault = vaultsMap[vaultPubkey];
          const arweaveMetadata = metadataByMint[nftMint];
          const verification = verificationByMint[nftMint];

          if (vault && arweaveMetadata) {
            const { name, image, description, attributes } = arweaveMetadata;
            const {
              authority,
              fractionMint,
              fractionsSupply,
              lockedPricePerShare,
              priceMint,
              state,
              fractionTreasury,
              redeemTreasury,
              createdAt,
            } = vault;

            const vaultData: VaultData = {
              fractionMint,
              authority,
              supply: fractionsSupply,
              lockedPricePerFraction: lockedPricePerShare,
              priceTokenMint: priceMint,
              publicKey: vaultPubkey,
              state: VaultState[state],
              nftMint,
              name,
              imageSrc: image,
              nftAttributes: attributes,
              description,
              fractionTreasury,
              redeemTreasury,
              safetyBoxPubkey,
              store,
              isNftVerified: verification?.success || false,
              nftCollectionName: verification?.collection,
              createdAt: createdAt.toNumber(),
              buyoutPrice: lockedPricePerShare.mul(fractionsSupply),
            };

            return [...acc, vaultData];
          }

          return acc;
        },
        [],
      );

      setVaults(vaultsData);

      return vaultsData;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      setError(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const patchVault = (vaultInfo: VaultData): void => {
    setVaults((vaults) =>
      vaults.reduce((vaults, vault) => {
        if (vault.publicKey === vaultInfo.publicKey) {
          return [...vaults, vaultInfo];
        }
        return [...vaults, vault];
      }, []),
    );
  };

  useEffect(() => {
    connection && fetchVaults();
    fetchVaultsMarkets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection]);

  return (
    <FraktionContext.Provider
      value={{
        loading,
        error,
        vaults,
        vaultsMarkets,
        fraktionalize: (
          userNft,
          tickerName,
          pricePerFraction,
          fractionsAmount,
          token,
        ) =>
          fraktionalize(
            userNft,
            tickerName,
            pricePerFraction,
            fractionsAmount,
            token,
            walletPublicKey,
            signTransaction,
            connection,
          ),
        buyout: (vault, userTokensByMint) =>
          buyout(
            vault,
            userTokensByMint,
            walletPublicKey,
            signTransaction,
            connection,
          ),
        redeem: (vault) =>
          redeem(vault, walletPublicKey, signTransaction, connection),
        createFraktionsMarket: (fractionsMintAddress, tickerName) =>
          createFraktionsMarket(
            fractionsMintAddress,
            tickerName,
            walletPublicKey,
            signAllTransactions,
            connection,
          ),
        refetch: fetchVaults,
        patchVault,
      }}
    >
      {children}
    </FraktionContext.Provider>
  );
};

export const useFraktion = (): FraktionContextType => {
  const {
    loading,
    error,
    vaults,
    vaultsMarkets,
    fraktionalize,
    buyout,
    redeem,
    createFraktionsMarket,
    refetch: fetchVaults,
    patchVault,
  } = useContext(FraktionContext);
  return {
    loading,
    error,
    vaults,
    vaultsMarkets,
    fraktionalize,
    buyout,
    redeem,
    createFraktionsMarket,
    refetch: fetchVaults,
    patchVault,
  };
};

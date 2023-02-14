import { web3 } from 'fbonds-core';
import {
  returnAnchorProgram,
  anchorRawBNsAndPubkeysToNumsAndStrings,
} from 'fbonds-core/lib/fbond-protocol/helpers';
import { NftSwapPair, Validation } from 'fbonds-core/lib/fbond-protocol/types';
import moment from 'moment';

import { Pair } from '@frakt/api/bonds';

import { BONDS_PROGRAM_PUBKEY } from '../constants';

type GetPairAccount = (props: {
  accountsPublicKeys: {
    pairPubkey: web3.PublicKey;
    validationPubkey: web3.PublicKey;
    authorityAdapterPubkey: web3.PublicKey;
  };
  connection: web3.Connection;
}) => Promise<Pair>;

export const getPairAccount: GetPairAccount = async ({
  accountsPublicKeys,
  connection,
}): Promise<Pair | null> => {
  try {
    const { pairPubkey, validationPubkey, authorityAdapterPubkey } =
      accountsPublicKeys;

    const bondsProgram = returnAnchorProgram(BONDS_PROGRAM_PUBKEY, connection);

    const rawCreatedPairAccount = await bondsProgram.account.nftSwapPair.fetch(
      pairPubkey,
      'confirmed',
    );

    const createdPair = anchorRawBNsAndPubkeysToNumsAndStrings({
      account: rawCreatedPairAccount,
      publicKey: pairPubkey,
    }) as NftSwapPair;

    const rawCreatedValidationAccount =
      await bondsProgram.account.validation.fetch(
        validationPubkey,
        'confirmed',
      );

    const createdValidation = anchorRawBNsAndPubkeysToNumsAndStrings({
      account: rawCreatedValidationAccount,
      publicKey: validationPubkey,
    }) as Validation;

    return {
      ...createdPair,
      createdAt: moment().toString(),
      authorityAdapterPublicKey: authorityAdapterPubkey?.toBase58(),
      updatedAt: moment().toString(),
      isRemoved: false,
      validation: {
        publicKey: validationPubkey?.toBase58(),
        ...createdValidation,
        isRemoved: false,
        createdAt: moment().toString(),
        updatedAt: moment().toString(),
      },
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

import { CollectionsListItem } from './types';

export const fetchRaffleCollections = async (): Promise<
  CollectionsListItem[]
> => {
  const response = await fetch(
    `https://${process.env.BACKEND_DOMAIN}/liquidation/raffle-collections`,
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const fetchGraceRaffleCollections = async (): Promise<
  CollectionsListItem[]
> => {
  const response = await fetch(
    `https://${process.env.BACKEND_DOMAIN}/liquidation/grace-collections`,
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const fetchHistoryRaffleCollections = async (): Promise<
  CollectionsListItem[]
> => {
  const response = await fetch(
    `https://${process.env.BACKEND_DOMAIN}/liquidation/history-collections`,
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const fetchAllRaffleCollections = async (): Promise<any> => {
  const [raffleCollections, graceCollections, historyCollections] =
    await Promise.all([
      fetchRaffleCollections(),
      fetchGraceRaffleCollections(),
      fetchHistoryRaffleCollections(),
    ]);

  return { raffleCollections, graceCollections, historyCollections };
};

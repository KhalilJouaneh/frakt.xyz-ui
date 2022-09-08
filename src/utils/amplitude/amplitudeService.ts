import {
  track,
  init,
  setDeviceId,
  setUserId,
} from '@amplitude/analytics-browser';

import { AMP_API_KEY } from './constants';

export const initAmplitude = (): void => {
  init(AMP_API_KEY);
};

export const setAmplitudeUserDevice = (installationToken: string): void => {
  setDeviceId(installationToken);
};

export const setAmplitudeUserId = (userId: string): void => {
  setUserId(userId);
};

export const sendAmplitudeData = (
  eventType: string,
  eventProperties?: unknown,
): void => {
  track(eventType, eventProperties);
};

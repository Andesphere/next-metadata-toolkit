import { warnDev } from './utils';

export const warnSchema = (key: string, message: string) => {
  warnDev(`schema-${key}`, message);
};

export const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

export const isValidUrl = (value: unknown): value is string => {
  if (!isNonEmptyString(value)) {
    return false;
  }
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

export const isValidIsoDate = (value: unknown): value is string => {
  if (!isNonEmptyString(value)) {
    return false;
  }
  return !Number.isNaN(Date.parse(value));
};

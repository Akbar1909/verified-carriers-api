import * as dayjs from 'dayjs';

// add plugins if needed (example: utc, timezone)
// import utc from 'dayjs/plugin/utc';
// dayjs.extend(utc);

export const parseToDate = (value: string | Date): Date | null => {
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.toDate() : null;
};

export const formatToMMDDYYYY = (value: string | Date): string => {
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format('MM/DD/YYYY') : '';
};

export default dayjs

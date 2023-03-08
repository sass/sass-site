import formatDistanceToNowBase from 'date-fns/formatDistanceToNow';

/**
 * Returns the distance between the given date and now in words.
 *
 * @see https://date-fns.org/docs/formatDistanceToNow
 */
export const formatDistanceToNow = (date: string) =>
  formatDistanceToNowBase(new Date(date));

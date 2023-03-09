import formatDistanceToNowBase from 'date-fns/formatDistanceToNow';

/**
 * Returns the distance between the given date and now in words.
 *
 * @see https://date-fns.org/docs/formatDistanceToNow
 */
export const formatDistanceToNow = (date: string) =>
  formatDistanceToNowBase(new Date(date));

/* eslint-disable @typescript-eslint/no-unsafe-member-access,
                  @typescript-eslint/no-unsafe-call,
                  @typescript-eslint/no-explicit-any */
export default function datesPlugin(eleventyConfig: any) {
  // filters...
  eleventyConfig.addLiquidFilter('formatDistanceToNow', formatDistanceToNow);
}

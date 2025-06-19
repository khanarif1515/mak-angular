export const UTMKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_placement'] as const;
export type TUTMs = typeof UTMKeys[number];
export type IUTMs = Partial<Record<TUTMs, string>>;

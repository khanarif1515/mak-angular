export const ApiEndPoints = {
  allCampaigns: 'campaigns',
  userMe: 'user/me',
  getMaskedUserMe: (username: string) => `user/masked/${username}`,
  userTransactions: (username: string) => `transactions/${username}`,
  campaign: (tag: string) => `fundraisers/${tag}`,
  getVehicle: (brand: string, tag: string) => `${brand}/${tag}`
} as const;
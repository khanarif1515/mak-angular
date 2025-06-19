export const ApiEndPoints = {
  allCampaigns: 'campaigns',
  campaign: (tag: string) => `fundraisers/${tag}`,
  getVehicle: (brand: string, tag: string) => `${brand}/${tag}`
} as const;
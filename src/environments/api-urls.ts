export const API_URLS = {
  GET_DOMAIN: 'getdomain',
  GET_FUNDRAISER(tag: String) { return `fundraisers/${tag}`; },
  GET_HEADER(domainName: string) { return `domain/${domainName}`; },
  GET_IP: 'third_party/iplocation',
  GET_CAMPAIGNS: 'campaigns',
};


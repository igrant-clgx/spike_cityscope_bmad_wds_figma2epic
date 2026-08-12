// Stub static dataset for address autocomplete (AD-3: no live API calls).
export interface MockAddress {
  id: string;
  fullAddress: string;
}

export const mockAddresses: MockAddress[] = [
  { id: 'addr-1', fullAddress: '12 Wattle Street, Parramatta NSW 2150' },
  { id: 'addr-2', fullAddress: '45 Banksia Avenue, Chatswood NSW 2067' },
  { id: 'addr-3', fullAddress: '8 Kingsford Road, Bondi NSW 2026' },
  { id: 'addr-4', fullAddress: '101 Collins Street, Melbourne VIC 3000' },
  { id: 'addr-5', fullAddress: '23 Grattan Street, Carlton VIC 3053' },
  { id: 'addr-6', fullAddress: '7 Riverside Drive, South Yarra VIC 3141' },
  { id: 'addr-7', fullAddress: '56 Adelaide Street, Brisbane QLD 4000' },
  { id: 'addr-8', fullAddress: '19 Marine Parade, Southport QLD 4215' },
  { id: 'addr-9', fullAddress: '34 Hay Street, Perth WA 6000' },
  { id: 'addr-10', fullAddress: '11 Rundle Street, Adelaide SA 5000' },
  { id: 'addr-11', fullAddress: '5 Elizabeth Street, Hobart TAS 7000' },
  { id: 'addr-12', fullAddress: '2 Northbourne Avenue, Canberra ACT 2600' },
];


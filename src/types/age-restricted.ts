export enum EAgeRestricted {
  G = 'G',
  PG = 'PG',
  PG13 = 'PG13',
  R = 'R',
  NC17 = 'NC17',
}

export const ageRestricted = Object.values(EAgeRestricted);

export const ageRestrictedDescription = {
  [EAgeRestricted.G]: 'G - General Audiences, all ages admitted',
  [EAgeRestricted.PG]:
    'PG - Parental Guidance Suggested, some material may not be suitable for children',
  [EAgeRestricted.PG13]:
    'PG13 - Parents Strongly Cautioned, some material may be inappropriate for children under 13',
  [EAgeRestricted.R]:
    'R - Restricted, under 17 requires accompanying parent or adult guardian',
  [EAgeRestricted.NC17]: 'NC17 - No One 17 and Under Admitted',
};

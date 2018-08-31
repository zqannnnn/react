export const consts = {
  USER_TYPE_NORMAL: 0,
  USER_TYPE_ADMIN: 1,

  TRANSACTION_STATUS_CANCELLED: 0,
  TRANSACTION_STATUS_CREATED: 1,
  TRANSACTION_STATUS_FINISHED: 2,
  TRANSACTION_STATUS_TAKING: 3,

  LICENSE_STATUS_UNCONFIRMED: 0,
  LICENSE_STATUS_CONFIRMED: 1,
  LICENSE_STATUS_DENIED: 2,

  IMAGE_TYPE_MEDIA: 1,
  IMAGE_TYPE_CERTIFICATE: 2,

  TRANSACTION_TYPE_BUY: 'Buy',
  TRANSACTION_TYPE_SELL: 'Sell',

  EXPIRE_IN: 60 * 60 * 24 * 7
}
export const beefOptions = {
  Storage: ['Frozen', 'Chilled'],
  Breed: [
    'Angus',
    'Hereford',
    'Brahman',
    'Limosine',
    'Buffalo',
    'Wagyu',
    'Mixed Breed',
    'Cross Cattle'
  ],
  Fed: ['Grass fed', 'Grain fed'],
  Grade: [
    'A',
    'B',
    'V',
    'C',
    'PR',
    'PRS',
    'S',
    'SS',
    'Y',
    'YG',
    'YGS',
    'YP',
    'YPS',
    'YS',
    'YE',
    'YGE',
    'BYG',
    'Other'
  ],
  'Slaughter Specification': [
    'Full Set',
    'Full set ex Trim',
    'Full Set ex Trim ex Neckbone',
    '1/4 cuts (quarter cut carcasses)',
    '1/8 cuts (eight way cuts)',
    'Selected Beef Cuts (Primals)'
  ],
  'Marble Score': [1, 2, 3, 4, 5, 6, 7, 8, 9],
  Bone: ['Bone In', 'Bone Out']
}

export const vealOptions = {
  Storage: ['Frozen', 'Chilled'],
  Breed: [
    'Angus',
    'Hereford',
    'Brahman',
    'Limosine',
    'Buffalo',
    'Wagyu',
    'Mixed Breed',
    'Cross Cattle'
  ],
  Grade: ['V'],
  'Slaughter Specification': [
    'Full Set',
    'Full set ex Trim',
    'Full Set ex Trim ex Neckbone',
    '1/4 cuts (quarter cut carcasses)',
    '1/8 cuts (eight way cuts)',
    'Selected Beef Cuts (Primals)'
  ],
  'Marble Score': [1, 2, 3, 4, 5, 6, 7, 8, 9],
  Bone: ['Bone In', 'Bone Out']
}
export const sheepOptions = {
  Storage: ['Frozen', 'Chilled'],
  Grade: ['L', 'M', 'R', 'YL', 'H', 'E', 'W'],
  'Slaughter Specification': [
    'Whole',
    '1/4 cuts',
    'Six way cut',
    'Slected Primals'
  ],
  'Marble Score': [1, 2, 3, 4, 5, 6, 7, 8, 9],
  Bone: ['Bone In', 'Bone Out']
}
export const accessKey = 'db7b00b340d9275681a88e2398428a37'
export const symbols = ['CNY', 'EUR', 'USD', 'GBP', 'JPY', 'KRW', 'FRF']

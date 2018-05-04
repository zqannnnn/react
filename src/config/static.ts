export const consts = {
  USER_TYPE_NORMAL: 0,
  USER_TYPE_ADMIN: 1,

  ORDER_STATUS_CANCELLED: 0,
  ORDER_STATUS_CREATED: 1,
  ORDER_STATUS_FINISHED: 2,

  OFFER_STATUS_CANCELLED: 0,
  OFFER_STATUS_CREATED: 1,
  OFFER_STATUS_FINISHED: 2,

  LICENSE_STATUS_UNCONFIRMED: 0,
  LICENSE_STATUS_CONFIRMED: 1,
  LICENSE_STATUS_DENIED: 2
}
export const beefOptions = {
  'Storage': ['Frozen', 'Chilled'],
  'Breed': [
    'Angus',
    'Hereford',
    'Brahman',
    'Limosine',
    'Buffalo',
    'Wagyu',
    'Mixed Breed',
    'Cross Cattle'
  ],
  'Fed': ['Grass fed', 'Grain fed'],
  'Grade': ['A', 'B', 'V', 'C', 'PR', 'PRS', 'S', 'SS', 'Y', 'YG', 'YGS', 'YP',
    'YPS', 'YS', 'YE', 'YGE', 'BYG', 'Other'],
  'Slaughter Specification': [
    'Full Set',
    'Full set ex Trim',
    'Full Set ex Trim ex Neckbone',
    '1/4 cuts (quarter cut carcasses)',
    '1/8 cuts (eight way cuts)',
    'Selected Beef Cuts (Primals)'
  ],
  'Marble Score': ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
  'Bone': ['Bone In', 'Bone Out']
}

export const vealOptions = {
  'Storage': [
    'Frozen', 'Chilled'
  ],
  'Breed': [
    'Angus',
    'Hereford',
    'Brahman',
    'Limosine',
    'Buffalo',
    'Wagyu',
    'Mixed Breed',
    'Cross Cattle'
  ],
  'Grade': ['V'],
  'Slaughter Specification': [
    'Full Set',
    'Full set ex Trim',
    'Full Set ex Trim ex Neckbone',
    '1/4 cuts (quarter cut carcasses)',
    '1/8 cuts (eight way cuts)',
    'Selected Beef Cuts (Primals)'
  ],
  'Marble Score': ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
  'Bone': ['Bone In', 'Bone Out']
}
export const sheepOptions = {
  'Storage': ['Frozen', 'Chilled'],
  'Grade': ['L', 'M', 'R', 'YL', 'H', 'E', 'W'],
  'Slaughter Specification': [
    'Whole', '1/4 cuts', 'Six way cut', 'Slected Primals'
  ],
  'Marble Score': ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
  'Bone': ['Bone In', 'Bone Out']
}

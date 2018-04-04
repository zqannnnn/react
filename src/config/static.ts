export const consts = {
  USER_TYPE_NORMAL: 0,
  USER_TYPE_ADMIN: 1,

  ORDER_STATUS_CANCELLED:0,
  ORDER_STATUS_CREATED:1,
  ORDER_STATUS_FINISHED:2,

  OFFER_STATUS_CANCELLED:0,
  OFFER_STATUS_CREATED:1,
  OFFER_STATUS_FINISHED:2
}
export const beefOptions= {
  "Storage": ["Frozen", "Chilled"],
  "Breed": [
    "Angus",
    "Hereford",
    "Brahman",
    "Limosine",
    "Buffalo",
    "Wagyu",
    "Mixed Breed",
    "Cross Cattle"
  ],
  "Grade": ["A", "B", "V", "C", "PR", "PRS", "S", "SS", "Y", "YG", "YGS", "YP", "YPS", "YS", "YE", "YGE", "BYG", "Other"],
  "Slaughter Specification": [
    "Full Set",
    "Full set ex Trim",
    "Full Set ex Trim ex Neckbone",
    "1/4 cuts (quarter cut carcasses)",
    "1/8 cuts (eight way cuts)",
    "Selected Beef Cuts (Primals)"
  ],
  "Primal Cut": ["Blade", "Brisket", "Brisket NE", "Brisket PE", "Brisket PEDO", "Chuck", "Chuck Roll", "Chuck Tender", "Chuck-Square Cut", "Cube Roll/Rib Eye", "D-Rump", "Eye Round", "Forequarter", "Hindquarter", "Inside Meat", "Knuckle", "Neck", "Neck Bone", "Outside", "Outside Flat", "Rostbiff", "Rump", "Shin/Shank", "Short Loin", "Short Rib", "Silverside", "Sirloin Butt", "Spencer Roll", "Striploin", "Tenderloin SS-off", "Tenderloin SS-on", "Thick Flank", "Thin Flank", "Topside", "Full Set", "T-Bone Steak", "Tenderloin Steak", "1/4 Cut", "Wagyu", "Other"],
  "Bone": ["Bone In", "Bone Out"],
}

export const vealOptions = {
  "Storage": [
    "Frozen", "Chilled"
  ],
  "Breed": [
    "Angus",
    "Hereford",
    "Brahman",
    "Limosine",
    "Buffalo",
    "Wagyu",
    "Mixed Breed",
    "Cross Cattle"
  ],
  "Grade": ["V"],
  "Slaughter Specification": [
    "Full Set",
    "Full set ex Trim",
    "Full Set ex Trim ex Neckbone",
    "1/4 cuts (quarter cut carcasses)",
    "1/8 cuts (eight way cuts)",
    "Selected Beef Cuts (Primals)"
  ],
  "Bone": ["Bone In", "Bone Out"],
  "Primal Cut": [
    "Backstrap","Carcase (Pieces or 6 Way Cut)","Lag Long Cut","Leg Set (Hind Set)","Tenderloin",
    "Brisket Navel End","Brisket Point End","Loin","Osso Bucco","Rib Prepared","Shin/Shank",
    "Short Ribs","Spare Ribs","Blade (Clod)","Chuck","Chuck Roll","Chuck Tender","Cube Roll",
    "Eye of Loin (Backstrap)","Knuckle","Outside","Rump","Shin/Shank","Silverside","Striploin",
    "Tenderloin","Tenderloin-Side Strap Off","Thick Flank","Topside(lnside)","Topside Cap Off",
    "Forequarter","Forequarter& Hindquarter","Forequarter& Hindquarter Meat","Forequarter Meat",
    "Hindquarter","Hindquarter Meat","Trimmings"]
}
export const sheepOptions = {
  "Storage": ["Frozen", "Chilled"],
  "Grade": ["L", "M", "R", "YL", "H", "E", "W"],
  "Slaughter Specification": [
    "Whole","1/4 cuts","Six way cut","Slected Primals",
  ],
  "Bone": ["Bone In", "Bone Out"],
  "Primal Cut": ["Silverside", "Rump", "Knuckle", "Topside", "Leg Cuts", "Short Loin", "Loin", "Rack (Frenched)", "Rack (Frenched Cap Off)", "Rack", "Square Cut Shoulder", "Shoulder Square Cute Rolled/Netted", "Neck", "Leg Chump On", "Leg Chump Off Shank On", "Leg Chump On Shank Off", "Leg Chump Off Shank Off", "Leg Boneless", "Leg Chump Off Shank Off", "Tenderloin", "Backstrap", "Breast and Flap", "Fore Shank", "Tripe", "6-Way Cut", "Flap"]
}
//export const OtherOptions = {}
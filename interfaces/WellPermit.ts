export interface WellPermit {
  asBuiltAquifers?: string, // As Built Aquifers
  associatedAquifers?: string, // Associated Aquifers
  associatedCaseNumbers?: string, // Water court case number(s) associated with water right
  associatedUses?: string, // Associated Uses
  bottomPerforatedCasing?: number,	// Depth from surface to bottom of perforated casing (feet)
  contactAddress?: string, // Contact Address
  contactCity?: string, // Contact City
  contactName?: string, // Contact Name
  contactPostalCode?: string, // Contact Postal Code
  contactStateOrProvince?: string, // Contact State Or Province
  contactType?: string, // Contact Type
  coordsEw?: number, // Distance and direction from East/West section line (feet)
  coordsEwDir?: string, // Direction of measurement from East/West section line
  coordsNs?: number, // Distance and direction from North/South section line (feet)
  coordsNsDir?: string, // Direction of measurement from North/South section line
  county?: string, // County where the well is located
  date1stBeneficialUse?: Date, // Date of First Beneficial Use
  dateApplicationReceived?: Date, // Date Application Received
  datePermitExpires?: Date, // Date Permit Expires
  datePermitIssued?: Date, // Date Permit Issued
  datePumpInstalled?: Date, // Date Pump Installed
  dateWellCompleted?: Date, // Date Well Completed
  dateWellPlugged?: Date, // Date Well Plugged
  denverBasinAquifer?: string, // Denver Basin Aquifer
  depthTotal?: number, // Depth Total (ft)
  designatedBasinName?: string, // Eight established geographic areas in Colorado's Eastern Plains where users rely primarily on groundwater for water supply
  division?: number, // DWR Water Division
  driller?: string, // Driller
  drillerLic?: string, // Driller License
  elevation?: number, // Elevation (ft)
  latitude?: number, // Latitude value in decimal degrees
  locationAccuracy?: string, // Accuracy of location coordinates

  locationType?: string, // Location Type
  longitude?: number, // Longitude (decimal degrees)
  managementDistrictName?: string, // Thirteen local districts, within the Designated Basins, with additional administrative authority
  modified?: Date, // Last date time that this record was modified in the DWR database
  moreInformation?: string, // Hyperlink to additional details
  parcelName?: string, // Parcel Name
  permit?: string, // Well permit number
  permitCategoryDescr?: string, // Permit Category Description
  permitCurrentStatusDescr?: string, // Permit Current Status Description
  physicalAddress?: string, // Physical Address
  physicalCity?: string, // Physical City
  physicalPostalCode?: string, // Physical Postal Code
  physicalStateOrProvince?: string, // Physical State Or Province
  pm?: string, // Principal Meridian of well’s legal location - there are 5 principal meridians in CO?: Sixth (S), New Mexico (N), Baca (B), Costilla (C), and Ute (U)
  pumpInstaller?: string, // Pump Installer
  pumpLic?: string, // Pump License
  pumpTestYield?: number, // Pump Test Yield
  q10?: string, // Legal location?: 10 acre quarter section
  q160?: string, // Legal location?: 160 acre quarter section
  q40?: string, // Legal location?: 40 acre quarter section
  range?: string, // Legal location?: A number in the format “nnnd” where “nnn” is the range number and “d” is the direction either East or West
  receipt?: string, // Permit application receipt number
  section?: string, // Section number - township, range divided into 36 one square mile sections; “U” indicates location in Ute Correction (Division 7 only)
  staticWaterLevel?: number, // Static Water Level (ft)
  staticWaterLevelDate?: Date, // Static Water Level Date
  topPerforatedCasing?: number, // Depth from surface to top of perforated casing (feet)
  township?: string, // Legal location?: Township number and direction
  utmX?: number, // The x (Easting) component of the Universal Transverse Mercator system. (Zone 13, NAD83 datum)
  utmY?: number, // The y (Northing) component of the Universal Transverse Mercator system. (Zone 13, NAD83 datum)
  waterDistrict?: number, // DWR Water District
  wdid?: string, // DWR unique structure identifier
}

export type WellPermitStatus = 'requested' | 'approved' | 'rejected'

export type WellPermitAssignment = WellPermit & {
  status?: WellPermitStatus
  document_id: string
}
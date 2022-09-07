const counties = [
  'ADAMS',
  'ALAMOSA',
  'ARAPAHOE',
  'ARCHULETA',
  'BACA',
  'BENT',
  'BOULDER',
  'BROOMFIELD',
  'CHAFFEE',
  'CHEYENNE',
  'CLEAR CREEK',
  'CONEJOS',
  'COSTILLA',
  'CROWLEY',
  'CUSTER',
  'DELTA',
  'DENVER',
  'DOLORES',
  'DOUGLAS',
  'EAGLE',
  'EL PASO',
  'ELBERT',
  'FREMONT',
  'GARFIELD',
  'GILPIN',
  'GRAND',
  'GUNNISON',
  'HINSDALE',
  'HUERFANO',
  'JACKSON',
  'JEFFERSON',
  'KIOWA',
  'KIT CARSON',
  'LA PLATA',
  'LAKE',
  'LARIMER',
  'LAS ANIMAS',
  'LINCOLN',
  'LOGAN',
  'MESA',
  'MINERAL',
  'MOFFAT',
  'MONTEZUMA',
  'MONTROSE',
  'MORGAN',
  'OTERO',
  'OURAY',
  'PARK',
  'PHILLIPS',
  'PITKIN',
  'PROWERS',
  'PUEBLO',
  'RIO BLANCO',
  'RIO GRANDE',
  'ROUTT',
  'SAGUACHE',
  'SAN JUAN',
  'SAN MIGUEL',
  'SEDGWICK',
  'SUMMIT',
  'TELLER',
  'UNKNOWN',
  'WASHINGTON',
  'WELD',
  'YUMA'
]

const designatedBasins = [
  'CAMP CREEK',
  'KIOWA-BIJOU',
  'LOST CREEK',
  'NORTHERN HIGH PLAINS',
  'SOUTHERN HIGH PLAINS',
  'UPPER BIG SANDY',
  'UPPER BLACK SQUIRREL CREEK',
  'UPPER CROW CREEK'
]

const divisions = [
  { division: 1, divisionName: 'South Platte' },
  { division: 2, divisionName: 'Arkansas' },
  { division: 3, divisionName: 'Rio Grande' },
  { division: 4, divisionName: 'Gunnison' },
  { division: 5, divisionName: 'Colorado' },
  { division: 6, divisionName: 'Yampa/White' },
  { division: 7, divisionName: 'San Juan/Dolores' },
]

const managementDistricts = [
  'ARIKAREE',
  'CENTRAL YUMA',
  'EAST CHEYENNE',
  'FRENCHMAN',
  'LOST CREEK',
  'MARKS BUTTE',
  'NORTH KIOWA-BIJOU',
  'PLAINS',
  'SAND HILLS',
  'SOUTHERN HIGH PLAINS',
  'UNKNOWN',
  'UPPER BIG SANDY',
  'UPPER BLACK SQUIRREL',
  'W - Y',
  'UPPER CROW CREEK'
]

const waterDistricts = [
  { district: 1, division: 1, districtName: 'South Platte: Greeley to Balzac' },
  { district: 2, division: 1, districtName: 'South Platte: Denver Gage to Greeley' },
  { district: 3, division: 1, districtName: 'Cache La Poudre River' },
  { district: 4, division: 1, districtName: 'Big Thompson River' },
  { district: 5, division: 1, districtName: 'St. Vrain Creek' },
  { district: 6, division: 1, districtName: 'Boulder Creek' },
  { district: 7, division: 1, districtName: 'Clear Creek' },
  { district: 8, division: 1, districtName: 'South Platte Cheesman to Denver Gage' },
  { district: 9, division: 1, districtName: 'Bear Creek' },
  { district: 10, division: 2, districtName: 'Fountain Creek' },
  { district: 11, division: 2, districtName: 'Arkansas: Headwaters to Salida' },
  { district: 12, division: 2, districtName: 'Arkansas: Salida to Portland' },
  { district: 13, division: 2, districtName: 'Wet Mountain Valley' },
  { district: 14, division: 2, districtName: 'Arkansas: Portland to Fowler' },
  { district: 15, division: 2, districtName: 'Saint Charles' },
  { district: 16, division: 2, districtName: 'Cucharas River' },
  { district: 17, division: 2, districtName: 'Arkansas: Fowler to Las Animas' },
  { district: 18, division: 2, districtName: 'Apishapa River' },
  { district: 19, division: 2, districtName: 'Purgatoire River' },
  { district: 20, division: 3, districtName: 'Rio Grande' },
  { district: 21, division: 3, districtName: 'Alamosa La Jara' },
  { district: 22, division: 3, districtName: 'Conejos Creek' },
  { district: 23, division: 1, districtName: 'Upper South Platte' },
  { district: 24, division: 3, districtName: 'Culebra Creek' },
  { district: 25, division: 3, districtName: 'San Luis Creek' },
  { district: 26, division: 3, districtName: 'Saguache Creek' },
  { district: 27, division: 3, districtName: 'Carnero Creek' },
  { district: 28, division: 4, districtName: 'Tomichi Creek' },
  { district: 29, division: 7, districtName: 'San Juan River Basin' },
  { district: 30, division: 7, districtName: 'Animas River Basin' },
  { district: 31, division: 7, districtName: 'Los Pinos River Basin' },
  { district: 32, division: 7, districtName: 'McElmo Creek Basin' },
  { district: 33, division: 7, districtName: 'La Plata River Basin' },
  { district: 34, division: 7, districtName: 'Mancos River Basin' },
  { district: 35, division: 3, districtName: 'Trinchera Creek' },
  { district: 36, division: 5, districtName: 'Blue River Basin' },
  { district: 37, division: 5, districtName: 'Eagle River Basin' },
  { district: 38, division: 5, districtName: 'Roaring Fork River Basin' },
  { district: 39, division: 5, districtName: 'Rifle/Elk/Parachute Creeks' },
  { district: 40, division: 4, districtName: 'North Fork/Tribs.' },
  { district: 41, division: 4, districtName: 'Lower Uncompahgre River' },
  { district: 42, division: 4, districtName: 'Lower Gunnison River' },
  { district: 43, division: 6, districtName: 'White River Basin' },
  { district: 44, division: 6, districtName: 'Lower Yampa River' },
  { district: 45, division: 5, districtName: 'Divide Creek' },
  { district: 46, division: 7, districtName: 'Navajo Reservoir' },
  { district: 47, division: 6, districtName: 'North Platte River Basin' },
  { district: 48, division: 1, districtName: 'Laramie River' },
  { district: 49, division: 1, districtName: 'Republican River' },
  { district: 50, division: 5, districtName: 'Muddy/Troublesome Creeks' },
  { district: 51, division: 5, districtName: 'Upper Colorado/Fraser Rivers' },
  { district: 52, division: 5, districtName: 'Piney/Cottonwood Creeks' },
  { district: 53, division: 5, districtName: 'Tribs. North of Colorado River' },
  { district: 54, division: 6, districtName: 'Slater/Timberlake Creeks' },
  { district: 55, division: 6, districtName: 'Little Snake River' },
  { district: 56, division: 6, districtName: 'Green River Basin' },
  { district: 57, division: 6, districtName: 'Middle Yampa River' },
  { district: 58, division: 6, districtName: 'Upper Yampa River' },
  { district: 59, division: 4, districtName: 'East River Basin' },
  { district: 60, division: 4, districtName: 'San Miguel River Basin' },
  { district: 61, division: 4, districtName: 'Paradox Creek' },
  { district: 62, division: 4, districtName: 'Upper Gunnison River' },
  { district: 63, division: 4, districtName: 'Dolores River Basin' },
  { district: 64, division: 1, districtName: 'South Platte: Balzac to Stateline' },
  { district: 65, division: 1, districtName: 'Arikaree River' },
  { district: 66, division: 2, districtName: 'Cimarron River Basin' },
  { district: 67, division: 2, districtName: 'Arkansas: Las Animas to Stateline' },
  { district: 68, division: 4, districtName: 'Upper Uncompahgre River' },
  { district: 69, division: 7, districtName: 'Disappointment Creek Basin' },
  { district: 70, division: 5, districtName: 'Roan Creek Basin' },
  { district: 71, division: 7, districtName: 'West Dolores Creek/Tribs.' },
  { district: 72, division: 5, districtName: 'Lower Colorado River' },
  { district: 73, division: 4, districtName: 'Little Dolores River' },
  { district: 76, division: 1, districtName: 'Sand Creek' },
  { district: 77, division: 7, districtName: 'Navajo River Basin' },
  { district: 78, division: 7, districtName: 'Piedra River Basin' },
  { district: 79, division: 2, districtName: 'Huerfano River' },
  { district: 80, division: 1, districtName: 'North Fork of South Platte' },
]

export interface SelectOption {
  value: string
  label: string
}

const countyOptions: SelectOption[] = counties.map(county => ({
  value: county.replace(' ', '+'),
  label: county
}))

const designatedBasinOptions: SelectOption[] = designatedBasins.map(basin => ({
value: basin.replace(' ', '+'),
label: basin
}))

const divisionOptions: SelectOption[] = divisions.map(div => ({
value: div.division.toString(),
label: div.divisionName
}))

const managementDistrictOptions: SelectOption[] = managementDistricts.map(district => ({
value: district.replace(' ', '+'),
label: district
}))

const waterDistrictOptions: SelectOption[] = waterDistricts.map(dist => ({
value: dist.district.toString(),
label: dist.districtName
}))

// https://dwr.state.co.us/Rest/GET/api/v2/wellpermits/wellpermit/?format=json&fields=receipt%2Cpermit%2CcontactName&designatedBasinName=*SOUTHERN+HIGH+PLAINS*&division=1&managementDistrictName=*LOST+CREEK*&min-modified=09%2F01%2F2022&receipt=*123*&waterDistrict=6

export type SearchTermName = 
  'designatedBasinName' | 'division' | 'managementDistrictName' | 'waterDistrict' | 'modified' | 'county' | 'fields' | 'receipt' | 'format' | 'permit' | 'contactName'

export interface SearchOption {
  title: string
  name: SearchTermName
  options?: SelectOption[]
}

const searchOptions: SearchOption[] = [
  { title: 'County', name: 'county', options: countyOptions },
  { title: 'Designated Basin', name: 'designatedBasinName', options: designatedBasinOptions },
  { title: 'Division', name: 'division', options: divisionOptions },
  { title: 'Management District', name: 'managementDistrictName', options: managementDistrictOptions },
  { title: 'District', name: 'waterDistrict', options: waterDistrictOptions },
]

export default searchOptions
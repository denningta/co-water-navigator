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
  'YUMA',
]

const getWellPermitsFromApi = async (): Promise<any> => {
  const batchSize = 4
  let curReq = 0

  while(curReq < counties.length) {
    const end = counties
  } 

}

export default getWellPermitsFromApi


// return new Promise(async (resolve, reject) => {
//   const summaryData: any = [];

//   await counties.forEach(async county => {
//     const url = `https://dwr.state.co.us/Rest/GET/api/v2/wellpermits/wellpermit/?format=json&county=${county}&pageSize=3&apiKey=dD0Z%2BYbIn%2FURkYCMFGpPyxIIOtpwoVyE`

//     await fetch(url, { method: 'GET' })
//       .then(response => response.json())
//       .then(data => {
//         const summary = data.ResultList.map((record: any) => ({ permit: record.permit, county: record.county }))

//         summaryData.push(summary)
//       })
//   })

//   resolve(summaryData)
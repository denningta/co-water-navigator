import { rgb } from "pdf-lib"
import { BoundingBox } from "../../../../../lib/pdf-lib/interfaces"

export interface Field {
  name: string
  type: 'textField' | 'checkBox'
  box: BoundingBox
}

const fields = (debug: boolean = false): Field[] => {
  const color = debug ? rgb(0,0,1) : rgb(1,1,1)
  return [
    {
      name: 'permitNumber',
      type: 'textField',
      box: {
        x: 105,
        y: 500.5,
        width: 210,
        height: 15,
        color: color,
      }
    },
    {
      name: 'location',
      type: 'textField',
      box: {
        x: 80,
        y: 479,
        width: 230,
        height: 15,
        color: color
      }
    },
    {
      name: 'owner',
      type: 'textField',
      box: {
        x: 70,
        y: 458.5,
        width: 230,
        height: 15,
        color: color
      }
    },
    {
      name: 'calendarYear',
      type: 'textField',
      box: {
        x: 520,
        y: 519,
        width: 200,
        height: 15,
        color: color
      }
    },
    {
      name: 'allowedAppropriation',
      type: 'textField',
      box: {
        x: 675,
        y: 499.5,
        width: 100,
        height: 15,
        color: color
      }
    },
    {
      name: 'pumpingLimitThisYear',
      type: 'textField',
      box: {
        x: 652,
        y: 479,
        width: 100,
        height: 15,
        color: color
      }
    },
    {
      name: 'flowMeterLimit',
      type: 'textField',
      box: {
        x: 620,
        y: 458,
        width: 120,
        height: 15,
        color: color
      }
    },
    {
      name: 'district',
      type: 'textField',
      box: {
        x: 228,  
        y: 94,
        width: 150,
        height: 15,
        color: color
      }
    },
    {
      name: 'name',
      type: 'textField',
      box: {
        x: 125,
        y: 73,
        width: 261,
        height: 15,
        color: color
      }
    },
    {
      name: 'signature',
      type: 'textField',
      box: {
        x: 437,
        y: 73,
        width: 320,
        height: 15,
        color: color
      }
    },
    {
      name: 'address',
      type: 'textField',
      box: {
        x: 75,
        y: 53,
        width: 224,
        height: 15,
        color: color
      }
    },
    {
      name: 'city',
      type: 'textField',
      box: {
        x: 320.5,
        y: 53,
        width: 115,
        height: 15,
        color: color
      }
    },
    {
      name: 'state',
      type: 'textField',
      box: {
        x: 463.5,
        y: 53,
        width: 33,
        height: 15,
        color: color
      }
    },
    {
      name: 'zip',
      type: 'textField',
      box: {
        x: 515.3,
        y: 53,
        width: 65,
        height: 15,
        color: color
      }
    },
    {
      name: 'phone',
      type: 'textField',
      box: {
        x: 612,
        y: 53,
        width: 130,
        height: 15,
        color: color
      }
    },
    {
      name: 'expandedAcres',
      type: 'checkBox',
      box: { 
        x: 335.25, 
        y: 502.75,
        width: 10,
        height: 10,
        borderColor: color
      }
    },
    {
      name: 'commingledWells',
      type: 'checkBox',
      box: { 
        x: 335.25, 
        y: 482.1,
        width: 10,
        height: 10,
        borderColor: color
      }
    },
    {
      name: 'changeOfUse',
      type: 'checkBox',
      box: { 
        x: 335.25, 
        y: 461.5,
        width: 10,
        height: 10,
        borderColor: color
      }
    },
    {
      name: 'other',
      type: 'checkBox',
      box: { 
        x: 335.25, 
        y: 441,
        width: 10,
        height: 10,
        borderColor: color
      }
    },
  ]
}

export default fields
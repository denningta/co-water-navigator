import { rgb } from "pdf-lib"
import { Field } from "../dbb004/dbb004-fields"

const fields = (debug: boolean = false): Field[] => {
  const color = debug ? rgb(0,0,1) : rgb(1,1,1)
  
  return [
    {
      name: 'permitNumber',
      type: 'textField',
      box:  {
        x: 87,
        y: 624,
        width: 230, 
        height: 15,
        color: color
      }
    },
    {
      name: 'location',
      type: 'textField',
      box:  {
        x: 80,
        y: 605,
        width: 237, 
        height: 15,
        color: color
      }
    },
    {
      name: 'owner',
      type: 'textField',
      box:  {
        x: 71,
        y: 587,
        width: 246, 
        height: 15,
        color: color
      }
    },
    {
      name: 'expandedAcres',
      type: 'checkBox',
      box:  {
        x: 342,
        y: 626.2,
        width: 10, 
        height: 10,
        color: color
      }
    },
    {
      name: 'changeOfUse',
      type: 'checkBox',
      box:  {
        x: 342,
        y: 607.5,
        width: 10, 
        height: 10,
        color: color
      }
    },
    {
      name: 'other',
      type: 'checkBox',
      box:  {
        x: 342,
        y: 589.3,
        width: 10, 
        height: 10,
        color: color
      }
    },
    {
      name: 'year',
      type: 'textField',
      box: {
        x: 490,
        y: 597,
        width: 67,
        height: 15,
        color: color
      }
    },
    {
      name: 'originalAppropriation',
      type: 'textField',
      box: {
        x: 487,
        y: 549,
        width: 78,
        height: 15,
        color: color
      }
    },
    {
      name: 'allowedAppropriation',
      type: 'textField',
      box: {
        x: 487,
        y: 505,
        width: 78,
        height: 15,
        color: color
      }
    },
    {
      name: 'line3',
      type: 'textField',
      box: {
        x: 487,
        y: 465,
        width: 78,
        height: 15,
        color: color
      }
    },
    {
      name: 'maxBankingReserve',
      type: 'textField',
      box: {
        x: 487,
        y: 438.5,
        width: 78,
        height: 15,
        color: color
      }
    },
    {
      name: 'bankingReserveLastYear',
      type: 'textField',
      box: {
        x: 487,
        y: 404.5,
        width: 78,
        height: 15,
        color: color
      }
    },
    {
      name: 'pumpingLimitThisYear',
      type: 'textField',
      box: {
        x: 487,
        y: 357,
        width: 78,
        height: 15,
        color: color
      }
    },
    {
      name: 'line6OptionA',
      type: 'checkBox',
      box: {
        x: 67,
        y: 365,
        height: 15,
        width: 15,
        color: color
      }
    },
    {
      name: 'line6OptionB',
      type: 'checkBox',
      box: {
        x: 67,
        y: 340.3,
        height: 15,
        width: 15,
        color: color
      }
    },
    {
      name: 'totalPumpedThisYear',
      type: 'textField',
      box: {
        x: 487,
        y: 301,
        width: 78,
        height: 15,
        color: color
      }
    },
    {
      name: 'changeInBankingReserveThisYear',
      type: 'textField',
      box: {
        x: 487,
        y: 274,
        width: 78,
        height: 15,
        color: color
      }
    },
    {
      name: 'bankingReserveThisYear',
      type: 'textField',
      box: {
        x: 487,
        y: 240,
        width: 78,
        height: 15,
        color: color
      }
    },
    {
      name: 'line10',
      type: 'textField',
      box: {
        x: 487,
        y: 213.4,
        width: 78,
        height: 15,
        color: color
      }
    },
    {
      name: 'pumpingLimitNextYear',
      type: 'textField',
      box: {
        x: 487,
        y: 192.5,
        width: 78,
        height: 15,
        color: color
      }
    },
    {
      name: 'signatureDay',
      type: 'textField',
      box: {
        x: 279,
        y: 159,
        width: 44.5,
        height: 15,
        color: color
      }
    },
    {
      name: 'signatureMonth',
      type: 'textField',
      box: {
        x: 358,
        y: 159,
        width: 150,
        height: 15,
        color: color
      }
    },
    {
      name: 'signatureYear',
      type: 'textField',
      box: {
        x: 514,
        y: 159,
        width: 54,
        height: 15,
        color: color
      }
    },
    {
      name: 'signature',
      type: 'textField',
      box: {
        x: 130,
        y: 141,
        width: 438,
        height: 15,
        color: color
      }
    },
    {
      name: 'name',
      type: 'textField',
      box: {
        x: 109,
        y: 122,
        width: 459,
        height: 15,
        color: color
      }
    },
    {
      name: 'address',
      type: 'textField',
      box: {
        x: 80,
        y: 103,
        width: 488,
        height: 15,
        color: color
      }
    },
    {
      name: 'filler',
      type: 'textField',
      box: {
        x: 118,
        y: 84,
        width: 450,
        height: 15,
        color: color
      }
    },
    {
      name: 'city',
      type: 'textField',
      box: {
        x: 118,
        y: 84,
        width: 150,
        height: 15,
        color: color
      }
    },
    {
      name: 'state',
      type: 'textField',
      box: {
        x: 268,
        y: 84,
        width: 70,
        height: 15,
        color: color
      }
    },
    {
      name: 'zip',
      type: 'textField',
      box: {
        x: 338,
        y: 84,
        width: 100,
        height: 15,
        color: color
      }
    },
    {
      name: 'phone',
      type: 'textField',
      box: {
        x: 110,
        y: 65,
        width: 195,
        height: 15,
        color: color
      }
    },
    {
      name: 'district',
      type: 'textField',
      box: {
        x: 353,
        y: 65,
        width: 215,
        height: 15,
        color: color
      }
    },

  ]
}

export default fields
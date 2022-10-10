import { layoutMultilineText, layoutSinglelineText, PageSizes, PDFDocument, PDFFont, rgb } from "pdf-lib"
import { report } from "process"
import { alignVertical, centerInBox } from "../../../../lib/pdf-lib/helpers"
import { BoundingBox, TextOptions } from "../../../../lib/pdf-lib/interfaces"


const addDbb013 = async (
  pdfDoc: PDFDocument, 
  fonts: {
    font: PDFFont
    fontBold: PDFFont
  }, 
  debug: boolean = false
) => {
  const portriat = PageSizes.Letter
  const { font, fontBold } = fonts
  const fontSize = 11
  const page = pdfDoc.addPage(portriat)

  const defaultTextOptions: TextOptions = {
    size: fontSize,
    fontSize: fontSize,
    font: font
  }

  const { width, height } = page.getSize()
  const [ marginTop, marginLeft, marginRight, marginBottom ] = [ 30, 35, 35, 30 ]

  const marginBox = { 
    width: width - (marginLeft + marginRight), 
    height: height - (marginTop + marginBottom),
    x: marginLeft,
    y: marginBottom,
    borderColor: rgb(1, 0, 0)
  }

  debug && page.drawRectangle(marginBox)

  const titleBox = () => {
    const height = 175
    return {
      width: marginBox.width,
      height: height,
      x: marginBox.x,
      y: marginBox.height + marginBox.y - height,
      borderColor: rgb(0,1,0)
    }
  }

  debug && page.drawRectangle(titleBox())


  const formNameBox = () => {
    const height = fontSize
    return {
      width: 100,
      height: height,
      x: titleBox().x,
      y: titleBox().y + titleBox().height - height,
      borderColor: rgb(0,0,1)
    }
  }

  debug && page.drawRectangle(formNameBox())

  const formName = layoutSinglelineText('DBB-013 (11/2011)', {
    ...defaultTextOptions,
    alignment: 0,
    bounds: formNameBox()
  })

  page.drawText(formName.line.text, {...defaultTextOptions, ...formName.line})

  const addressBox = () => {
    const height = (fontSize + 3) * 3
    const width = 280
    return {
      width: width,
      height: height,
      lineHeight: 3,
      x: centerInBox(titleBox(), width),
      y: titleBox().y + titleBox().height - height,
      borderColor: rgb(1,0,0)
    }
  }

  debug && page.drawRectangle(addressBox())

  const addressText = layoutMultilineText(
    'COLORADO GROUND WATER COMMISSION\n' +
    '1313 Sherman Street, Room 821, Denver, CO 80203\n' +
    '303-866-3581, www.water.state.co.us', 
    {
      ...defaultTextOptions,
      alignment: 1,
      bounds: addressBox()
    }
  )

  addressText.lines.forEach(line => 
    page.drawText(line.text, { ...defaultTextOptions, ...line })
  )

  const formTitleBox = () => {
    const height = (fontSize + 3) * 2
    const width = 200
    return {
      width: width,
      height: height,
      x: centerInBox(titleBox(), width),
      y: addressBox().y - height - 10,
      borderColor: rgb(1,0,0)
    }
  }

  debug && page.drawRectangle(formTitleBox())
  
  
  const formTitle = layoutMultilineText(
    'Administrative Reporting\n' + 
    'Three-Year Modified Banking',
    {
      ...defaultTextOptions,
      alignment: 1,
      bounds: formTitleBox()
    }
  )

  formTitle.lines.forEach(line => 
    page.drawText(line.text, { ...defaultTextOptions, ...line, font: fontBold })
  )

  const instructionsBox = () => {
    const height = (fontSize + 3) * 1
    return {
      width: titleBox().width,
      height: height,
      x: titleBox().x,
      y: formTitleBox().y - height - 10,
      borderColor: rgb(1,0,0)
    }
  }

  debug && page.drawRectangle(instructionsBox())

  const formInstructions = layoutSinglelineText(
    'Instructions: This form must be submitted by February 15th each year for the prior calendar year.',
    {
      ...defaultTextOptions,
      alignment: 0,
      bounds: instructionsBox()
    }
  )

  page.drawText(formInstructions.line.text, { 
    ...defaultTextOptions, 
    ...formInstructions.line,
    font: fontBold
  })


  const permitDetailsBox = () => {
    const height = (fontSize + 5) * 3
    return {
      width: 1/2 * titleBox().width,
      height: height,
      x: titleBox().x,
      y: instructionsBox().y - height - 10,
      borderColor: rgb(0,0,1)
    }
  }

  debug && page.drawRectangle(permitDetailsBox())

  const permitDetails = layoutMultilineText(
    'Permit No.:\n' + 
    'Location:\n' +
    'Owner:',
    {
      ...defaultTextOptions,
      alignment: 0,
      bounds: permitDetailsBox()
    }
  )

  permitDetails.lines.forEach(line => 
    page.drawText(line.text, { ...defaultTextOptions, ...line })  
  )

  const permitUsageBox = () => {
    const height = (fontSize + 5) * 3
    return {
      width: 1/4 * titleBox().width,
      height: height,
      x: permitDetailsBox().x + permitDetailsBox().width,
      y: instructionsBox().y - height - 10,
      borderColor: rgb(0,0,1)
    }
  }

  debug && page.drawRectangle(permitUsageBox())

  const permitUsage = layoutMultilineText(
    'Expanded Acres\n' + 
    'Change of Use\n' +
    'Other',
    {
      ...defaultTextOptions,
      alignment: 0,
      bounds: permitUsageBox()
    }
  )

  permitUsage.lines.forEach(line => { 
    page.drawText(line.text, { 
      ...defaultTextOptions, 
      ...line,
      x: line.x + 15
    })  

    page.drawRectangle({
      ...line,
      width: 8,
      height: 8,
      borderColor: rgb(0,0,0)
    })
  })

  const adminYearBoxes = () => {
    const height = (fontSize + 5) * 3
    const width = 80
    return [
      {
        width: width,
        height: height,
        x: titleBox().x + titleBox().width - width,
        y: instructionsBox().y - height - 10,
        borderColor: rgb(0,0,0)
      },
      {
        width: width + 2,
        height: height + 2,
        x: titleBox().x + titleBox().width - width - 1,
        y: instructionsBox().y - height - 10 - 1,
        borderColor: rgb(0,0,0)
      },
    ]
  }

  adminYearBoxes().forEach(box => page.drawRectangle(box))

  const adminYear = layoutMultilineText(
    'Administrative\nYear',
    {
      ...defaultTextOptions,
      alignment: 0,
      bounds: adminYearBoxes()[0]
    }
  )

  adminYear.lines.forEach(line => 
    page.drawText(line.text, { 
      ...defaultTextOptions, 
      ...line,
      x: line.x + 7
    })
  )

  const tableBoxes = () => {
    const height = 411
    return [
      {
        width: marginBox.width,
        height: height,
        x: marginBox.x,
        y: titleBox().y - height,
        borderColor: rgb(0,0,0)
      },
      {
        width: marginBox.width + 2,
        height: height + 2,
        x: marginBox.x - 1,
        y: titleBox().y - height - 1,
        borderColor: rgb(0,0,0)
      }
    ]
  }

  tableBoxes().forEach(box => page.drawRectangle(box))

  const rowBoxes = (y: number, height: number) => {
    const col1 = 25
    const col2 = 430
    
    return [
      {
        width: col1,
        height: height,
        x: tableBoxes()[0].x,
        y: y,
        borderColor: rgb(0,0,0)
      },
      {
        width: col2,
        height: height,
        x: tableBoxes()[0].x + col1,
        y: y,
        borderColor: rgb(0,0,0)
      },
      {
        width: tableBoxes()[0].width - (col1 + col2),
        height: height,
        x: tableBoxes()[0].x + col1 + col2,
        y: y,
        borderColor: rgb(0,0,0)
      }
    ]
  }

  const rowDefs = [
    {
      line: '1',
      lines: 2
    },
    {
      line: '2',
      lines:  4 
    },
    {
      line: '3',
      lines: 1
    },
    {
      line: '4',
      lines: 2
    },
    {
      line: 'buffer',
      lines:  0.1
    },
    {
      line: '5',
      lines:  1
    },
    {
      line: '6',
      lines: 6
    },
    {
      line: 'buffer',
      lines:  0.1
    },
    {
      line: '7',
      lines:  1
    },
    {
      line: '8',
      lines: 2
    },
    {
      line: '9',
      lines:  2
    },
    {
      line: '10',
      lines: 1
    },
    {
      line: '11',
      lines: 1
    },
  ]

  const tableRows = () => {
    let prevY = 0
    return rowDefs.map((rowDef, i, array) => {
      const height = fontSize * rowDef.lines + 12

      const boxes: BoundingBox[] = [
        ...rowBoxes(
          prevY ? prevY - height : tableBoxes()[0].y + tableBoxes()[0].height - height,
          height
        )
      ]
      prevY = boxes[0].y
      return boxes
    })
  }

  tableRows().forEach(row => 
    row.forEach((box, i) => {
      page.drawRectangle(box)
    })
  )



  const line1Text = [
    layoutMultilineText('1', {
      ...defaultTextOptions,
      fontSize: fontSize,
      alignment: 0,
      bounds: tableRows()[0][0]
    }),
    layoutMultilineText(
      'Original maximum allowed annual appropriation.',
      {
        ...defaultTextOptions,
        alignment: 0,
        fontSize: fontSize,
        bounds: tableRows()[0][1]
      }
    ),
    layoutMultilineText(
      '                                            ' +
      '                                         ' +
      'This is the original permitted appropriation prior' + 
      ' to approval of the expanded acres or change of use.',
      {
        ...defaultTextOptions,
        alignment: 0,
        fontSize: fontSize,
        bounds: tableRows()[0][1]
      }
    ),
  ]

  line1Text.forEach((el, i) => 
    el.lines.forEach(line => 
      page.drawText(line.text, { 
        ...defaultTextOptions, 
        ...line,
        font: i === 1 ? fontBold : font,
        x: line.x + 5,
        y: line.y - 2
      })
    )  
  )

  const line2Text = [
    layoutMultilineText('2', {
      ...defaultTextOptions,
      fontSize: fontSize,
      alignment: 0,
      bounds: tableRows()[1][0],
    }),
    layoutMultilineText(
      'Allowed annual appropriation under the expanded acres or change or use\napproval.',
      {
        ...defaultTextOptions,
        alignment: 0,
        fontSize: fontSize,
        font: fontBold,
        bounds: tableRows()[1][1]
      }
    ),
    layoutMultilineText(
      '\n                  This is allowed average annual historical withdrawal as determined by the expanded acres or change of use approval for the expanded acres use or change of use.',
      {
        ...defaultTextOptions,
        alignment: 0,
        fontSize: fontSize,
        bounds: tableRows()[1][1]
      }
   )
  ]


  line2Text.forEach((el, i) => {
    el.lines.forEach(line => 
      page.drawText(line.text, { 
        ...defaultTextOptions, 
        ...line, 
        font: i === 1 ? fontBold : font,
        x: line.x + 5,
        y: line.y - 2,
      })
    )
  })

  const line3Text = [
    layoutMultilineText('3', {
      ...defaultTextOptions,
      alignment: 0,
      bounds: tableRows()[2][0]
    }),
    layoutMultilineText('Subtract line 2 from line 1 and enter here.', {
      ...defaultTextOptions,
      alignment: 0,
      bounds: tableRows()[2][1]
    })
  ]

  line3Text.forEach(el => 
    el.lines.forEach(line => 
      page.drawText(line.text, { 
        ...defaultTextOptions, 
        ...line,
        x: line.x + 5,
        y: line.y - 2
      })  
    )  
  )

  const line4Text = [
    layoutMultilineText('4', {
      ...defaultTextOptions,
      alignment: 0,
      bounds: tableRows()[3][0]
    }),
    layoutMultilineText('Maximum amount of water that may be in the banking reserve.', {
      ...defaultTextOptions,
      alignment: 0,
      bounds: tableRows()[3][1]
    }),
    layoutMultilineText(
      '                                                             ' + 
      '                                               ' + 
      'Multiply line 3 by 3 and enter here.', 
      {
        ...defaultTextOptions,
        alignment: 0,
        bounds: tableRows()[3][1]
      }
    ),
  ]

  line4Text.forEach((el, i) =>
    el.lines.forEach(line => 
      page.drawText(line.text, { 
        ...defaultTextOptions,
        ...line,
        font: i === 1 ? fontBold : font,
        x: line.x + 5,
        y: line.y - 2,
      })  
    )
  )

  const line5Text = [
    layoutMultilineText('5', {
      ...defaultTextOptions,
      alignment: 0,
      bounds: tableRows()[5][0]
    }),
    layoutMultilineText('Amount in banking reserve at the end of last year.', {
      ...defaultTextOptions,
      font: fontBold,
      alignment: 0,
      bounds: tableRows()[5][1]
    }),
    layoutMultilineText(
      '                                            ' +
      '                                           ' +
      'Enter line 9 of last year\'s report.', 
      {
        ...defaultTextOptions,
        alignment: 0,
        bounds: tableRows()[5][1]
      }
    ),
  ]

  line5Text.forEach((el, i) =>
    el.lines.forEach(line => 
      page.drawText(line.text, { 
        ...defaultTextOptions,
        ...line,
        font: i === 1 ? fontBold : font,
        x: line.x + 5,
        y: line.y - 2
      })  
    )
  )


  const line6Text = [
    layoutMultilineText('6', {
      ...defaultTextOptions,
      alignment: 0,
      bounds: tableRows()[6][0]
    }),
    layoutMultilineText('Pumping limit for this year.', {
      ...defaultTextOptions,
      font: fontBold,
      alignment: 0,
      bounds: tableRows()[6][1]
    }),
    layoutMultilineText(
      'A) If this year is the first year or a re-initiating year under the three year modified banking provision enter the amount from line 2; otherwise',
      {
        ...defaultTextOptions,
        alignment: 0,
        bounds: {
          ...tableRows()[6][1],
          y: tableRows()[6][1].y - fontSize - 3
        }
      }
    ),
    layoutMultilineText(
      'B) Enter the lesser of (line 1) or (line 2 plus line 5).  (This will be the same as line 11 of lat year\'s report)',
      {
        ...defaultTextOptions,
        alignment: 0,
        bounds: {
          ...tableRows()[6][1],
          y: tableRows()[6][1].y - (fontSize * 4) + 3
        }
      }
    ),
  ]

  line6Text.forEach((el, i) =>
    el.lines.forEach(line => 
      page.drawText(line.text, { 
        ...defaultTextOptions,
        ...line,
        font: i === 1 ? fontBold : font,
        x: line.x + 5,
        y: line.y - 2
      })  
    )
  )

  const line7Text = [
    layoutMultilineText('7', {
      ...defaultTextOptions,
      alignment: 0,
      bounds: tableRows()[8][0]
    }),
    layoutMultilineText('Total amount pumped this year.', {
      ...defaultTextOptions,
      alignment: 0,
      bounds: tableRows()[8][1]
    }),
    layoutMultilineText(
      '                                                        ' +
      'Enter the total amount of water pumped this year.', 
      {
        ...defaultTextOptions,
        alignment: 0,
        bounds: tableRows()[8][1]
      }
    ),
  ]

  line7Text.forEach((el, i) =>
  el.lines.forEach(line => 
    page.drawText(line.text, { 
      ...defaultTextOptions,
      ...line,
      font: i === 1 ? fontBold : font,
      x: line.x + 5,
      y: line.y - 2
    })  
  )
)

  const line8Text = [
    layoutMultilineText('8', {
      ...defaultTextOptions,
      alignment: 0,
      bounds: tableRows()[9][0]
    }),
    layoutMultilineText('Change of amount in banking reserve this year.', {
      ...defaultTextOptions,
      alignment: 0,
      bounds: tableRows()[9][1]
    }),
    layoutMultilineText(
      '                                                         ' +
      '                           ' +
      'Subtract line 7 from line 2 and enter here.  This number could be positive (+) or negative (-)', 
      {
        ...defaultTextOptions,
        alignment: 0,
        bounds: tableRows()[9][1]
      }
    ),
  ]

  line8Text.forEach((el, i) =>
  el.lines.forEach(line => 
    page.drawText(line.text, { 
      ...defaultTextOptions,
      ...line,
      font: i === 1 ? fontBold : font,
      x: line.x + 5,
      y: line.y - 2
    })  
  ))


  const line9Text = [
    layoutMultilineText('9', {
      ...defaultTextOptions,
      alignment: 0,
      bounds: tableRows()[10][0]
    }),
    layoutMultilineText('Amount in banking reserve at the end of this year.', {
      ...defaultTextOptions,
      alignment: 0,
      bounds: tableRows()[10][1]
    }),
    layoutMultilineText(
      '                                                           ' +
      '                             ' +
      'Enter the lesser of (line 4) or (line 5 plus line 8)', 
      {
        ...defaultTextOptions,
        alignment: 0,
        bounds: tableRows()[10][1]
      }
    ),
  ]

  line9Text.forEach((el, i) =>
  el.lines.forEach(line => 
    page.drawText(line.text, { 
      ...defaultTextOptions,
      ...line,
      font: i === 1 ? fontBold : font,
      x: line.x + 5,
      y: line.y - 2
    })  
  ))

  const line10Text = [
    layoutMultilineText('10', {
      ...defaultTextOptions,
      alignment: 0,
      bounds: tableRows()[11][0]
    }),
    layoutMultilineText('Add lines 2 and 9 and enter here.', {
      ...defaultTextOptions,
      alignment: 0,
      bounds: tableRows()[11][1]
    }),
  ]

  line10Text.forEach((el, i) =>
  el.lines.forEach(line => 
    page.drawText(line.text, { 
      ...defaultTextOptions,
      ...line,
      x: line.x + 5,
      y: line.y - 2
    })  
  ))


  const line11Text = [
    layoutMultilineText('11', {
      ...defaultTextOptions,
      alignment: 0,
      bounds: tableRows()[12][0]
    }),
    layoutMultilineText('Pumping limit for next year', {
      ...defaultTextOptions,
      alignment: 0,
      bounds: tableRows()[12][1]
    }),
    layoutMultilineText(
      '                                                ' +
      '- Enter the lesser of line 1 or line 10.', 
      {
        ...defaultTextOptions,
        alignment: 0,
        bounds: tableRows()[12][1]
      }
    ),
  ]

  line11Text.forEach((el, i) =>
  el.lines.forEach(line => 
    page.drawText(line.text, { 
      ...defaultTextOptions,
      ...line,
      font: i === 1 ? fontBold : font,
      x: line.x + 5,
      y: line.y - 2
    })  
  ))
  
  tableRows()[4].forEach(box => 
    page.drawRectangle({
      ...box,
      color: rgb(0.5,0.5,0.5),
    })
  )
  tableRows()[4].forEach(box => 
    page.drawRectangle(box)
  )

  tableRows()[7].forEach(box => 
    page.drawRectangle({
      ...box,
      color: rgb(0.5,0.5,0.5),
    })
  )
  tableRows()[7].forEach(box => 
    page.drawRectangle(box)
  )

  const signatureBox = () => {
    const height = marginBox.height - (titleBox().height + tableBoxes()[0].height)
    return {
      height: height,
      width: marginBox.width,
      x: marginBox.x,
      y: marginBox.y,
      borderColor: rgb(0,0,1)
    }
  }

  debug && page.drawRectangle(signatureBox())

  const signautreText = layoutMultilineText(
    'ADMINISTRATIVE AGENT:\n' + 
    'Signature of Agent:' +
    '                                                     Date:\n' +
    'Agent\'s Name:\n' +
    'Address:\n' + 
    'City, State & Zip:\n' +
    'Telephone No.:                                       District:',
    {
      ...defaultTextOptions,
      alignment: 0,
      bounds: {
        ...signatureBox(),
        y: signatureBox().y - 5
      }
    }  
  )

  signautreText.lines.forEach((line, i) => 
    page.drawText(line.text, { 
      ...defaultTextOptions, 
      ...line,
      y: line.y - (10 * i)
    })
  )


}

export default addDbb013
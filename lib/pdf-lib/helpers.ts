import { layoutMultilineText, layoutSinglelineText, PDFFont, PDFPage, rgb } from "pdf-lib"
import { BoundingBox, TextObj, TextOptions } from "./interfaces"



export const getTextObj = (
  text: string,
  textOptions: TextOptions,
  lineNumber: number,
  boundingBox: BoundingBox,
  alignment: 'left' | 'center' | 'right' = 'left',
  lineHeight?: number,
): TextObj => {
  lineHeight = textOptions.size + (lineHeight ?? 3)
  const textWidth = textOptions.font.widthOfTextAtSize(text, textOptions.size)
  const y = boundingBox.y + boundingBox.height - (textOptions.size + lineHeight * lineNumber)
  if (alignment === 'center') {
    return {
      text: text,
      options: {
        ...textOptions,
        x: boundingBox.x + boundingBox.width / 2 - textWidth / 2,
        y: y
      }
    }
  }

  if (alignment === 'right') {
    return {
      text: text,
      options: {
        ...textOptions,
        x: boundingBox.x + boundingBox.width - textWidth,
        y: y
      }
    }
  }

  return {
    text: text,
    options: {
      ...textOptions,
      x: boundingBox.x + (textOptions.margin?.left ?? 0),
      y: y
    }
  }
}


export interface PDFColDef {
  field: string
  font: PDFFont
  title?: string
  alignment?: 'left' | 'center' | 'right'
  width?: number
}

export interface HeaderStyles {
  textOptions: TextOptions
  height?: number
  verticalAlignment?: 'top' | 'center' | 'bottom'
}

export interface DrawTableOptions {
  colDefs: PDFColDef[],
  data?: {
    [field: string]: number | string
  }[],
  headerStyles: HeaderStyles
  numberOfRows?: number,
  rowHeight?: number,
}

export const drawTable = (
  page: PDFPage, 
  boundingBox: BoundingBox, 
  {
    colDefs,
    data,
    numberOfRows = 1,
    rowHeight = 20,
    headerStyles,
  }: DrawTableOptions
): void => {
  page.drawRectangle(boundingBox)

  const definedWidths = colDefs.map(col => col.width).filter(width => !!width)
  const totalDefinedWidth = definedWidths.reduce((prev, curr) => (prev ?? 0) + (curr ?? 0), 0)
  const autoSizeWidth = boundingBox.width - (totalDefinedWidth ?? 0)
  const headerHeight = headerStyles?.height ?? 30

  colDefs.forEach((column, colIndex, array) => {
    const colWidth = column.width ?? (autoSizeWidth / (colDefs.length - definedWidths.length))
    colDefs[colIndex].width = colWidth

    const prevColsWidth = array.slice(0, colIndex).map(el => el.width)
      .reduce((prev, curr) => (prev ?? 0) + (curr ?? 0), 0)

    const headerBox = {
      height: headerHeight,
      width: colWidth,
      x: boundingBox.x + (prevColsWidth ?? 0),
      y: boundingBox.y + boundingBox.height - headerHeight,
      borderColor: rgb(0, 0, 0)
    }
    
    page.drawRectangle(headerBox)
    
    const { lines } = layoutMultilineText(column.title ?? column.field, {
      alignment: 1,
      bounds: headerBox,
      font: headerStyles.textOptions.font,
      fontSize: headerStyles.textOptions.size
    })

    // Draw Header Text
    lines.forEach((el, i) => 
      page.drawText(el.text, { 
        ...headerStyles.textOptions,
        x: el.x,
        y: el.y
      })
    )

    for (let rowIndex = 0; rowIndex <= (numberOfRows - 1); rowIndex++) {
      const cellBox = {
        ...headerBox,
        height: rowHeight,
        y: headerBox.y - (rowHeight * (rowIndex + 1)),
      }
      page.drawRectangle(cellBox)

      const cellValue = (data && data[rowIndex] && data[rowIndex][column.field]) && 
        (data[rowIndex][column.field]?.toString() ?? data[rowIndex][column.field])

      if (cellValue) {
        const { line } = layoutSinglelineText(cellValue, {
          alignment: 1,
          font: column.font,
          bounds: cellBox,
          fontSize: 10
        })

        page.drawText(cellValue, {
          x: line.x,
          y: line.y,
          size: 10
        })
      }
    }
  })
}

export const centerInBox = (boundingBox: BoundingBox, width: number): number => {
  return ((2 * boundingBox.x + boundingBox.width) / 2) - (width / 2)
}

export const alignVertical = (boundingBox: BoundingBox, height: number): number => {
  return ((2 * boundingBox.y + boundingBox.height) / 2) - (height / 2)
}
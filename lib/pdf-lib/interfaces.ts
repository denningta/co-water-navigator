import { PDFFont, RGB } from "pdf-lib"

export interface TextObj {
  text: string
  options: {
    x: number,
    y: number
  }
}

export interface BoundingBox {
  width: number,
  height: number,
  x: number,
  y: number,
  color?: RGB
  borderColor?: RGB
}

export interface TextOptions {
  size: number 
  fontSize?: number
  font: PDFFont
  margin?: {
    top?: number
    bottom?: number
    left?: number
    right?: number
  }
}

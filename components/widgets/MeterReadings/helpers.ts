export function dateFormatter(params: any): string {

  const [year, month] = params.value.split('-')
  const date = new Date(Date.UTC(+year, +month))
  return `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`
}
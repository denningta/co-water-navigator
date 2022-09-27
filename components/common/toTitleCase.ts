const toTitleCase = (input: string) => {
  const permitNumber = new RegExp(/([0-9])+-\w*/)
  if (permitNumber.test(input)) return input
  const result = input.replace(/(?:^|[\s-/])\w/g, (match) => match.toUpperCase()).replace('-', ' ')
  return result
}

export default toTitleCase
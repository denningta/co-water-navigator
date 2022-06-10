function faunaError(error: any) {
  return `Error: [${error.name}] ${error.message}: ${error.errors()[0].description}`
}

export default faunaError;

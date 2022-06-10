import faunadb from 'faunadb';

const secret = process.env.FAUNADB_SECRET;
let endpoint = process.env.FAUNADB_ENDPOINT;

console.log(secret);

if (typeof secret === 'undefined' || secret === '') {
  console.error('The FAUNADB_SECRET environment variable is not set, exiting.')
  process.exit(1)
}

if (!endpoint) endpoint = 'https://db.fauna.com/'

let mg, domain, port, scheme: 'http' | 'https' | undefined
if ((mg = endpoint.match(/^(https?):\/\/([^:]+)(:(\d+))?/))) {
  scheme = (mg[1] === 'http' && 'http') || 'https'
  domain = mg[2] || 'db.fauna.com'
  port = +mg[4] || 443
}

export const q = faunadb.query

const faunaClient = new faunadb.Client({
  secret: secret,
  domain: domain,
  port: port,
  scheme: scheme,
});

export default faunaClient;


import faunadb from 'faunadb';

const secret = process.env.FAUNADB_SECRET;
let endpoint = process.env.FAUNADB_ENDPOINT;

if (typeof secret === 'undefined' || secret === '') {
  process.exit(1)
}

if (!endpoint) endpoint = 'https://db.fauna.com/'

let mg, domain, port, scheme: 'http' | 'https' | undefined
if ((mg = endpoint.match(/^(https?):\/\/([^:]+)(:(\d+))?/))) {
  scheme = (mg[1] === 'http' && 'http') || 'https'
  domain = 'db.fauna.com'
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


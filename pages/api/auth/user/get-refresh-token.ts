import { getSession } from "@auth0/nextjs-auth0";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next"

const getRefreshToken = async (req: NextApiRequest, res: NextApiResponse) => {

  const session = getSession(req, res)
  

  const clientSecret = process.env.AUTH0_CLIENT_SECRET
  if (!clientSecret) throw new Error('AUTH0_CLIENT_SECRET not defined')

  const refreshToken = session?.refreshToken ?? session?.idToken
  if (!refreshToken) throw new Error('No refresh token found')

  var options = {
    method: 'POST',
    url: 'https://dev-2nnla3mj.us.auth0.com/oauth/token',
    headers: {'content-type': 'application/x-www-form-urlencoded'},
    data: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: 'fNBLU4gUVPDysqHV0RxrFTtygBQaLbZ6',
      client_secret: clientSecret,
      refresh_token: refreshToken
    })
  };
  
  try {
    // const response = await axios.request(options) 
    res.status(200).json(session)
  } catch (error: any) {
    res.status(error.status || 500).json(error)
  }


}

export default getRefreshToken
import { Claims, getSession } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import { Octokit } from "octokit";


type HandlerFunctions = {
  [key: string]: (req: NextApiRequest, ...args: any) => Promise<any>
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {

    const session = getSession(req, res)

    if (!session?.user) {
      throw new Error('Not authorized to access this resource')
    }
    const user = session.user

    if (!req || !req.method) {
      throw new Error('No request or an invalid request method was sent to the server')
    }

    const handlers: HandlerFunctions = {
      POST: createIssue
    }

    const response = await handlers[req.method](req, user)

    res.status(200).json(response)

  } catch (error: any) {
    res.status(error?.status || 500).json(error)
  }

}


const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN
})

async function createIssue(req: NextApiRequest, user: any) {
  try {
    const { title, body } = req.body

    const version = `\n\n\nAPP INFO:\n${process.env.npm_package_name}: ${process.env.npm_package_version}`
    const userString = `\n\nUSER INFO:\n${user.name}\n${user.email}\n${user.sub}`

    const response = await octokit.request('POST /repos/denningta/co-water-navigator/issues', {
      owner: 'denningta',
      repo: 'co-water-navigator',
      title: title,
      body: body + version + userString,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })

    return response

  } catch (error: any) {
    return error
  }

}

export default handler;

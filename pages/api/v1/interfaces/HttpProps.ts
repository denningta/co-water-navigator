import { NextApiRequest, NextApiResponse } from "next";

export default interface HttpProps {
  req: NextApiRequest;
  res: NextApiResponse;
}
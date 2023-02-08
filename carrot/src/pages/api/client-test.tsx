import { NextApiRequest, NextApiResponse } from "next";
import client from "../../../libs/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await client.user.create({
    data: {
      email: "rlorxl@test.com",
      name: "rlorxl",
    },
  });

  res.json({
    ok: true,
  });
}

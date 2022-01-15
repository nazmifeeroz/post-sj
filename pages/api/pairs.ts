import type { NextApiRequest, NextApiResponse } from 'next'
import fetchPairsDB from '_lib/pairs'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: { message: 'Method not allowed' },
    })
  }

  try {
    const { data, pageCount } = await fetchPairsDB(
      +req.query.pageSize,
      +req.query.page
    )

    res.status(200).json({ success: true, data, pageCount })
  } catch (err) {
    res.status(401).json({ error: { message: 'Your token has expired.' } })
  }
}

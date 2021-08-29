import { query } from '../../../../lib/db'

const handler = async (req, res) => {
  console.log("u submitted !")
  try {
    return res.json(req.query)

  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '6mb'
    }
  }
}

export default handler
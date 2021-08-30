import { query } from '../../../../lib/db'
import formidable from 'formidable'
import { type } from 'os'
const { spawn } =  require('child_process')

const path = require('path')
const visionScriptPath = path.join(process.cwd(), '/scripts/middle.py')

const handler = async (req, res) => {
  return new Promise((resolve, reject) => {
    if (req.method != 'POST') {
          res.status(400).json("400: POST requests only")
          return resolve()
        }
    const form = new formidable.IncomingForm({allowEmptyFiles: false});
    form.uploadDir = path.join(process.cwd(), '/public/')
    form.keepExtensions = true
    form.on('error', (data) => {
      res.status(400).json({error: "error"}.end())
      return resolve()
    })
  
    form.parse(req, (err, fields, files) => {
      console.log(err, fields, files)
      try {
        const file_name = files.file.name
        const file_type = files.file.type
        const file_path = files.file.path
        const run = req.query.run
        const tank = req.query.tank

        const python = spawn('python', [visionScriptPath, run, tank, file_name, file_path]) 
        var pcv_reading;
        python.stdout.on('data', (data) => {
          pcv_reading = Number(data.toString())
          console.log(`pcv read as: ${pcv_reading}`)
        })
        python.stderr.on('data', (data) => {
          console.error(`stderr: ${data}`)
        })
        python.on('close', (code) => {
          console.log(`closing with status code: ${code}`)
          if (code != 0) {
            res.status(500).json({message: "Internal script error"})
          } else {
            //use Filter() from create-entry.ts
            /*
            const results = await query(`
              SELECT id, title, content
              FROM entries
              WHERE id = ?
            `,
              id
            )
            */
            res.status(200).json({message: "The file has been uploaded, analyzed, and saved"})
          }
            return resolve()
        })

      } catch (e) {
        res.status(500).json("500: a file was not provided")
        return resolve()
      }
    })
  })
}

export const config = {
  api: {
    bodyParser: false,
    /*
    bodyParser: {
      sizeLimit: '6mb'
    }
    */
  }
}

export default handler
import fs from 'fs-extra'
import path from 'path'
import * as babylon from "babylon"

const codePath = path.resolve(process.cwd(), './code.js')
const code = fs.readFileSync(codePath)

console.log(code.toString())
import fs from 'fs-extra'
import path from 'path'
import babylon from "babylon"
import traverse from "babel-traverse"
import generate from 'babel-generator'
import t from "babel-types"

const codePath = path.resolve(process.cwd(), './code.js')
const ogenCodePath = path.resolve(process.cwd(), './gen-code.js')
const code = fs.readFileSync(codePath).toString()

const ast = babylon.parse(code, {
  sourceType: "module",
  plugins: []
})

traverse.default(ast, {
  ImportDeclaration(path) {
    const specifiers = path.node.specifiers
    const source = path.node.source

    if (source.value === 'react') {
      let propTypeNode = null

      // 剔除PropTypes
      path.node.specifiers = specifiers.filter((specifier, i) => {
        if (specifier.local.name === 'PropTypes') {
          // 创建新的PropTypes节点
          propTypeNode = t.ImportDeclaration(
            [
              t.importDefaultSpecifier(specifier.local)
            ],
            t.StringLiteral('prop-types')
          )
        } else {
          return specifier
        }
      })

      path.insertAfter(propTypeNode)
    }
  }
})

fs.outputFileSync(ogenCodePath, generate.default(ast, {}, code).code)






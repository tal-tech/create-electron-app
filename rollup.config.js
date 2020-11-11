import typescript from 'typescript'
import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'
import typescript2 from 'rollup-plugin-typescript2'

import { dependencies } from './package.json'

const external = Object.keys(dependencies || '')
const globals = external.reduce((prev, current) => {
  const newPrev = prev

  newPrev[current] = current
  return newPrev
}, {})

const createConfig = {
  input: './src/index.ts',
  output: {
    file: './dist/index.js',
    format: 'cjs',
    banner: '#!/usr/bin/env node',
    globals
  },
  external,
  plugins: [
    typescript2({
      exclude: 'node_modules/**',
      useTsconfigDeclarationDir: true,
      typescript,
      tsconfig: './tsconfig.json'
    }),
    json(),
    terser()
  ]
}

export default createConfig

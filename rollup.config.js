import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';
import pkg from './package.json';

const name = 'snapshot';
const input = 'src/index.ts';
const external = [...Object.keys(pkg.dependencies || {})];

export default [
  {
    input,
    external,
    output: {
      name,
      file: pkg.browser,
      format: 'iife'
    },
    plugins: [
      typescript({ clean: true }),
      terser(),
      filesize()
    ]
  },
  {
    input,
    external,
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ],
    plugins: [
      typescript({ clean: true })
    ]
  }
];

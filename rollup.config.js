import babel from 'rollup-plugin-babel'
import configs from './build/configs'

const externals = [
  'vuex'
]

const genConfig = (config) => {
  return {
    input: 'src/index.js',
    output: {
      name: 'ErioVuexPersist',
      sourcemap: true,
      exports: 'named',
      ...config
    },
    external: externals,
    plugins: [
      babel({
        exclude: 'node_modules/**'
      }),
      ...(config.plugins || [])
    ]
  }
}

export default configs.map(genConfig)

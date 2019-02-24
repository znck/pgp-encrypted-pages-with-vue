const fs = require('fs')
const path = require('path')

module.exports = {
  /** @param {import('webpack-chain')} config */
  chainWebpack(config) {
    config.module.rule('images').exclude.add(/encrypted/)
    config.module.rule('media').exclude.add(/encrypted/)

    config.module
      .rule('inlined-images')
      .include.add(/encrypted/)
      .end()
      .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: Infinity,
      })

    config.module
      .rule('inlined-media')
      .include.add(/encrypted/)
      .end()
      .test(/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/)
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: Infinity,
      })

    config.module
      .rule('key')
      .test(/\.asc$/)
      .use('raw-loader')
      .loader('raw-loader')

    config
      .plugin('encrypt')
      .use(require('./encryption/webpack-chunk-encryption-plugin'), [
        {
          publicKey: fs
            .readFileSync(
              path.resolve(__dirname, './encryption/encryption-key.asc')
            )
            .toString(),
        },
      ])

      if (process.env.NODE_ENV === 'production') config.devtool(false)
  },
}

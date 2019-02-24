const openpgp = require('openpgp')

module.exports = class ChunkEncryptionPlugin {
  constructor({ publicKey }) {
    this.publicKey = publicKey
  }
  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'ChunkEncryptionPlugin',
      async (compilation, done) => {
        const names = Object.keys(compilation.assets).filter(name =>
          /\.enc.([a-f0-9]+\.)?js$/.test(name)
        )

        await Promise.all(
          names.map(async name => {
            const chunk = compilation.assets[name]
            const content = decrypt(
              await encrypt(chunk.source(), this.publicKey)
            )

            compilation.assets[name] = {
              source() {
                return content
              },
              size() {
                return content.length
              },
            }
          })
        )

        done()
      }
    )
  }
}

async function encrypt(message, key) {
  const result = await openpgp.encrypt({
    message: openpgp.message.fromText(message),
    publicKeys: (await openpgp.key.readArmored(key)).keys,
  })

  return result.data
}

function decrypt(content) {
  return `window.__decrypt_webpack_chunk__('${content
    .split(/\r?\n/g)
    .join('\\n')}')`
}

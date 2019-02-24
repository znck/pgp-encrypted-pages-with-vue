import { decrypt, decryptKey, key as KEY, message } from 'openpgp'

export default function ChunkDecryptionPlugin(Vue, { privateKey }) {
  let current = {}

  window.__decrypt_webpack_chunk__ = async function __decrypt_webpack_chunk__(
    payload
  ) {
    if (!current.vm) {
      setTimeout(window.__decrypt_webpack_chunk__, 1000, payload)
      return
    }

    const { vm, password } = current

    try {
      const passphrase = await password()
      vm.$emit('decryption:start')
      const { key } = await decryptKey({
        privateKey: (await KEY.readArmored(privateKey)).keys[0],
        passphrase,
      })
      const content = await decrypt({
        message: await message.readArmored(payload),
        privateKeys: [key],
      })
      const script = document.createElement('script')
      script.innerHTML = content.data
      document.head.appendChild(script)
      vm.$emit('decryption:loaded')
    } catch (error) {
      vm.$emit('decryption:error', error, () =>
        __decrypt_webpack_chunk__(payload)
      )
      console.error(error) // eslint-disable-line
    }
  }
  const warnHandler = Vue.config.warnHandler
  Vue.config.warnHandler = (error, vm, info) => {
    if (/Loading chunk .*?\.enc failed/.test(error.message)) return
    if (warnHandler) return warnHandler(error, vm, info)
  }

  Vue.mixin({
    created() {
      if (this.$options.password) {
        current = {
          vm: this,
          password: () => this.$options.password.call(this),
        }
      }
    },
  })
}

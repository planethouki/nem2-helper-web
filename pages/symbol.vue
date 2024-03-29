<template>
  <div>
    <div>
      <span>秘密鍵：</span>
      <input name="privateKey" v-model="privateKey">
    </div>
    <div>
      <span>ノード</span>
      <input name="nodeUrl" v-model="nodeUrl">
    </div>
    <hr />
    <div>
      <button @click="handleSend">トランザクションを送信</button>
    </div>
    <div>送信メッセ―ジ：{{ sendMessage }}</div>
    <div>トランザクションハッシュ：{{ hash }}</div>
    <hr />
    <div>
      <button @click="handleStatus">トランザクションを確認</button>
    </div>
    <div>トランザクションステータス：{{ statusMessage }}</div>
  </div>
</template>

<script>
import symbolSdk from 'symbol-sdk'
import axios from 'axios'

export default {
  name: 'IndexPage',
  data() {
    return {
      privateKey: '',
      nodeUrl: '',
      sendMessage: '',
      statusMessage: '',
      hash: ''
    }
  },
  methods: {
    async handleSend() {
      this.sendMessage = '送信中…'
      this.hash = ''
      const network = symbolSdk.symbol.Network.TESTNET
      const facade = new symbolSdk.facade.SymbolFacade(network.name)
      const privateKey = new symbolSdk.PrivateKey(this.privateKey)
      const keyPair = new facade.constructor.KeyPair(privateKey)
      const textEncoder = new TextEncoder()
      const deadline = network.fromDatetime(new Date(Date.now() + 7200000)).timestamp
      const transaction = facade.transactionFactory.create({
        type: 'transfer_transaction_v1',
        signerPublicKey: keyPair.publicKey.toString(),
        fee: 1000000n,
        deadline,
        recipientAddress: 'TARDV42KTAIZEF64EQT4NXT7K55DHWBEFIXVJQY',
        mosaics: [
          { mosaicId: 0x72C0212E67A08BCEn, amount: 1000000n },
        ],
        message: new Uint8Array([0x00, ...textEncoder.encode('Hello, World!')])
      })
      const signature = facade.signTransaction(keyPair, transaction)
      const jsonPayload = facade.transactionFactory.constructor.attachSignature(transaction, signature)
      const hash = facade.hashTransaction(transaction).toString()
      const sendResult = await axios.put(`${this.nodeUrl}/transactions`, JSON.parse(jsonPayload)).then((res) => res.data);
      this.sendMessage = JSON.stringify(sendResult)
      this.hash = hash
    },
    async handleStatus() {
      this.statusMessage = '取得中…'
      const statusResult = await axios
        .get(`${this.nodeUrl}/transactionStatus/${this.hash}`)
        .then((res) => res.data)
        .catch((e) => e.message)
      this.statusMessage = JSON.stringify(statusResult)
    }
  }
}
</script>

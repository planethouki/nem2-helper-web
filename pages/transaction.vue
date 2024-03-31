<script>
import symbolSdk from 'symbol-sdk'
import { sha3, keccak, ripemd160 } from 'hash-wasm'

export default {
  name: 'TransactionPage',
  asyncData() {
    return {
      transaction1: '',
      transactionHashMainnet1: '',
      transactionHashTestnet1: '',
      transactionType2: '',
      transactionTypeName2: '',
      data3: '',
      hash3: '',
      data4: '',
      hash4: '',
      data5: '',
      hash5: '',
      data6: '',
      hash6: '',
      data7: '',
      hash7: '',
    }
  },
  methods: {
    calTransactionHash() {
      try {
        const mainnet = symbolSdk.symbol.Network.MAINNET;
        const testnet = symbolSdk.symbol.Network.TESTNET;
        const facadeMainnet = new symbolSdk.facade.SymbolFacade(mainnet.name);
        const facadeTestnet = new symbolSdk.facade.SymbolFacade(testnet.name);
        const transaction = {
          signature: new symbolSdk.symbol.Signature(this.transaction1.substring(16, 144)),
          signerPublicKey: new symbolSdk.symbol.PublicKey(this.transaction1.substring(144, 208)),
          serialize: () => symbolSdk.utils.hexToUint8(this.transaction1),
        }
        const hashMainnet = facadeMainnet.hashTransaction(transaction);
        const hashTestnet = facadeTestnet.hashTransaction(transaction);
        this.transactionHashMainnet1 = hashMainnet.toString()
        this.transactionHashTestnet1 = hashTestnet.toString()
      } catch (e) {
        this.transactionHashMainnet1 = e.message
        this.transactionHashTestnet1 = e.message
      }
    },
    getTransactionType() {
      try {
        const transactionType = parseInt(this.transactionType2)
        this.transactionTypeName2 = symbolSdk.symbol.TransactionType.valueToKey(transactionType)
      } catch (e) {
        this.transactionTypeName2 = e.message
      }
    },
    async sha3_256() {
      try {
        const data = symbolSdk.utils.hexToUint8(this.data3)
        const hashed = await sha3(data, 256)
        this.hash3 = hashed.toUpperCase()
      } catch (e) {
        this.hash3 = e.message
      }
    },
    async sha3_512() {
      try {
        const data = symbolSdk.utils.hexToUint8(this.data4)
        const hashed = await sha3(data, 512)
        this.hash4 = hashed.toUpperCase()
      } catch (e) {
        this.hash4 = e.message
      }
    },
    async keccak256() {
      try {
        const data = symbolSdk.utils.hexToUint8(this.data5)
        const hashed = await keccak(data, 256)
        this.hash5 = hashed.toUpperCase()
      } catch (e) {
        this.hash5 = e.message
      }
    },
    async keccak256_ripemd160() {
      try {
        const data = symbolSdk.utils.hexToUint8(this.data6)
        const hashed = await keccak(data, 256)
        const ripemd = await ripemd160(symbolSdk.utils.hexToUint8(hashed))
        this.hash6 = ripemd.toUpperCase()
      } catch (e) {
        this.hash6 = e.message
      }
    },
    async keccak256_keccak256() {
      try {
        const data = symbolSdk.utils.hexToUint8(this.data7)
        const hashed = await keccak(data, 256)
        const hashed2 = await keccak(symbolSdk.utils.hexToUint8(hashed), 256)
        this.hash7 = hashed2.toUpperCase()
      } catch (e) {
        this.hash7 = e.message
      }
    }
  }
}
</script>

<template>
  <b-container>
    <h1>Transaction</h1>
    <b-form>
      <h2>Transaction Hash</h2>
      <b-form-group
        id="input-group-1"
        label="Transaction Hex Data:"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="transaction1"
          type="text"
          placeholder="B0000000000000005B58F38FE899AACC3E3CF71088F4F842D33D3DCC19B9934D01240CB06E7B322C15C178EF245CBF12DC74681B7EC3317D273909CCD51F60D732BFF24B05D4930BC65B49BA7673BFEC3EFD04DE7EF412A6346F4BA745AAC09649E8CAFE1AC385800000000001985441204E000000000000FFB09B630A0000009823D9088ACAA983387825E20765810238BA013BC9EFE74F00000100000000003CE19A057E831F0940420F0000000000"
          pattern="[0-9A-Fa-f]+"
          @change="calTransactionHash"
        ></b-form-input>
      </b-form-group>
      <div>Mainnet: {{ transactionHashMainnet1 }}</div>
      <div>Testnet: {{ transactionHashTestnet1 }}</div>
    </b-form>
    <b-form>
      <h2>Transaction Type</h2>
      <b-form-group
        id="input-group-2"
        label="Transaction Type:"
        label-for="input-2"
      >
        <b-form-input
          id="input-2"
          v-model="transactionType2"
          type="text"
          placeholder="16724 or 0x4144"
          pattern="[0-9A-Fa-f]+"
          @change="getTransactionType"
        ></b-form-input>
      </b-form-group>
      <div>{{ transactionTypeName2 }}</div>
    </b-form>
    <b-form>
      <h2>SHA3 256</h2>
      <b-form-group
        id="input-group-3"
        label="Hex Data:"
        label-for="input-3"
      >
        <b-form-input
          id="input-3"
          v-model="data3"
          type="text"
          placeholder="2BCE5DDB3F4C9571D01E00039001CBFD32E845702606070595C59938CEEFDABE"
          pattern="[0-9A-Fa-f]+"
          @change="sha3_256"
        ></b-form-input>
      </b-form-group>
      <div>{{ hash3 }}</div>
    </b-form>
    <b-form>
      <h2>SHA3 512</h2>
      <b-form-group
        id="input-group-4"
        label="Hex Data:"
        label-for="input-4"
      >
        <b-form-input
          id="input-4"
          v-model="data4"
          type="text"
          placeholder="2BCE5DDB3F4C9571D01E00039001CBFD32E845702606070595C59938CEEFDABE"
          pattern="[0-9A-Fa-f]+"
          @change="sha3_512"
        ></b-form-input>
      </b-form-group>
      <div>{{ hash4 }}</div>
    </b-form>
    <b-form>
      <h2>Keccak256</h2>
      <b-form-group
        id="input-group-5"
        label="Hex Data:"
        label-for="input-5"
      >
        <b-form-input
          id="input-5"
          v-model="data5"
          type="text"
          placeholder="2BCE5DDB3F4C9571D01E00039001CBFD32E845702606070595C59938CEEFDABE"
          pattern="[0-9A-Fa-f]+"
          @change="keccak256"
        ></b-form-input>
      </b-form-group>
      <div>{{ hash5 }}</div>
    </b-form>
    <b-form>
      <h2>Keccak256 -> RIPEMD160</h2>
      <b-form-group
        id="input-group-6"
        label="Hex Data:"
        label-for="input-6"
      >
        <b-form-input
          id="input-6"
          v-model="data6"
          type="text"
          placeholder="2BCE5DDB3F4C9571D01E00039001CBFD32E845702606070595C59938CEEFDABE"
          pattern="[0-9A-Fa-f]+"
          @change="keccak256_ripemd160"
        ></b-form-input>
      </b-form-group>
      <div>{{ hash6 }}</div>
    </b-form>
    <b-form>
      <h2>Keccak256 -> Keccak256</h2>
      <b-form-group
        id="input-group-7"
        label="Hex Data:"
        label-for="input-7"
      >
        <b-form-input
          id="input-7"
          v-model="data7"
          type="text"
          placeholder="2BCE5DDB3F4C9571D01E00039001CBFD32E845702606070595C59938CEEFDABE"
          pattern="[0-9A-Fa-f]+"
          @change="keccak256_keccak256"
        ></b-form-input>
      </b-form-group>
      <div>{{ hash7 }}</div>
    </b-form>
  </b-container>
</template>

<style scoped>

</style>

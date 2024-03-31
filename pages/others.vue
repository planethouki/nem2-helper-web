<script>
import symbolSdk from 'symbol-sdk'

export default {
  name: 'OthersPage',
  asyncData() {
    return {
      data1: '',
      result1: '',
      hex2: '',
      dec2: '',
      dec3: '',
      hex3: '',
      timestamp4: '',
      result4: '',
      hexMessage5: '',
      decodedMessage5: '',
    }
  },
  methods: {
    endianConvert() {
      try {
        this.result1 = swapEndian(this.data1)
      } catch (e) {
        this.result1 = e.message
      }
    },
    hexToDec() {
      try {
        this.dec2 = parseInt(this.hex2, 16)
      } catch (e) {
        this.dec2 = e.message
      }
    },
    decToHex() {
      try {
        const num = parseInt(this.dec3, 10);
        let hexStr = num.toString(16);
        hexStr = hexStr.padStart(hexStr.length + (hexStr.length % 2), '0');
        this.hex3 = hexStr.toUpperCase();
      } catch (e) {
        this.hex3 = e.message
      }
    },
    timestampToTime() {
      try {
        const network = symbolSdk.symbol.Network.MAINNET;
        const timestamp = parseInt(this.timestamp4, 10);
        this.result4 = network
          .datetimeConverter
          .toDatetime(timestamp)
          .toISOString();
      } catch (e) {
        this.result4 = e.message
      }
    },
    hexMessageDecode() {
      try {
        const message = symbolSdk.utils.hexToUint8(this.hexMessage5)
        const decoder = new TextDecoder();
        this.decodedMessage5 = decoder.decode(message)
      } catch (e) {
        this.decodedMessage5 = e.message
      }
    }
  }
}

function swapEndian(hexStr) {
  const hexBytes = hexStr.match(/.{1,2}/g) || [];
  const reversedBytes = hexBytes.reverse();
  return reversedBytes.join('');
}

</script>

<template>
  <b-container>
    <h1>Others</h1>
    <b-form>
      <h2>Endian Convert</h2>
      <b-form-group
        id="input-group-1"
        label="Hex Data:"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="data1"
          type="text"
          placeholder="2BCE5DDB3F4C9571D01E00039001CBFD32E845702606070595C59938CEEFDABE"
          pattern="[0-9A-Fa-f]+"
          @change="endianConvert"
        ></b-form-input>
      </b-form-group>
      <div>{{ result1 }}</div>
    </b-form>
    <b-form>
      <h2>Hex to Dec</h2>
      <b-form-group
        id="input-group-2"
        label="Hex Data:"
        label-for="input-2"
      >
        <b-form-input
          id="input-2"
          v-model="hex2"
          type="text"
          placeholder="35FA"
          pattern="[0-9A-Fa-f]+"
          @change="hexToDec"
        ></b-form-input>
      </b-form-group>
      <div>{{ dec2 }}</div>
    </b-form>
    <b-form>
      <h2>Dec to Hex</h2>
      <b-form-group
        id="input-group-3"
        label="Dec Data:"
        label-for="input-3"
      >
        <b-form-input
          id="input-3"
          v-model="dec3"
          type="text"
          placeholder="13850"
          pattern="[0-9]+"
          @change="decToHex"
        ></b-form-input>
      </b-form-group>
      <div>{{ hex3 }}</div>
    </b-form>
    <b-form>
      <h2>Catapult Timestamp</h2>
      <b-form-group
        id="input-group-4"
        label="Timestamp:"
        label-for="input-4"
      >
        <b-form-input
          id="input-4"
          v-model="timestamp4"
          type="text"
          placeholder="84055841"
          pattern="[0-9]+"
          @change="timestampToTime"
        ></b-form-input>
      </b-form-group>
      <div>{{ result4 }}</div>
    </b-form>
    <b-form>
      <h2>Hex Message Decode</h2>
      <b-form-group
        id="input-group-5"
        label="Hex Message:"
        label-for="input-5"
      >
        <b-form-input
          id="input-5"
          type="text"
          v-model="hexMessage5"
          placeholder="48656C6C6F20576F726C64"
          pattern="[0-9A-Fa-f]+"
          @change="hexMessageDecode"
        ></b-form-input>
      </b-form-group>
      <div>{{ decodedMessage5 }}</div>
    </b-form>
  </b-container>
</template>

<style scoped>

</style>

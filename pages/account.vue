<script>
import symbolSdk from 'symbol-sdk'
import base32Decode from "base32-decode";
import base32Encode from "base32-encode";

export default {
  name: 'AccountPage',
  asyncData() {
    return {
      privateKey1: '',
      publicKey1: '',
      publicKey2: '',
      addressMainnet2: '',
      addressTestnet2: '',
      address3: '',
      decodedAddress3: '',
      hexAddress4: '',
      encodedAddress4: '',
      privateKey5: '',
      message5: '',
      signature5: '',
      signature6: '',
      publicKey6: '',
      message6: '',
      verified: '',
    }
  },
  methods: {
    privateKeyToPublicKey() {
      try {
        const privateKey = new symbolSdk.PrivateKey(this.privateKey1);
        const keyPair = new symbolSdk.symbol.KeyPair(privateKey);
        this.publicKey1 = keyPair.publicKey.toString();
      } catch (e) {
        this.publicKey1 = e.message
      }
    },
    publicKeyToAddress() {
      try {
        const publicKey = new symbolSdk.PublicKey(this.publicKey2);
        const mainnet = symbolSdk.symbol.Network.MAINNET;
        const testnet = symbolSdk.symbol.Network.TESTNET;
        const facadeMainnet = new symbolSdk.facade.SymbolFacade(mainnet.name);
        const facadeTestnet = new symbolSdk.facade.SymbolFacade(testnet.name);
        const addressMainnet = new symbolSdk.symbol.Address(facadeMainnet.network.publicKeyToAddress(publicKey))
        const addressTestnet = new symbolSdk.symbol.Address(facadeTestnet.network.publicKeyToAddress(publicKey))
        this.addressMainnet2 = addressMainnet.toString()
        this.addressTestnet2 = addressTestnet.toString()
      } catch (e) {
        this.addressMainnet2 = e.message
        this.addressTestnet2 = e.message
      }
    },
    addressDecode() {
      try {
        const address = this.address3.replace(/-/g, '').toUpperCase()
        const decoded = base32Decode(address, 'RFC4648')
        this.decodedAddress3 = symbolSdk.utils.uint8ToHex(new Uint8Array(decoded))
      } catch (e) {
        this.decodedAddress3 = e.message
      }
    },
    addressEncode() {
      try {
        const hexAddress = this.hexAddress4.toUpperCase()
        const encoded = symbolSdk.utils.hexToUint8(hexAddress)
        this.encodedAddress4 = base32Encode(encoded, 'RFC4648').substring(0, 39)
      } catch (e) {
        this.encodedAddress4 = e.message
      }
    },
    sign() {
      try {
        const privateKey = new symbolSdk.PrivateKey(this.privateKey5);
        const keyPair = new symbolSdk.symbol.KeyPair(privateKey);
        const message = this.message5.toUpperCase();
        const signature = keyPair.sign(symbolSdk.utils.hexToUint8(message));
        this.signature5 = signature.toString()
      } catch (e) {
        this.signature5 = e.message
      }
    },
    verify() {
      try {
        const publicKey = new symbolSdk.PublicKey(this.publicKey6);
        const message = this.message6.toUpperCase();
        const signature = symbolSdk.utils.hexToUint8(this.signature6);
        const isVerified = new symbolSdk.symbol
          .Verifier(publicKey)
          .verify(symbolSdk.utils.hexToUint8(message), new symbolSdk.Signature(signature));
        this.verified = isVerified ? 'Verified' : 'Not Verified'
      } catch (e) {
        this.verified = e.message
      }
    }
  }
}
</script>

<template>
  <b-container>
    <h1>アカウント</h1>
    <b-form>
      <h2>PrivateKey to PublicKey</h2>
      <b-form-group
        id="input-group-1"
        label="Private Key:"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="privateKey1"
          type="text"
          placeholder="Enter Private Key"
          pattern="[0-9A-Fa-f]+"
          @change="privateKeyToPublicKey"
        ></b-form-input>
      </b-form-group>
      <div>{{ publicKey1 }}</div>
    </b-form>
    <b-form>
      <h2>PublicKey to Address</h2>
      <b-form-group
        id="input-group-2"
        label="Public Key:"
        label-for="input-2"
      >
        <b-form-input
          id="input-2"
          v-model="publicKey2"
          type="text"
          placeholder="Enter Public Key"
          pattern="[0-9A-Fa-f]+"
          @change="publicKeyToAddress"
        ></b-form-input>
      </b-form-group>
      <div>{{ addressMainnet2 }}</div>
      <div>{{ addressTestnet2 }}</div>
    </b-form>
    <b-form>
      <h2>Base32 Address Decode</h2>
      <b-form-group
        id="input-group-3"
        label="Address:"
        label-for="input-3"
      >
        <b-form-input
          id="input-3"
          v-model="address3"
          type="text"
          placeholder="Enter Address"
          pattern="[A-Za-z2-7]+"
          @change="addressDecode"
        ></b-form-input>
      </b-form-group>
      <div>{{ decodedAddress3 }}</div>
    </b-form>
    <b-form>
      <h2>Hex Address Encode</h2>
      <b-form-group
        id="input-group-4"
        label="Hex Address:"
        label-for="input-4"
      >
        <b-form-input
          id="input-4"
          v-model="hexAddress4"
          type="text"
          placeholder="Enter Address"
          pattern="[0-9A-Fa-f]+"
          @change="addressEncode"
        ></b-form-input>
      </b-form-group>
      <div>{{ encodedAddress4 }}</div>
    </b-form>
    <b-form>
      <h2>Sign</h2>
      <b-form-group
        id="input-group-5-1"
        label="Private Key:"
        label-for="input-5-1"
      >
        <b-form-input
          id="input-5-1"
          v-model="privateKey5"
          type="text"
          placeholder="Enter Private Key"
          pattern="[0-9A-Fa-f]+"
        ></b-form-input>
      </b-form-group>
      <b-form-group
        id="input-group-5-2"
        label="Hex Data to Sign:"
        label-for="input-5-2"
      >
        <b-form-input
          id="input-5-2"
          v-model="message5"
          type="text"
          placeholder="Enter Hex Data"
          pattern="[0-9A-Fa-f]+"
        ></b-form-input>
      </b-form-group>
      <b-button @click="sign">Sign</b-button>
      <div>{{ signature5 }}</div>
    </b-form>
    <b-form>
      <h2>Verify Signature</h2>
      <b-form-group
        id="input-group-6-1"
        label="Public Key:"
        label-for="input-6-1"
      >
        <b-form-input
          id="input-6-1"
          v-model="publicKey6"
          type="text"
          placeholder="Enter Public Key"
          pattern="[0-9A-Fa-f]+"
        ></b-form-input>
      </b-form-group>
      <b-form-group
        id="input-group-6-2"
        label="Hex Data:"
        label-for="input-6-2"
      >
        <b-form-input
          id="input-6-2"
          v-model="message6"
          type="text"
          placeholder="Enter Hex Data"
          pattern="[0-9A-Fa-f]+"
        ></b-form-input>
      </b-form-group>
      <b-form-group
        id="input-group-6-3"
        label="Signature:"
        label-for="input-6-3"
      >
        <b-form-input
          id="input-6-3"
          v-model="signature6"
          type="text"
          placeholder="Enter Signature"
          pattern="[0-9A-Fa-f]+"
        ></b-form-input>
      </b-form-group>
      <b-button @click="verify">Verify</b-button>
      <div>{{ verified }}</div>
    </b-form>
  </b-container>
</template>

<style scoped>

</style>

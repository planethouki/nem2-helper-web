<script>
import symbolSdk from 'symbol-sdk'

export default {
  name: 'NsmosaicPage',
  asyncData() {
    return {
      namespaceName1: '',
      namespaceId1: '',
      namespaceName2: '',
      namespaceId2: '',
    }
  },
  methods: {
    namespaceNameToId1() {
      try {
        const namespaceId = symbolSdk.symbol.generateNamespaceId(this.namespaceName1)
        this.namespaceId1 = namespaceId.toString(16).toUpperCase()
      } catch (e) {
        this.namespaceId1 = e.message
      }
    },
    namespaceNameToId2() {
      try {
        const namespaceId = symbolSdk.symbol.generateMosaicAliasId(this.namespaceName2)
        this.namespaceId2 = namespaceId.toString(16).toUpperCase()
      } catch (e) {
        this.namespaceId2 = e.message
      }
    }
  }
}
</script>

<template>
  <b-container>
    <h1>Namespace & Mosaic</h1>
    <b-form>
      <h2>Namespace ID</h2>
      <b-form-group
        id="input-group-1"
        label="Namespace Name:"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="namespaceName1"
          type="text"
          placeholder="foo"
          @change="namespaceNameToId1"
        ></b-form-input>
      </b-form-group>
      <div>{{ namespaceId1 }}</div>
    </b-form>
    <b-form>
      <h2>Child Namespace ID</h2>
      <b-form-group
        id="input-group-2"
        label="Namespace ID:"
        label-for="input-2"
      >
        <b-form-input
          id="input-2"
          v-model="namespaceName2"
          type="text"
          placeholder="foo.bar"
          @change="namespaceNameToId2"
        ></b-form-input>
      </b-form-group>
      <div>{{ namespaceId2 }}</div>
    </b-form>
  </b-container>
</template>

<style scoped>

</style>

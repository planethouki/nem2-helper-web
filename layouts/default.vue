<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand to="/">nem2-helper</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/account">Account</b-nav-item>
          <b-nav-item to="/nsmosaic">NS & Mosaic</b-nav-item>
          <b-nav-item to="/transaction">Transaction</b-nav-item>
          <b-nav-item to="/others">Others</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item
            href="https://github.com/planethouki/nem2-helper-web"
            target="_blank"
          >GitHub</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <Nuxt />
  </div>
</template>
<script setup>
</script>

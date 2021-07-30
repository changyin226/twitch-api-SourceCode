<template>
  <div id="app">
    <loading
      :active.sync="isLoading"
      color="#9f65ff"
      :lock-scroll="true"
      background-color="var(--bg-color)"
      :opacity="0.8"
    />
    <Navigation />
    <ToTopButton />
    <router-view />
  </div>
</template>

<script>
import Navigation from '@/components/Navigation.vue';
import ToTopButton from '@/components/ToTopButton.vue';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
  components: {
    Navigation,
    ToTopButton,
    Loading,
  },
  computed: {
    isLoading() {
      return this.$store.state.isLoading;
    },
  },
};
</script>

<style lang="scss">
@import './assets/stylesheet/all.scss';
</style>

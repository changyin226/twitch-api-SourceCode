<template>
  <div class="game-card-loading-component">
    <img
      :src="imgUrl"
      alt="Loading圖"
    >
    <p class="name" />
    <p class="viewers" />
  </div>
</template>

<script>
export default {
  computed: {
    imgUrl() {
      const { isDarkMode } = this.$store.state;
      return isDarkMode
        ? 'https://dummyimage.com/285x380/222227.jpg&text=+' : 'https://dummyimage.com/285x380/dfdfea.jpg&text=+';
    },
  },
};

</script>
<style lang="scss">
.game-card-loading-component{
  margin-bottom: 1rem;
  img{
    width: 100%;
    margin-bottom: 0.5rem;
  }
  .name{
    width: 80%;
    height: 16px;
    margin-bottom: 5px;
    background: var(--card-loading-bg);
  }
  .viewers{
    width: 50%;
    height: 14px;
    background: var(--card-loading-bg);
  }
}
</style>

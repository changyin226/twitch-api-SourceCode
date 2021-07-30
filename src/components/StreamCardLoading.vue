<template>
  <div class="stream-card-loading-component">
    <img
      :src="imgUrl"
      alt="Loading圖"
    >
    <div class="user-info">
      <p class="img" />
      <div class="info">
        <p class="title" />
        <p class="name" />
        <p
          v-if="routeName === 'AllStream'"
          class="game"
        />
        <p class="tags" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    routeName: {
      type: String,
      required: true,
    },
  },
  computed: {
    imgUrl() {
      const { isDarkMode } = this.$store.state;
      return isDarkMode
        ? 'https://dummyimage.com/320x180/222227.jpg&text=+' : 'https://dummyimage.com/320x180/dfdfea.jpg&text=+';
    },
  },
};

</script>
<style lang="scss">
.stream-card-loading-component{
  margin-bottom: 1rem;
  img{
    width: 100%;
    margin-bottom: 0.5rem;
  }
  .user-info{
    display: flex;
    .img{
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;
      background: var(--card-loading-bg);
    }
  }
  .info{
    width: 100%;
    .title{
      width: 60%;
      height: 14px;
      margin-bottom: 0.3rem;
      background: var(--card-loading-bg);
    }
    .name, .game{
      width: 40%;
      height: 14px;
      margin-bottom: 0.3rem;
      background: var(--card-loading-bg);
    }
    .tags{
      height: 18px;
    }
  }
}
</style>

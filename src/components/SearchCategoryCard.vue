<template>
  <div
    class="search-category-card-component"
  >
    <router-link
      :to="{ name: 'GameStream', params: { name: gameName } }"
      class="img-box"
    >
      <img
        :src="imgUrl"
        alt="遊戲圖片"
      >
    </router-link>
    <h3>
      <router-link :to="{ name: 'GameStream', params: { name: gameName } }">
        {{ category.name }}
      </router-link>
    </h3>
  </div>
</template>

<script>
export default {
  props: {
    category: {
      type: Object,
      required: true,
    },
  },
  computed: {
    gameName() {
      return encodeURIComponent(this.category.name);
    },
    imgUrl() {
      return this.category.box_art_url.replace('52x72', '285x380');
    },
  },
};
</script>

<style lang="scss">
.search-category-card-component{
  margin-bottom: 1rem;
  .img-box{
    display: block;
    position: relative;
    padding-top: 133.3%;
    img{
      width: 100%;
      position: absolute;
      top:0;
      transition: 0.3s;
      &:hover{
        transform: translate(5px, -5px);
        box-shadow:
          -1px 1px  #030303,
          -2px 2px  #9147ff,
          -3px 3px  #9147ff,
          -4px 4px  #9147ff,
          -5px 5px  #9147ff,
          -6px 6px  #9147ff,
      }
    }
  }
  h3{
    margin-top: 0.5rem;
    a{
      display: block;
      font-weight: bold;
      color: var(--font-color);
      overflow : hidden;
      text-overflow : ellipsis;
      white-space : nowrap;
      margin-bottom: 10px;
      &:hover{
        color: #a970ff;
      }
    }
  }
}
</style>

<template>
  <div class="search-page">
    <h2>
      搜尋: {{ term }}
    </h2>
    <router-link
      :to="{ name: 'SearchChannels', query:{ term } }"
      class="btn"
    >
      頻道
    </router-link>
    <router-link
      :to="{ name: 'SearchCategories', query:{ term } }"
      class="btn"
    >
      分類
    </router-link>
    <router-view :term="term" />
  </div>
</template>

<script>
export default {
  props: {
    term: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss">
.search-page{
  max-width: 1440px;
  margin: 0 auto;
  padding: 50px 15px;
  h2{
    color: var(--font-color);
    font-weight: 700;
    font-size: 48px;
    margin-bottom: 30px;
    overflow : hidden;
    text-overflow : ellipsis;
    white-space : nowrap;
  }
}
@media(max-width: 576px){
  .search-page{
    h2{
      font-size: 32px;
    }
  }
}
</style>

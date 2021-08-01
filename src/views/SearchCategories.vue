<template>
  <div
    class="search-categories-page"
  >
    <div
      v-if="!categoryList.length && loadingSuccess"
      class="notice"
    >
      <h3>找不到相關資料</h3>
    </div>
    <div
      v-else
      class="categories-list"
    >
      <SearchCategoryCard
        v-for="(category, i) in categoryList"
        :key="category.id"
        v-waypoint="{ active: (i + 1) === listNum && observing, callback: onWaypoint}"
        :category="category"
      />
    </div>
  </div>
</template>

<script>
import SearchCategoryCard from '@/components/SearchCategoryCard.vue';

export default {
  components: {
    SearchCategoryCard,
  },
  props: {
    term: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      categoryList: [],
      categoryID: [],
      cursor: '',
      observing: false,
      loadingSuccess: false,
    };
  },
  computed: {
    listNum() {
      return this.categoryList.length;
    },
  },
  beforeRouteUpdate(to, from, next) {
    Object.assign(this.$data, this.$options.data.call(this));
    this.getCategories(true, to.query.term);
    next();
  },
  mounted() {
    this.$store.commit('SEARCH', 'categories');
    this.getCategories(true, this.term);
  },
  methods: {
    getCategories(mounted, term) {
      if (this.cursor === undefined) return;
      if (mounted) this.$store.commit('LOADING');
      const api = `https://api.twitch.tv/helix/search/categories?query=${term}&first=25&after=${this.cursor}`;
      this.$http.get(api, {
        headers: {
          Authorization: `Bearer ${process.env.VUE_APP_AUTHORIZATION}`,
          'Client-Id': process.env.VUE_APP_CLIENT_ID,
        },
      }).then((response) => {
        setTimeout(() => {
          this.cursor = response.data.pagination.cursor;
          const resData = response.data.data
            .filter((category) => !this.categoryID.includes(category.id));
          resData.forEach((category) => {
            this.categoryID.push(category.id);
            this.categoryList.push(category);
          });
          if (mounted) {
            this.loadingSuccess = true;
            this.$store.commit('LOADING');
          }
          this.observing = true;
        }, 500);
      }).catch((err) => {
        if (mounted) this.$store.commit('LOADING');
        this.$swal(err.response.data.message);
      });
    },
    onWaypoint({ going }) {
      if (going === this.$waypointMap.GOING_IN) {
        this.observing = false;
        this.getCategories(false, this.term);
      }
    },
  },
};
</script>

<style lang="scss">
.search-categories-page{
  .categories-list{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 10px;
    padding: 30px 0;
  }
}
@media(max-width: 399px){
  .search-categories-page{
    .categories-list{
      grid-template-columns: repeat(auto-fill, minmax(125px, 1fr));
    }
  }
}
</style>

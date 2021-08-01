<template>
  <div class="search-channels-page">
    <div
      v-if="!channelList.length && loadingSuccess"
      class="notice"
    >
      <h3>找不到相關資料</h3>
    </div>
    <div
      v-else
      class="channels-list"
    >
      <SearchChannelCard
        v-for="(channel, i) in channelList"
        :key="channel.id"
        v-waypoint="{ active: (i + 1) === listNum && observing, callback: onWaypoint}"
        :channel="channel"
      />
    </div>
  </div>
</template>

<script>
import SearchChannelCard from '@/components/SearchChannelCard.vue';

export default {
  components: {
    SearchChannelCard,
  },
  props: {
    term: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      channelList: [],
      channelID: [],
      cursor: '',
      observing: false,
      loadingSuccess: false,
    };
  },
  computed: {
    listNum() {
      return this.channelList.length;
    },
  },
  beforeRouteUpdate(to, from, next) {
    Object.assign(this.$data, this.$options.data.call(this));
    this.getChannels(true, to.query.term);
    next();
  },
  mounted() {
    this.$store.commit('SEARCH', 'channels');
    this.getChannels(true, this.term);
  },
  methods: {
    getChannels(mounted, term) {
      if (this.cursor === undefined) return;
      if (mounted) this.$store.commit('LOADING');
      const api = `https://api.twitch.tv/helix/search/channels?query=${term}&first=25&after=${this.cursor}`;
      this.$http.get(api, {
        headers: {
          Authorization: `Bearer ${process.env.VUE_APP_AUTHORIZATION}`,
          'Client-Id': process.env.VUE_APP_CLIENT_ID,
        },
      }).then((response) => {
        setTimeout(() => {
          this.cursor = response.data.pagination.cursor;
          const resData = response.data.data
            .filter((channel) => !this.channelID.includes(channel.id));
          resData.forEach((channel) => {
            this.channelID.push(channel.id);
            this.channelList.push(channel);
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
        this.getChannels(false, this.term);
      }
    },
  },
};
</script>

<style lang="scss">
.search-channels-page{
  .channels-list{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 50px;
    padding: 30px 0;
  }
}
</style>

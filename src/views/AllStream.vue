<template>
  <div class="all-stream-page">
    <div class="filter">
      <span>篩選依據</span>
      <select v-model="lang">
        <option value="all">
          全部語言
        </option>
        <option value="zh">
          中文
        </option>
      </select>
    </div>
    <div class="all-stream-list">
      <StreamCard
        v-for="(stream, i) in streamList"
        :key="stream.user_id"
        v-waypoint="{ active: (i + 1) === listNum && observing, callback: onWaypoint }"
        :stream="stream"
        :route-name="routeName"
      />
    </div>
  </div>
</template>

<script>
import StreamCard from '@/components/StreamCard.vue';

export default {
  components: {
    StreamCard,
  },
  props: {
    routeName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      streamList: [],
      streamID: [],
      cursor: '',
      observing: false,
      length: 0,
    };
  },
  computed: {
    lang: {
      get() {
        return this.$store.state.lang;
      },
      set(val) {
        this.$store.commit('LANG', val);
        Object.assign(this.$data, this.$options.data.call(this));
        this.getAllStream(true);
        localStorage.setItem('lang', JSON.stringify(val));
      },
    },
    listNum() {
      return this.streamList.length;
    },
  },
  mounted() {
    this.getAllStream(true);
  },
  methods: {
    getAllStream(mounted) {
      if (this.cursor === undefined) return;
      if (mounted) this.$store.commit('LOADING');
      this.streamList.push({}, {}, {}, {}, {});
      let api = `https://api.twitch.tv/helix/streams?first=25&language=${this.lang}&after=${this.cursor}`;
      if (this.lang === 'all') {
        api = `https://api.twitch.tv/helix/streams?first=25&after=${this.cursor}`;
      }
      this.$http.get(api, {
        headers: {
          Authorization: `Bearer ${process.env.VUE_APP_AUTHORIZATION}`,
          'Client-Id': process.env.VUE_APP_CLIENT_ID,
        },
      }).then((response) => {
        setTimeout(() => {
          this.cursor = response.data.pagination.cursor;
          this.streamList.splice(this.listNum - 5);
          this.length = this.listNum;
          const resData = response.data.data
            .filter((stream) => !this.streamID.includes(stream.user_id));
          resData.forEach((stream) => {
            this.streamID.push(stream.user_id);
            this.streamList.push(stream);
          });
          for (let i = this.length; i < this.streamID.length; i += 1) {
            this.getUserLogo(this.streamID[i], i);
            this.getTags(this.streamID[i], i);
          }
          if (mounted) this.$store.commit('LOADING');
          this.observing = true;
        }, 500);
      }).catch((err) => {
        this.streamList.splice(this.listNum - 5);
        if (mounted) this.$store.commit('LOADING');
        this.$swal(err.response.data.message);
      });
    },
    getUserLogo(id, index) {
      const api = `https://api.twitch.tv/helix/users?id=${id}`;
      this.$http.get(api, {
        headers: {
          Authorization: `Bearer ${process.env.VUE_APP_AUTHORIZATION}`,
          'Client-Id': process.env.VUE_APP_CLIENT_ID,
        },
      }).then((response) => {
        this.$set(this.streamList[index], 'logoUrl', response.data.data[0].profile_image_url);
      });
    },
    getTags(id, index) {
      const api = `https://api.twitch.tv/helix/streams/tags?broadcaster_id=${id}`;
      this.$http.get(api, {
        headers: {
          Authorization: `Bearer ${process.env.VUE_APP_AUTHORIZATION}`,
          'Client-Id': process.env.VUE_APP_CLIENT_ID,
        },
      }).then((response) => {
        const resData = response.data.data;
        const tags = [];
        if (resData.length) {
          resData.splice(3);
          resData.forEach((tag) => {
            if (!tags.includes(tag.localization_names['zh-tw'])) {
              tags.push(tag.localization_names['zh-tw']);
            }
          });
        }
        this.$set(this.streamList[index], 'tags', tags);
      });
    },
    onWaypoint({ going }) {
      if (going === this.$waypointMap.GOING_IN) {
        this.observing = false;
        this.getAllStream(false);
      }
    },
  },
};
</script>

<style lang="scss">
.all-stream-page{
  .all-stream-list{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 10px;
    padding: 30px 0;
  }
}
</style>

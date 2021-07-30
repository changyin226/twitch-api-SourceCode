<template>
  <div class="clip-list-page">
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
      <select v-model="period">
        <option value="day">
          24小時
        </option>
        <option value="week">
          7天
        </option>
        <option value="month">
          30天
        </option>
        <option value="all">
          全部
        </option>
      </select>
    </div>
    <div
      v-if="!clipList.length && loadingSuccess"
      class="notice"
    >
      <h3>目前沒有熱門剪輯</h3>
    </div>
    <div
      v-else
      class="clip-list"
    >
      <ClipCard
        v-for="(clip, i) in clipList"
        :key="clip.url"
        v-waypoint="{ active: (i + 1) === listNum && observing, callback: onWaypoint}"
        :clip="clip"
        :route-name="routeName"
      />
    </div>
  </div>
</template>

<script>
import ClipCard from '@/components/ClipCard.vue';

export default {
  components: {
    ClipCard,
  },
  props: {
    routeName: {
      type: String,
      required: true,
    },
    gameName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      clipList: [],
      clipID: [],
      cursor: '',
      observing: false,
      loadingSuccess: false,
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
        this.getClipList(true);
        localStorage.setItem('lang', JSON.stringify(val));
      },
    },
    period: {
      get() {
        return this.$store.state.period;
      },
      set(val) {
        this.$store.commit('PERIOD', val);
        Object.assign(this.$data, this.$options.data.call(this));
        this.getClipList(true);
      },
    },
    listNum() {
      return this.clipList.length;
    },
  },
  mounted() {
    this.getClipList(true);
  },
  methods: {
    getClipList(mounted) {
      if (this.cursor === '' && this.clipList.length) return;
      if (mounted) this.$store.commit('LOADING');
      this.clipList.push({}, {}, {}, {}, {});
      let api = `https://api.twitch.tv/kraken/clips/top?game=${this.gameName}&limit=25&period=${this.period}&language=${this.lang}&cursor=${this.cursor}`;
      if (this.lang === 'all') {
        api = `https://api.twitch.tv/kraken/clips/top?game=${this.gameName}&limit=25&period=${this.period}&cursor=${this.cursor}`;
      }
      this.$http.get(api, {
        headers: {
          Accept: 'application/vnd.twitchtv.v5+json',
          'Client-Id': process.env.VUE_APP_CLIENT_ID,
        },
      }).then((response) => {
        setTimeout(() => {
          // eslint-disable-next-line no-underscore-dangle
          this.cursor = response.data._cursor;
          this.clipList.splice(this.listNum - 5);
          const resData = response.data.clips
            .filter((clip) => !this.clipID.includes(clip.tracking_id));
          resData.forEach((clip) => {
            this.clipID.push(clip.tracking_id);
            this.clipList.push(clip);
          });
          if (mounted) {
            this.loadingSuccess = true;
            this.$store.commit('LOADING');
          }
          this.observing = true;
        }, 500);
      }).catch(() => {
        this.clipList.splice(this.listNum - 5);
        if (mounted) this.$store.commit('LOADING');
        this.$swal('發生錯誤，請重新整理');
      });
    },
    onWaypoint({ going }) {
      if (going === this.$waypointMap.GOING_IN) {
        this.observing = false;
        this.getClipList(false);
      }
    },
  },
};
</script>

<style lang="scss">
.clip-list-page{
  .clip-list{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 10px;
    padding: 30px 0;
  }
}
</style>

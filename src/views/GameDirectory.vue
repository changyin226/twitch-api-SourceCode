<template>
  <div
    class="game-directory-page"
  >
    <GameCard
      v-for="(game, i) in gameList"
      :key="game.id"
      v-waypoint="{ active: (i + 1) === listNum && observing, callback: onWaypoint }"
      :game="game"
    />
  </div>
</template>

<script>
import GameCard from '@/components/GameCard.vue';

export default {
  components: {
    GameCard,
  },
  data() {
    return {
      gameList: [],
      gameID: [],
      cursor: '',
      observing: false,
      length: 0,
    };
  },
  computed: {
    listNum() {
      return this.gameList.length;
    },
  },
  mounted() {
    this.getGameDirectory(true);
  },
  methods: {
    getGameDirectory(mounted) {
      if (this.cursor === undefined) return;
      if (mounted) this.$store.commit('LOADING');
      this.gameList.push({}, {}, {}, {}, {});
      const api = `https://api.twitch.tv/helix/games/top?first=25&after=${this.cursor}`;
      this.$http.get(api, {
        headers: {
          Authorization: `Bearer ${process.env.VUE_APP_AUTHORIZATION}`,
          'Client-Id': process.env.VUE_APP_CLIENT_ID,
        },
      }).then((response) => {
        setTimeout(() => {
          this.cursor = response.data.pagination.cursor;
          this.gameList.splice(this.listNum - 5);
          this.length = this.listNum;
          const resData = response.data.data.filter((game) => !this.gameID.includes(game.id));
          resData.forEach((game) => {
            this.gameID.push(game.id);
            this.gameList.push(game);
          });
          for (let i = this.length; i < this.listNum; i += 1) {
            this.getViewers(this.gameList[i].name, i);
          }
          if (mounted) this.$store.commit('LOADING');
          this.observing = true;
        }, 500);
      }).catch((err) => {
        this.gameList.splice(this.listNum - 5);
        if (mounted) this.$store.commit('LOADING');
        this.$swal(err.response.data.message);
      });
    },
    getViewers(name, index) {
      const gameName = encodeURIComponent(name.toLowerCase());
      const api = ` https://api.twitch.tv/kraken/streams/summary?game=${gameName}`;
      this.$http.get(api, {
        headers: {
          Accept: 'application/vnd.twitchtv.v5+json',
          'Client-Id': process.env.VUE_APP_CLIENT_ID,
        },
      }).then((response) => {
        this.$set(this.gameList[index], 'viewers', response.data.viewers);
      });
    },
    onWaypoint({ going }) {
      if (going === this.$waypointMap.GOING_IN) {
        this.observing = false;
        this.getGameDirectory(false);
      }
    },
  },
};
</script>

<style lang="scss">
.game-directory-page{
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 10px;
  padding: 30px 0;
}
@media(max-width: 399px){
  .game-directory-page{
    grid-template-columns: repeat(auto-fill, minmax(125px, 0.5fr));
  }
}
</style>

<template>
  <div
    v-if="game.id"
    class="game-page"
  >
    <div class="game-info">
      <div class="img-box">
        <img
          :src="imgUrl"
          alt="遊戲圖片"
        >
      </div>
      <div>
        <h2>{{ game.name }}</h2>
        <p v-if="viewers">
          {{ viewersFilter }} 名觀眾
        </p>
      </div>
    </div>
    <router-link
      :to="{ name: 'GameStream', params: { name : gameName } }"
      class="btn"
    >
      Live頻道
    </router-link>
    <router-link
      :to="{ name: 'ClipList', params: { name : gameName } }"
      class="btn"
    >
      熱門剪輯
    </router-link>
    <router-view :game-id="game.id" />
  </div>
</template>

<script>
export default {
  props: {
    gameName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      game: {},
      viewers: 0,
    };
  },
  computed: {
    imgUrl() {
      return this.game.box_art_url.replace('{width}x{height}', '200x250');
    },
    viewersFilter() {
      const { viewers } = this;
      let num = viewers / 10000;
      num = num.toFixed(1);
      if (num >= 1 && num % 1 === 0) {
        num = parseInt(num, 10);
        num += '萬';
        return num;
      }
      if (num > 1) {
        num += '萬';
        return num;
      }
      return viewers.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    },
  },
  mounted() {
    this.getGame();
  },
  methods: {
    getGame() {
      const api = `https://api.twitch.tv/helix/games?name=${this.gameName}`;
      return this.$http.get(api, {
        headers: {
          Authorization: `Bearer ${process.env.VUE_APP_AUTHORIZATION}`,
          'Client-Id': process.env.VUE_APP_CLIENT_ID,
        },
      }).then((response) => {
        [this.game] = response.data.data;
        this.getViewers();
      }).catch(() => {
        this.$swal('發生錯誤，請重新整理');
      });
    },
    getViewers() {
      const name = this.gameName.toLowerCase();
      const api = ` https://api.twitch.tv/kraken/streams/summary?game=${name}`;
      return this.$http.get(api, {
        headers: {
          Accept: 'application/vnd.twitchtv.v5+json',
          'Client-Id': process.env.VUE_APP_CLIENT_ID,
        },
      }).then((response) => {
        this.viewers = response.data.viewers;
      });
    },
  },
};
</script>

<style lang="scss">
.game-page{
  max-width: 1440px;
  margin: 0 auto;
  padding: 50px 15px;
  .game-info{
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    font-weight: bold;
    .img-box{
      margin-right: 30px;
    }
    img{
      width: 100%;
      max-width: 200px;
    }
    h2{
      color: var(--font-color);
      font-size: 36px;
      margin-bottom: 1.5rem;
    }
    p{
      color: var(--second-font-color);
      font-size: 20px;
    }
  }
}
@media(max-width: 576px){
  .game-page{
    .game-info{
      .img-box{
        margin-right: 15px;
      }
      h2{
        font-size: 24px;
        margin-bottom: 1rem;
      }
      p{
        font-size: 18px;
      }
    }
  }
}
@media(max-width: 400px){
  .game-page{
    .game-info{
      text-align: center;
      flex-direction: column;
      img{
        margin: 0 0 15px 0;
      }
      h2{
        margin-bottom: 0.5rem;
      }
    }
  }
}
</style>

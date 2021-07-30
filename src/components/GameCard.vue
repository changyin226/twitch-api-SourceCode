<template>
  <div
    v-if="game.name"
    class="game-card-component"
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
    <div
      class="desc"
    >
      <h3>
        <router-link :to="{ name: 'GameStream', params: { name: gameName } }">
          {{ game.name }}
        </router-link>
      </h3>
      <small>觀眾人數：{{ viewersFilter }}</small>
    </div>
  </div>
  <GameCardLoading v-else />
</template>

<script>
import GameCardLoading from '@/components/GameCardLoading.vue';

export default {
  components: {
    GameCardLoading,
  },
  props: {
    game: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      imgShow: false,
    };
  },
  computed: {
    viewersFilter() {
      const { viewers } = this.game;
      if (!viewers) return '';
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
    gameName() {
      return encodeURIComponent(this.game.name);
    },
    imgUrl() {
      return this.game.box_art_url.replace('{width}x{height}', '285x380');
    },
  },
};
</script>

<style lang="scss">
.game-card-component{
  margin-bottom: 1rem;
  font-weight: bold;
  .img-box{
    display: block;
    position: relative;
    padding-top: 133.3%;
    img{
      position: absolute;
      top:0;
      width: 100%;
      transition: 0.3s;
      &:hover{
        transform: translate(5px, -5px);
        box-shadow:
          -1px 1px  #9147ff,
          -2px 2px  #9147ff,
          -3px 3px  #9147ff,
          -4px 4px  #9147ff,
          -5px 5px  #9147ff,
          -6px 6px  #9147ff,
      }
    }
  }
  .desc{
    margin-top: 0.5rem;
    h3{
      margin-bottom: 5px;
      a{
        display: block;
        color: var(--font-color);
        overflow : hidden;
        text-overflow : ellipsis;
        white-space : nowrap;
        &:hover{
          color: #a970ff;
        }
      }
    }
    small{
      color: var(--second-font-color);
      font-size: 14px;
    }
  }
}
</style>

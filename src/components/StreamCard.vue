<template>
  <div
    v-if="stream.user_name"
    class="stream-card-component"
  >
    <router-link
      v-slot="{ navigate }"
      class="preview"
      custom
      :to="{ name: 'Stream', params: { name: stream.user_login } }"
    >
      <div @click="navigate">
        <img
          :src="imgUrl"
          alt="遊戲截圖"
          @load="imgShow = true"
        >
        <div v-if="imgShow">
          <span
            class="viewers"
          >觀眾人數：{{ viewers }}</span>
          <span
            class="live"
          >{{ stream.type.toUpperCase() }}</span>
        </div>
      </div>
    </router-link>
    <div
      class="user-info"
    >
      <div class="logo">
        <img
          v-if="stream.logoUrl"
          :src="stream.logoUrl"
          alt="實況主照片"
        >
      </div>
      <div class="info">
        <h4>
          <router-link
            :to="{ name: 'Stream', params: { name: stream.user_login } }"
          >
            {{ stream.title }}
          </router-link>
        </h4>
        <h3>
          <router-link
            :to="{ name: 'Stream', params: { name: stream.user_login } }"
          >
            {{ stream.user_name }} ({{ stream.user_login }})
          </router-link>
        </h3>
        <h5 v-if="routeName === 'AllStream' && stream.game_name">
          <router-link
            :to="{ name: 'GameStream', params: { name: gameName } }"
          >
            {{ stream.game_name }}
          </router-link>
        </h5>
        <span
          v-for="tag in stream.tags"
          :key="tag"
          class="tag"
        >{{ tag }}</span>
        <span
          v-if="!stream.tags"
          style="height:18px; display: block;"
        />
      </div>
    </div>
  </div>
  <StreamCardLoading
    v-else
    :route-name="routeName"
  />
</template>

<script>
import StreamCardLoading from '@/components/StreamCardLoading.vue';

export default {
  components: {
    StreamCardLoading,
  },
  props: {
    stream: {
      type: Object,
      required: true,
    },
    routeName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      imgShow: false,
    };
  },
  computed: {
    imgUrl() {
      return this.stream.thumbnail_url.replace('{width}x{height}', '440x248');
    },
    viewers() {
      const viewers = this.stream.viewer_count;
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
      return encodeURIComponent(this.stream.game_name);
    },
  },
};
</script>

<style lang="scss">
.stream-card-component{
  margin-bottom: 1rem;
  .preview{
    padding-top: 56.4%;
    transition: 0.3s;
    position: relative;
    img{
      width: 100%;
      position: absolute;
      top:0;
    }
    .viewers{
      display: inline-block;
      color: #fff;
      padding: 4px 10px;
      font-size: 14px;
      border-radius: 5px;
      background: rgb(12, 12, 12, 0.8);
      position: absolute;
      bottom: 5%;
      left: 5%;
    }
    .live{
      display: inline-block;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
      padding: 3px 7px;
      border-radius: 5px;
      background: rgb(230, 24, 22);
      position: absolute;
      top: 5%;
      left: 5%;
    }
    &:hover{
      cursor: pointer;
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
  .user-info{
    display: flex;
    margin-top: 0.5rem;
    .logo{
      flex-shrink: 0;
      width: 40px;
      margin-right: 10px;
    }
    img{
      width: 100%;
      border-radius: 50%;
    }
  }
  .info{
    font-weight: bold;
    overflow: hidden;
    font-size: 14px;
    h4{
      margin-bottom: 0.3rem;
      a{
        color: var(--font-color);
      }
    }
    h3, h5{
      margin-bottom: 0.3rem;
      a{
        color: var(--second-font-color);
      }
    }
    a{
      display: block;
      overflow : hidden;
      text-overflow : ellipsis;
      white-space : nowrap;
      &:hover{
        color: #9147ff;
      }
    }
  }
}
</style>

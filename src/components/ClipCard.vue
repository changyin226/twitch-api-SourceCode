<template>
  <div
    v-if="clip.title"
    class="clip-card-component"
  >
    <router-link
      v-slot="{ navigate }"
      class="preview"
      custom
      :to="{ name: 'Clip', params: { name: clip.broadcaster.name, slug: clip.slug } }"
    >
      <div @click="navigate">
        <img
          :src="clip.thumbnails.medium"
          alt="遊戲截圖"
          @load="imgShow = true"
        >
        <div v-if="imgShow">
          <span
            class="views"
          >觀看次數：{{ views }}</span>
          <span
            class="duration"
          >{{ duration }}</span>
          <span
            class="date"
          >{{ diffTime }}</span>
        </div>
      </div>
    </router-link>
    <div
      class="user-info"
    >
      <img
        :src="clip.broadcaster.logo"
        alt="實況主照片"
      >
      <div class="info">
        <h4>
          <router-link
            :to="{ name: 'Clip', params: { name: clip.broadcaster.name, slug: clip.slug } }"
          >
            {{ clip.title }}
          </router-link>
        </h4>
        <h3>
          <router-link
            :to="{ name: 'Stream', params: { name: clip.broadcaster.name } }"
          >
            {{ clip.broadcaster.display_name }}
          </router-link>
        </h3>
        <span>剪輯者：{{ clip.curator.name }}</span>
      </div>
    </div>
  </div>
  <ClipCardLoading
    v-else
    :route-name="routeName"
  />
</template>

<script>
import ClipCardLoading from '@/components/StreamCardLoading.vue';

export default {
  components: {
    ClipCardLoading,
  },
  props: {
    clip: {
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
    views() {
      const { views } = this.clip;
      let num = views / 10000;
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
      return views.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    },
    duration() {
      let { duration } = this.clip;
      if (duration < 10) {
        duration = parseInt(duration, 10);
        return `0:0${duration}`;
      }
      duration = parseInt(duration, 10);
      return `0:${duration}`;
    },
    diffTime() {
      const createdAt = Date.parse(this.clip.created_at);
      const now = Date.parse(new Date());
      const usedTime = now - createdAt;
      const diff = Math.floor(usedTime / (24 * 3600 * 1000));
      return diff ? `${diff}天前` : `${Math.floor(usedTime / (3600 * 1000))}小時前`;
    },
  },
};
</script>

<style lang="scss">
.clip-card-component{
  margin-bottom: 1rem;
  .preview{
    padding-top: 56.7%;
    transition: 0.3s;
    position: relative;
    img{
      width: 100%;
      position: absolute;
      top:0;
    }
    .views, .duration, .date{
      display: inline-block;
      color: #fff;
      padding: 2px 5px;
      font-size: 14px;
      border-radius: 5px;
      background: rgb(12, 12, 12, 0.8);
      position: absolute;
    }
    .views{
      bottom: 12px;
      left: 12px;
    }
    .duration{
      top: 12px;
      left: 12px;
    }
    .date{
      bottom: 12px;
      right: 12px;
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
    img{
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
  .info{
    font-weight: bold;
    overflow: hidden;
    font-size: 14px;
    a{
      display: block;
      overflow : hidden;
      text-overflow : ellipsis;
      white-space : nowrap;
      &:hover{
        color: #9147ff;
      }
    }
    h3{
      margin-bottom: 0.3rem;
      a{
        color: var(--second-font-color);
      }
    }
    h4{
      margin-bottom: 0.3rem;
      a{
        color: var(--font-color);
      }
    }
    span{
      color: var(--second-font-color);
    }
  }
}
</style>

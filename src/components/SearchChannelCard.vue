<template>
  <div class="search-channel-card-component">
    <router-link
      :to="{ name: 'Stream', params: { name: channel.broadcaster_login } }"
      class="logo"
    >
      <img
        :src="channel.thumbnail_url"
        alt="頻道照片"
        @load="imgShow=true"
      >
      <span
        v-if="channel.is_live && imgShow"
        class="live"
      >
        LIVE
      </span>
    </router-link>
    <h3>
      <router-link
        :to="{name: 'Stream', params: { name: channel.broadcaster_login } }"
      >
        {{ channel.display_name }}
      </router-link>
    </h3>
  </div>
</template>

<script>
export default {
  props: {
    channel: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      imgShow: false,
    };
  },
};
</script>

<style lang="scss">
.search-channel-card-component{
  .logo{
    display: block;
    position: relative;
    padding-top: 100%;
    transition: 0.3s;
    img{
      width: 100%;
      border-radius: 100%;
      position: absolute;
      top:0;
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
      left: 50%;
      bottom: 0;
      transform: translateX(-50%);
    }
    &:hover{
      transform: scale(1.1, 1.1);
    }
  }
  h3{
    a{
      display: block;
      text-align: center;
      color: var(--font-color);
      overflow : hidden;
      text-overflow : ellipsis;
      white-space : nowrap;
      margin-top: 0.5rem;
      &:hover{
        color: #9147ff;
      }
    }
  }
}
</style>

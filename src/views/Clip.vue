<template>
  <div
    v-if="clip.broadcast_id"
    class="clip-page"
    :style="{ top: `${navHeight}px` }"
  >
    <iframe
      :src="`${clip.embed_url}&parent=changyin226.github.io&autoplay=true`"
      width="100%"
      height="100%"
      allowfullscreen="true"
    />
    <div
      class="clip-info"
    >
      <div class="user">
        <div class="user-logo">
          <router-link
            :to="{ name: 'Stream', params: { name: clip.broadcaster.name } }"
          >
            <img
              :src="clip.broadcaster.logo"
              alt="實況主logo"
            >
          </router-link>
          <span v-if="isLive">LIVE</span>
        </div>
        <div class="user-info">
          <h2>
            <router-link
              :to="{ name: 'Stream', params: { name: clip.broadcaster.name } }"
            >
              {{ clip.broadcaster.display_name }}
            </router-link>
            <i
              v-if="isPartner"
              class="fa fa-check"
            />
          </h2>
          <p v-if="isLive">
            正在實況
          </p>
          <P v-else>
            關台休息中
          </P>
        </div>
      </div>
      <div class="info">
        <h3>{{ clip.title }}</h3>
        <router-link :to="{ name: 'GameStream', params: { name: gameName } }">
          {{ clip.game }}
        </router-link>
        <span>clipped by {{ clip.curator.display_name }}</span>
      </div>
      <div class="views">
        <a
          v-if="clip.vod"
          :href="clip.vod.url"
          target="_blank"
        >觀看完整影片</a>
        <i class="fa fa-eye" />
        <span>{{ views }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    slug: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      clip: {},
      isLive: false,
      isPartner: false,
    };
  },
  computed: {
    views() {
      return this.clip.views.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    },
    gameName() {
      return encodeURIComponent(this.clip.game);
    },
    navHeight() {
      return this.$store.state.navHeight;
    },
  },
  mounted() {
    this.getClip();
  },
  methods: {
    getClip() {
      this.$store.commit('LOADING');
      const api = `https://api.twitch.tv/kraken/clips/${this.slug}`;
      this.$http.get(api, {
        headers: {
          Accept: 'application/vnd.twitchtv.v5+json',
          'Client-Id': process.env.VUE_APP_CLIENT_ID,
        },
      }).then((response) => {
        this.clip = response.data;
        return this.axios.all([this.getChannelInfo(), this.getStream()]);
      }).then((response) => {
        this.isPartner = response[0].data.partner;
        if (response[1].data.stream !== null) this.isLive = true;
        this.$store.commit('LOADING');
      }).catch((err) => {
        this.$store.commit('LOADING');
        this.$swal(err.message);
      });
    },
    getChannelInfo() {
      const api = `https://api.twitch.tv/kraken/channels/${this.clip.broadcaster.id}`;
      return this.$http.get(api, {
        headers: {
          Accept: 'application/vnd.twitchtv.v5+json',
          'Client-Id': process.env.VUE_APP_CLIENT_ID,
        },
      });
    },
    getStream() {
      const api = `https://api.twitch.tv/kraken/streams/${this.clip.broadcaster.id}`;
      return this.$http.get(api, {
        headers: {
          Accept: 'application/vnd.twitchtv.v5+json',
          'Client-Id': process.env.VUE_APP_CLIENT_ID,
        },
      });
    },
  },
};
</script>

<style lang="scss">
.clip-page{
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  .clip-info{
    display: flex;
    align-items: center;
    padding: 50px;
    color: var(--font-color);
  }
  .user{
    display: flex;
    align-items: center;
    margin-right: 15px;
  }
  .user-logo{
    position: relative;
    transition: 0.3s;
    &:hover{
      transform: scale(1.1, 1.1);
    }
    img{
      width: 72px;
      height: 72px;
      border: 3px solid #a970ff;
      border-radius: 50%;
    }
    span{
      display: inline-block;
      background: rgb(230, 24, 22);
      font-size: 12px;
      color: #fff;
      font-weight: bold;
      padding: 3px 5px;
      border: 2px solid #000;
      border-radius: 5px;
      position: absolute;
      left: 50%;
      bottom: 0;
      transform: translateX(-50%);
    }
  }
  .user-info{
    padding: 0 15px;
    h2{
      display: flex;
      font-weight: bold;
      align-items: center;
      margin-bottom: 0.5rem;
      font-size: 18px;
      i{
        display: block;
        font-size: 12px;
        color: #fff;
        padding: 2px;
        background: rgb(159, 101, 255);
        border-radius: 50%;
        margin-left: 5px;
      }
      a{
        color: rgb(159, 101, 255);
        &:hover{
          text-decoration: underline;
        }
      }
    }
  }
  .info{
    font-weight: bold;
    margin-right: auto;
    h3{
      font-size: 20px;
      margin-bottom: 0.5rem;
    }
    a{
      font-size: 18px;
      color: rgb(159, 101, 255);
      &:hover{
        text-decoration: underline;
      }
    }
  }
  .views{
    color: var(--font-color);
    a{
      display: inline-block;
      color: var(--font-color);
      font-size: 14px;
      margin-right: 20px;
      padding: 10px;
      border-radius: 5px;
      background-color: var(--view-btn-color);
      &:hover{
        background-color: var(--view-btn-hover-color);
      }
    }
    i{
      margin-right: 5px;
    }
  }
}
@media (max-width: 768px) {
  .clip-page{
    .clip-info{
      text-align: center;
      flex-direction: column;
      padding: 15px;
    }
    .user{
      margin: 0 0 8px 0;
    }
    .info{
      margin: 0 auto 5px auto;
      h3{
        font-size: 18px;
        margin-bottom: 5px;
      }
      a{
        font-size: 16px;
      }
    }
  }
}
</style>

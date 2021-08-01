<template>
  <div
    v-if="user.id"
    class="stream-page"
    :style="{ top: `${navHeight}px` }"
  >
    <div class="stream">
      <iframe
        :src="`https://player.twitch.tv/?channel=${name}&parent=changyin226.github.io`"
        allowfullscreen="true"
        width="100%"
        height="100%"
      />
      <div class="mx-30">
        <div class="stream-info">
          <div class="logo">
            <img
              :src="user.profile_image_url"
              alt="實況主logo"
            >
            <span v-if="isLive">LIVE</span>
          </div>
          <div class="info">
            <h2>
              {{ user.display_name }}
              <i
                v-if="isPartner"
                class="fa fa-check"
              />
            </h2>
            <h3 v-if="isLive">
              {{ stream.title }}
            </h3>
            <h3 v-else>
              該實況主目前尚未開台
            </h3>
            <div class="info-datail">
              <router-link
                v-if="isLive && stream.game_name"
                :to="{ name: 'GameStream', params: { name: gameName } }"
              >
                {{ stream.game_name }}
              </router-link>
              <p v-if="team.id">
                團隊：
                <router-link :to="{ name: 'Team', params: { name: team.team_name } }">
                  {{ team.team_display_name }}
                </router-link>
              </p>
              <span
                v-for="tag in tags"
                :key="tag"
                class="tag"
              >{{ tag }}</span>
            </div>
          </div>
          <div
            v-if="isLive"
            class="viewers"
          >
            <p>
              <i class="fa fa-user-o" />
              {{ viewers }}
            </p>
          </div>
        </div>
        <div class="desc">
          <h4>關於 {{ user.display_name }}</h4>
          <span>{{ followers }} 位追隨者</span>
          <p>{{ user.description }}</p>
        </div>
      </div>
    </div>
    <div class="chat">
      <iframe
        id="twitch-chat-embed"
        :key="theme"
        :src="`https://www.twitch.tv/embed/${name}/chat?parent=changyin226.github.io&${theme}`"
        width="100%"
        height="100%"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      stream: {},
      user: {},
      team: {},
      follows: 0,
      tags: [],
    };
  },
  computed: {
    theme() {
      const { isDarkMode } = this.$store.state;
      return isDarkMode ? 'darkpopout' : 'popout';
    },
    viewers() {
      return this.stream.viewer_count.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    },
    followers() {
      const { follows } = this;
      let num = follows / 10000;
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
      return follows.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    },
    isLive() {
      return !!this.stream;
    },
    isPartner() {
      return this.user.broadcaster_type === 'partner';
    },
    gameName() {
      return encodeURIComponent(this.stream.game_name);
    },
    navHeight() {
      return this.$store.state.navHeight;
    },
  },
  mounted() {
    this.$store.commit('LOADING');
    this.axios.all([this.getStream(), this.getUser()])
      .then((response) => {
        [this.stream] = response[0].data.data;
        [this.user] = response[1].data.data;
        return this.axios.all([this.getTeam(), this.getFollows(), this.getTags()]);
      }).then((response) => {
        if (response[0].data.data !== null) [this.team] = response[0].data.data;
        this.follows = response[1].data.total;
        const tags = [];
        response[2].data.data.forEach((tag) => {
          if (!tags.includes(tag.localization_names['zh-tw'])) {
            tags.push(tag.localization_names['zh-tw']);
          }
        });
        this.tags = tags;
        this.$store.commit('LOADING');
      }).catch((err) => {
        this.$store.commit('LOADING');
        this.$swal(err.response.data.message);
      });
  },
  methods: {
    getStream() {
      const api = `https://api.twitch.tv/helix/streams?user_login=${this.name}`;
      return this.$http.get(api, {
        headers: {
          Authorization: `Bearer ${process.env.VUE_APP_AUTHORIZATION}`,
          'Client-Id': process.env.VUE_APP_CLIENT_ID,
        },
      });
    },
    getUser() {
      const api = `https://api.twitch.tv/helix/users?login=${this.name}`;
      return this.$http.get(api, {
        headers: {
          Authorization: `Bearer ${process.env.VUE_APP_AUTHORIZATION}`,
          'Client-Id': process.env.VUE_APP_CLIENT_ID,
        },
      });
    },
    getTeam() {
      const api = `https://api.twitch.tv/helix/teams/channel?broadcaster_id=${this.user.id}`;
      return this.$http.get(api, {
        headers: {
          Authorization: `Bearer ${process.env.VUE_APP_AUTHORIZATION}`,
          'Client-Id': process.env.VUE_APP_CLIENT_ID,
        },
      });
    },
    getFollows() {
      const api = `https://api.twitch.tv/helix/users/follows?to_id=${this.user.id}`;
      return this.$http.get(api, {
        headers: {
          Authorization: `Bearer ${process.env.VUE_APP_AUTHORIZATION}`,
          'Client-Id': process.env.VUE_APP_CLIENT_ID,
        },
      });
    },
    getTags() {
      const api = `https://api.twitch.tv/helix/streams/tags?broadcaster_id=${this.user.id}`;
      return this.$http.get(api, {
        headers: {
          Authorization: `Bearer ${process.env.VUE_APP_AUTHORIZATION}`,
          'Client-Id': process.env.VUE_APP_CLIENT_ID,
        },
      });
    },
  },
};
</script>

<style lang="scss">
.stream-page{
  display: flex;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  .stream{
    width: 100%;
    color: var(--font-color);
    display: flex;
    flex-direction: column;
  }
  .mx-30{
    margin: 0 30px;
  }
  .stream-info{
    display: flex;
    align-items: center;
    padding: 30px 0;
  }
  .logo{
    position: relative;
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
      left: 16px;
      top: 55px;
    }
  }
  .info{
    font-weight: bold;
    margin-right: auto;
    padding: 0 15px;
    h2{
      display: flex;
      align-items: center;
      margin-bottom: 3px;
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
    }
    h3{
      font-size: 14px;
      line-height: 1.5;
      margin-bottom: 3px;
    }
  }
  .info-datail{
    display: flex;
    align-items: center;
    a{
      font-size: 14px;
      color: rgb(159, 101, 255);
      margin-right: 10px;
      &:hover{
        text-decoration: underline;
      }
    }
    p{
      font-size: 14px;
      margin-right: 10px;
    }
  }
  .viewers{
    flex-shrink: 0;
    color: rgb(255,119,117);
  }
  .desc{
    width: 100%;
    max-width: 1024px;
    margin: 0 auto 30px auto;
    padding: 30px;
    background-color: var(--desc-bg-color);
    text-align: center;
    h4{
      font-weight: bold;
      font-size: 24px;
      margin-bottom: 0.5rem;
    }
    span{
      display: block;
      font-size: 14px;
      margin-bottom: 1rem;
    }
    P{
      line-height: 1.2;
    }
  }
  .chat{
    width: 100%;
    max-width: 400px;
  }
}
@media (max-width: 768px) {
  .stream-page{
    flex-direction: column;
    .stream{
      height: 75%;
    }
    .stream-info{
      padding: 10px 0;
    }
    .desc{
      display: none;
    }
    .chat{
      max-width: 100%;
      height: 100%;
    }
  }
}
@media (max-width: 576px) {
  .stream-page{
    .mx-30{
      display: none;
    }
    .stream{
      height: 50%;
    }
  }
}
</style>

<template>
  <div
    v-if="team._id"
    class="team-page"
    :style="{'backgroundImage': `url(${team.background})`, height: `calc(100vh - ${navHeight}px)`}"
  >
    <div class="team">
      <div class="team-info">
        <div
          class="logo"
          :style="{backgroundImage: `url(${team.logo})`}"
        />
        <div class="num">
          <h2>
            團隊成員
          </h2>
          <span>{{ team.users.length }}</span>
        </div>
        <div class="list">
          <TeamListCard
            v-for="user in usersSort"
            :key="user.name"
            :user="user"
            :screen-width="screenWidth"
            @change-stream="streamName = $event"
          />
        </div>
      </div>
      <div
        v-if="screenWidth >= 768"
        class="team-stream"
      >
        <img
          v-if="team.banner"
          :src="team.banner"
          alt="團隊banner"
        >
        <div
          v-if="streamUrl"
          class="stream"
        >
          <iframe
            :key="streamName"
            :src="`https://player.twitch.tv/?channel=${streamUrl}&parent=changyin226.github.io`"
            allowfullscreen="true"
            width="100%"
            height="100%"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TeamListCard from '@/components/TeamListCard.vue';

export default {
  components: {
    TeamListCard,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      team: {},
      users: [],
      streamName: '',
      screenWidth: 0,
    };
  },
  computed: {
    usersSort() {
      const arr = Object.assign([], this.users);
      const sortArr = arr.sort((a, b) => (a.viewers <= b.viewers ? 1 : -1));
      return sortArr.filter((user) => user);
    },
    streamUrl() {
      if (this.streamName) return this.streamName;
      if (!this.streamName && this.usersSort[0]) return this.usersSort[0].name;
      return '';
    },
    navHeight() {
      return this.$store.state.navHeight;
    },
  },
  mounted() {
    this.screenWidth = window.innerWidth;
    this.getTeam();
  },
  methods: {
    getTeam() {
      this.$store.commit('LOADING');
      const api = `https://api.twitch.tv/kraken/teams/${this.name}`;
      this.$http.get(api, {
        headers: {
          Accept: 'application/vnd.twitchtv.v5+json',
          'Client-Id': process.env.VUE_APP_CLIENT_ID,
        },
      }).then((response) => {
        this.team = response.data;
        this.team.users.forEach((user, i) => {
          this.getUserInfo(user.name, user.display_name, user.logo, i);
        });
        this.$store.commit('LOADING');
      }).catch(() => {
        this.$store.commit('LOADING');
        this.$swal('發生錯誤，請重新整理');
      });
    },
    getUserInfo(name, displayName, logo, index) {
      const api = `https://api.twitch.tv/helix/streams?user_login=${name}`;
      this.$http.get(api, {
        headers: {
          Authorization: `Bearer ${process.env.VUE_APP_AUTHORIZATION}`,
          'Client-Id': process.env.VUE_APP_CLIENT_ID,
        },
      }).then((response) => {
        const resData = response.data.data[0];
        if (resData) {
          const obj = {
            name,
            display_name: displayName,
            viewers: resData.viewer_count,
            logo,
          };
          this.$set(this.users, index, obj);
        } else {
          const obj = {
            name,
            display_name: displayName,
            viewers: 0,
            logo,
          };
          this.$set(this.users, index, obj);
        }
      }).catch(() => {
        this.$swal('發生錯誤，請重新整理');
      });
    },
  },
};
</script>
<style lang="scss">
.team-page{
  padding: 30px;
  background-position: center;
  background-size: cover;
  .team{
    display: flex;
    max-width: 980px;
    margin: 0 auto;
    background-color: var(--team-bg-color);
    padding: 20px;
  }
  .team-info{
    margin-right: 20px;
  }
  .logo{
    width: 250px;
    height: 250px;
    margin-bottom: 20px;
    background-position: center;
    background-size: cover;
  }
  .num{
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--font-color);
    h2{
      font-size: 18px;
      font-weight: bold;
    }
    margin-bottom: 10px;
  }
  .list{
    height: 50vh;
    overflow: scroll;
    background-color: var(--teamList-bg-color);
    padding-bottom: 20px;
  }
  .team-stream{
    width: 100%;
    display: flex;
    flex-direction: column;
    img{
      width: 100%;
      height: auto;
      margin-bottom: 20px;
    }
    .stream{
      flex: 1;
    }
  }
}
@media (max-width: 767px) {
  .team-page{
    width: 85%;
    margin: 0 auto;;
    .team-info{
      width: 100%;
      margin: 0;
      .logo{
        margin: 0 auto 20px auto;
      }
    }
  }
}
@media (max-width: 576px) {
  .team-page{
    padding: 30px 15px;
    width: 100%;
  }
}

</style>

<template>
  <nav
    ref="nav"
    class="navigation-component"
  >
    <h1>
      <router-link to="/directory">
        Twitch Live Stream
      </router-link>
    </h1>
    <div class="search-container">
      <input
        v-model.trim="term"
        type="text"
        placeholder="搜尋"
        @keypress.enter="search"
      >
      <button
        type="button"
        class="search-btn"
        :class="{ 'not-allow': term === '' }"
        @click="search"
      >
        <i
          class="fa fa-search"
        />
      </button>
    </div>
    <div class="color-mode-toggle">
      <i
        class="fa fa-moon-o"
      />
      <span>深色模式</span>
      <div
        class="switch-container"
        :class="{'switch-container-on': isDarkMode}"
        @click="modeToggle"
      >
        <div
          class="switch"
          :class="{'switch-on': isDarkMode}"
        />
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      term: '',
    };
  },
  computed: {
    isDarkMode() {
      return this.$store.state.isDarkMode;
    },
  },
  mounted() {
    const { body } = document;
    const isDarkMode = JSON.parse(localStorage.getItem('isDarkMode')) || false;
    const lang = JSON.parse(localStorage.getItem('lang')) || 'all';
    const navHeight = this.$refs.nav.clientHeight + 1;
    this.$store.commit('DARKMODE', isDarkMode);
    this.$store.commit('LANG', lang);
    this.$store.commit('NAVHEIGHT', navHeight);
    if (this.isDarkMode) body.classList.add('dark-mode');
  },
  methods: {
    modeToggle() {
      const { body } = document;
      this.$store.commit('DARKMODE', !this.isDarkMode);
      if (this.isDarkMode) body.classList.add('dark-mode');
      else body.classList.remove('dark-mode');
      localStorage.setItem('isDarkMode', JSON.stringify(this.isDarkMode));
    },
    search() {
      if (!this.term || this.$route.query.term === this.term) {
        this.term = '';
        return;
      }
      const { search } = this.$store.state;
      this.$router.push(`/search/${search}?term=${this.term}`);
      this.term = '';
    },
  },
};
</script>
<style lang="scss">
.navigation-component{
  display: flex;
  width: 100%;
  background-color: var(--nav-bg-color);
  align-items: center;
  padding: 10px 15px;
  border-bottom: 1px solid var(--nav-border-bottom);
  h1{
    flex: 1;
    a{
      color: rgb(159, 101, 255);
      font-size: 24px;
      font-weight: bolder;
    }
  }
  .search-container{
    width: 100%;
    max-width: 500px;
    height: 36px;
    display: flex;
    flex: 1;
    input{
      width: calc(100% - 36px);
      height: 100%;
      font-size: initial;
      text-indent: 12px;
      border: none;
      outline: none;
      color: var(--font-color);
      background-color: var(--search-bg-color);
      appearance: none;
      border-radius: 0;
      border-bottom-left-radius: 5px;
      border-top-left-radius: 5px;
      margin-right: 1px;
      &:focus{
        border: 2px solid rgb(159, 101, 255);
        background-color: var(--search-bg-focus-color);
      }
      &::placeholder{
        color: var(--search-placeholder-color);
      }
    }
  }
  .search-btn{
    width: 36px;
    height: 100%;
    font-size: 20px;
    color: var(--search-btn-color);
    background-color: var(--search-btn-bg-color);
    border: none;
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
    padding: 0;
    &:hover{
      cursor: pointer;
      background-color: var(--search-btn-hover-bg-color);
    }
    &.not-allow{
      background-color: var(--search-btn-not-allow-bg-color);
      color: var(--search-btn-not-allow-color);
      &:hover{
        cursor: not-allowed;
      }
    }
  }
  .color-mode-toggle{
    display: flex;
    align-items: center;
    color: rgb(159, 101, 255);
    flex: 1;
    i{
      margin-left: auto;
      margin-right: 8px;
    }
    span{
      margin-right: 8px;
    }
    .switch-container {
      width: 32px;
      border-radius: 30px;
      background: rgb(228, 228, 228);
      transition: .3s;
      cursor: pointer;
    }
    .switch {
      background: rgb(159, 101, 255);
      height: 16px;
      width: 16px;
      border-radius: 50%;
      transition: .3s;
    }
    .switch-container-on{
      background: rgb(191, 146, 253);
    }
    .switch-on {
      margin-left: 16px;
    }
  }
}
@media (max-width: 691px) {
  .navigation-component{
    h1{
      a{
        font-size: 18px;
      }
    }
  }
}
@media (max-width: 525px) {
  .navigation-component{
    h1{
      a{
        font-size: 14px;
      }
    }
    .search-container{
      input{
        text-indent: 6px;
      }
      input::placeholder {
          font-size: 14px;
      }
    }
    .search-btn{
      font-size: 16px;
    }
    .color-mode-toggle{
      font-size: 12px;
    }
  }
}
@media (any-hover: hover){
  .navigation-component h1 a:hover{
      color: rgb(103, 35, 206);
  }
}
</style>

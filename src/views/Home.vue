<template>
  <div class="home-page">
    <h2>瀏覽</h2>
    <router-link
      to="/directory"
      class="btn"
    >
      分類
    </router-link>
    <router-link
      to="/directory/all"
      class="btn"
    >
      Live頻道
    </router-link>
    <router-view />
  </div>
</template>

<style lang="scss">
.home-page{
  max-width: 1440px;
  margin: 0 auto;
  padding: 50px 15px;
  h2{
    color: var(--font-color);
    font-weight: 700;
    font-size: 48px;
    margin-bottom: 30px;
  }
}
@media(max-width: 576px){
  .home-page{
    h2{
      font-size: 32px;
    }
  }
}
</style>

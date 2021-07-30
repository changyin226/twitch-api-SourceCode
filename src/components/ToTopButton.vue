<template>
  <div class="to-top-button-component">
    <transition name="fade">
      <button
        v-show="show"
        class="to-top-btn"
        type="button"
        @click="clickHandler"
      >
        <i
          class="fa fa-arrow-up"
        />
      </button>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
    };
  },
  mounted() {
    window.addEventListener('scroll', this.isShow);
  },
  methods: {
    clickHandler() {
      const intervalId = setInterval(() => {
        const distance = document.documentElement.scrollTop || document.body.scrollTop;
        if (distance === 0) clearInterval(intervalId);
        window.scroll(0, distance - 500);
      }, 10);
    },
    isShow() {
      const distance = document.documentElement.scrollTop || document.body.scrollTop;
      if (distance > window.innerHeight) this.show = true;
      else this.show = false;
    },
  },
};
</script>

<style lang="scss">
.to-top-button-component{
  .fade-enter-active, .fade-leave-active {
    transition: all 0.3s;
  }
  .fade-enter, .fade-leave-to{
    opacity: 0;
  }
  .to-top-btn{
    width: 50px;
    height: 50px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: rgb(159, 101, 255);
    position: fixed;
    right: 50px;
    bottom: 50px;
    z-index: 10;
    i{
      font-size: 36px;
      color: #fff;
    }
    &:hover{
      cursor: pointer;
    }
  }
}
@media(max-width: 576px) {
  .to-top-button-component{
    .to-top-btn{
      right: 30px;
      bottom: 30px;
    }
  }
}
</style>

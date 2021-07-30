<template>
  <div
    class="team-list-card-compontent"
    @click="clickHandler"
  >
    <img
      :src="user.logo"
      alt="實況主logo"
    >
    <h3>{{ user.display_name }}</h3>
    <div
      v-if="user.viewers"
      class="viewers"
    >
      <span class="dot" />
      <span>{{ viewers }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
    screenWidth: {
      type: Number,
      required: true,
    },
  },
  computed: {
    viewers() {
      return this.user.viewers.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    },
  },
  methods: {
    clickHandler() {
      if (this.screenWidth >= 768) this.$emit('change-stream', this.user.name);
      else this.$router.push({ name: 'Stream', params: { name: this.user.name } });
    },
  },
};
</script>

<style lang="scss">
.team-list-card-compontent{
  display: flex;
  align-items: center;
  padding: 10px;
  color: var(--font-color);
  font-size: 14px;
  img{
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 12px;
  }
  h3{
    margin-right: auto;
  }
  .viewers{
    display: flex;
    align-items: center;
    .dot{
      display: block;
      width: 8px;
      height: 8px;
      margin-right: 8px;
      background: red;
      border-radius: 50%;
    }
  }
  &:hover{
    cursor: pointer;
    background-color: var(--teamListCard-hover-bg);
  }
}
</style>

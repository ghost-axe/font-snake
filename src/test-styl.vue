<template>
  <div class="box">
    <div class="title">这个是stylus文件</div>
    <div class="content">江上形容吾独老，天边风俗自相亲。</div>
  </div>
</template>
<script>
  export default {
  }
</script>
<style lang="stylus" scoped>
  .box
    font-family: new-font
    background-color: $bgColor
  .title {
    color: red;
  }
</style>

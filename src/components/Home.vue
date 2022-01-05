<template>
  <div id="home">
    <div class="nav">
      <router-link to="/game/easy">Easy</router-link>
      <router-link to="/game/medium">Medium</router-link>
      <router-link to="/game/hard">Hard</router-link>
      <router-link to="/game/very-hard">Very Hard</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home"
}
</script>

<style>
.nav {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
}
.meme {
  display: flex;
  justify-content: center;
}
img {
  max-height: 300px;
}
</style>

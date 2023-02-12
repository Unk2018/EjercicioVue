<script>
import { RouterLink, RouterView } from 'vue-router'

export default {
  data() {
    return {
      drawer: null
    }
  },

  methods: {
    irHome: function () {
      this.$router.push("/");
      // console.log(this.$router.currentRoute.value.name)
    },
    irLogin: function () {
      this.$router.push("/login");
    }
  },

  // mounted(){
  //   if(this.$router.currentRoute._value.name == 'login'){
  //     this.checkIfLogin = true;
  //   }
  //   console.log(this.$router.currentRoute._value.name)
  // }
}
</script>

<template>
  <div class="wrapper">
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/lista">Lista</RouterLink>
    </nav>
  </div>

  <!-- RouterView muestra las vistas -->
  <RouterView />
</template>

<style>
@import url(./assets/css/general.css);
</style>

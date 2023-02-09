<script>
import { RouterLink, RouterView } from 'vue-router'

export default {
  data() {
    return {
      drawer: null,
      checkIfLogin: false
    }
  },

  methods: {
    irHome: function () {
      this.$router.push("/");
      this.checkIfLogin = false;
      // console.log(this.$router.currentRoute.value.name)
    },
    irLogin: function () {
      this.$router.push("/login");
      this.checkIfLogin = true;
    },
    irAbout: function () {
      this.$router.push("/about");
      this.ruta = this.$router;
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
  <v-toolbar color="blue-lighten-2" v-if="this.checkIfLogin == false">
    <v-app-bar-nav-icon @click.stop="drawer = !drawer" class="menuHide"></v-app-bar-nav-icon>
    <v-col lg="1" md="1" sm="2" cols="3" class="verySmall">
      <v-img src="./src/assets/img/logo.png" :aspect-ratio="1" @click="irHome">
      </v-img>
    </v-col>
    <v-toolbar-title class="text-white titleSmallScreen">Alexandria</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn icon="mdi-login" @click="irLogin"></v-btn>
    <v-btn icon="mdi-logout"></v-btn>
  </v-toolbar>

  <v-toolbar color="light-blue-lighten-2" v-if="this.checkIfLogin == true">
    <v-btn icon="mdi-arrow-left-thick" @click="irHome" color="white"></v-btn>
  </v-toolbar>

  <v-layout>
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list-item>
        <v-col cols="6">
          <v-img src="./src/assets/img/logo.png" :aspect-ratio="1">
          </v-img>
        </v-col>
      </v-list-item>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-home" title="Home" value="home" @click="irHome">
        </v-list-item>

        <v-list-item prepend-icon="mdi-information" title="About" value="about" @click="irAbout">
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-layout>

  <div class="wrapper">
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <RouterLink to="/lista">Lista</RouterLink>
    </nav>
  </div>

  <v-app>
    <RouterView />

    <v-footer class="bg-surface-variant">
      <v-container>
        <v-row class="text-center">
          <v-col cols="12" sm="3" md="3" lg="3">
            <h3>Información</h3>
            <p>
              Somos una empresa que aloja los productos de nuestros proveedores y
              le ofrecemos, a cambio, exposición a una gran variedad de clientes
            </p>
          </v-col>

          <v-col cols="12" sm="3" md="3" lg="3">
            <h3>Condiciones de uso</h3>
            <p>
              La navegación por este sitio web atribuye la condición de usuario a
              toda persona física interesada en los productos y servicios de esta página e implica la aceptación plena y
              sin reservas del presente aviso legal.
            </p>
          </v-col>

          <v-col cols="12" sm="3" md="3" lg="3">
            <h3>Contactos</h3>
            <p>
              <span class="me-1">
                <v-icon icon="mdi-map-marker"></v-icon>
              </span>
              Calle del Toro 14 6L
            </p>
            <p>
              <span class="me-1">
                <v-icon icon="mdi-phone"></v-icon>
              </span>
              123456789
            </p>
            <p>
              <span class="me-1">
                <v-icon icon="mdi-email"></v-icon>
              </span>
              Correo@hotmail.com
            </p>
          </v-col>

          <v-col cols="12" sm="3" md="3" lg="3">
            <h3>Síguenos</h3>
            <p>
              Facebook
              <span class="ms-1">
                <v-icon icon="mdi-facebook"></v-icon>
              </span>
            </p>
            <p>
              Twitter
              <span class="ms-1">
                <v-icon icon="mdi-twitter"></v-icon>
              </span>
            </p>
            <p>
              Youtube
              <span class="ms-1">
                <v-icon icon="mdi-youtube"></v-icon>
              </span>
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>

<style>
@import url(./assets/css/general.css);
</style>

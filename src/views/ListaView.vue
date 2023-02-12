<script>
import { defineComponent } from 'vue';

// Components
import Lista from '../components/Lista.vue';

export default defineComponent({
    name: 'ListaView',

    data() {
        return {
            drawer: null
        }
    },


    components: {
        Lista
    },

    methods: {
        irHome: function () {
            this.$router.push("/");
        },
        irLogin: function () {
            this.$router.push("/login");
        },
        irAbout: function () {
            this.$router.push("/about");
            this.ruta = this.$router;
        }
    },
});
</script>

<template>
    <!-- Muestra la barra de navegación y es responsive -->
    <v-toolbar color="blue-lighten-2">
        <!-- nav icon va a dejar hacer un desplegable. Añadimos el estilo de menuHide para que solo muestre
        cuando es pequeña la pantalla -->
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" class="menuHide"></v-app-bar-nav-icon>
        <v-col lg="1" md="1" sm="2" cols="3" class="verySmall">
            <v-img src="./src/assets/img/logo.png" :aspect-ratio="1" @click="irHome">
            </v-img>
        </v-col>
        <v-toolbar-title class="text-white titleSmallScreen">Alexandria</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon="mdi-login" @click="irLogin"></v-btn>
    </v-toolbar>

    <!-- Barra desplegable -->
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

                <v-list-item color="red" prepend-icon="mdi-logout" title="Cerrar sesión" value="logout" @click="">
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
    </v-layout>

    <!-- Hay que añadirlo en una v-app para que permita el footer -->
    <v-app>
        <Lista />

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
                            toda persona física interesada en los productos y servicios de esta página e implica la
                            aceptación plena y
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

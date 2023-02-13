<script>
import { defineComponent } from 'vue';

// Components
import Lista from '../components/Lista.vue';

export default defineComponent({
    name: 'ListaView',

    data() {
        return {
            drawer: null,
            logged: false,
            usuario: '',

            // Datos para usuario (registro y login)
            openRequest: null,
            db: null,
        }
    },


    components: {
        Lista
    },

    methods: {
        irLogin: function () {
            this.$router.push("/login");
        },
        irLista: function () {
            this.$router.push("/");
        },

        logout: function () {
            localStorage.removeItem('usuario');
            this.$router.push("/login");
        },

        iniciarBD: function (db) {
            let store;

            try {
                this.openRequest.onupgradeneeded = e => {
                    // se dispara si el cliente no tiene la base de datos
                    db = this.openRequest.result;
                    switch (
                    event.oldVersion // versión de db existente
                    ) {
                        case 0:
                            // version 0 significa que el cliente no tiene base de datos
                            // ejecutar inicialización
                            db = this.openRequest.result;
                            if (!db.objectStoreNames.contains("usuarios")) {
                                // si no hay un almacén de usuarios

                                store = db.createObjectStore("usuarios", {
                                    autoIncrement: true,
                                    keyPath: "id"
                                });
                                store.createIndex("nombre", "nombre", {
                                    unique: false,
                                });
                                store.createIndex("clave", "clave", {
                                    unique: false,
                                });

                                console.info("creamos usuarios!");
                            } else {
                                console.info("tenemos usuarios!");
                            }

                            if (!db.objectStoreNames.contains("productos")) {
                                store = db.createObjectStore("productos", {
                                    autoIncrement: true,
                                    keyPath: "id"
                                });
                                store.createIndex("nombre", "nombre", {
                                    unique: false,
                                });
                                store.createIndex("coste", "coste", {
                                    unique: false,
                                });
                                store.createIndex("cantidad", "cantidad", {
                                    unique: false,
                                });
                                store.createIndex("usuario", "usuario", {
                                    unique: false,
                                });

                                console.info("creamos productos!");
                            } else {
                                console.info("tenemos productos!");
                            }
                            break;

                        // En el caso de una tabla que ya existe
                        case 1:
                            // el cliente tiene la versión 1
                            // actualizar
                            //let deleteRequest = indexedDB.deleteDatabase(name)
                            //db.deleteObjectStore('usuarios')
                            break;

                        default:
                            console.info("Acción default iniciarBD");
                            break;
                    }
                };
            } catch (error) {
                console.error(error);
            }
        },
    },

    mounted() {
        var objectStore;
        var cursor;

        try {
            this.openRequest = window.indexedDB.open("idbdwec", 1);

            // Crea tabla si no existe
            this.iniciarBD(this.db);

            // Cuando se crea la base de datos te dice si lo ha conseguido o no
            this.openRequest.onerror = e => {
                console.error("Error", e);
            };

            this.openRequest.onsuccess = e => {
                this.db = e.target.result;

                objectStore = this.db.transaction("usuarios").objectStore("usuarios");

                // Si existe un dato usuario (cookie)
                if (localStorage.getItem('usuario')) {
                    // Abre los datos obtenidos. Cuando lo hace correctamente, recorrerá los datos
                    objectStore.openCursor().onsuccess = (event) => {
                        cursor = event.target.result;

                        // Si hay datos
                        if (cursor) {
                            // En el caso de que exista nombre y clave (son iguales)
                            if (cursor.value.nombre == JSON.parse(localStorage.getItem('usuario'))[0] &&
                                cursor.value.clave == JSON.parse(localStorage.getItem('usuario'))[1]) {
                                this.logged = true;
                                this.usuario = JSON.parse(localStorage.getItem('usuario'))[0]
                            } else {
                                cursor.continue();
                            }
                        }
                    }
                }
            };
        } catch (error) {
            console.log(error);
        }
    }
});
</script>

<template>
    <!-- Muestra la barra de navegación y es responsive -->
    <v-toolbar color="blue-lighten-2">
        <!-- nav icon va a dejar hacer un desplegable. Añadimos el estilo de menuHide para que solo muestre
        cuando es pequeña la pantalla -->
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" class="menuHide"></v-app-bar-nav-icon>
        <v-col lg="1" md="1" sm="2" cols="3" class="verySmall">
            <v-img src="./src/assets/img/logo.png" :aspect-ratio="1" @click="irLista">
            </v-img>
        </v-col>
        <v-toolbar-title class="text-white titleSmallScreen">Alexandria</v-toolbar-title>

        <v-spacer></v-spacer>

        <div v-if="this.logged == false" class="me-5">
            <v-btn icon="mdi-login" @click="irLogin"></v-btn>
        </div>

        <div v-else-if="this.logged == true" class="me-5 d-flex">
            <div class="text-h6 mt-2 me-5 usuario">{{ this.usuario }}</div>
            <v-btn icon="mdi-logout" color="red" class="bg-white" @click="logout">
            </v-btn>
        </div>
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

            <div v-if="this.logged == true" class="text-right">
                <div class="text-body-1 mt-2 me-5 mb-4">{{ this.usuario }}</div>
            </div>

            <v-divider></v-divider>

            <v-list density="compact" nav>
                <v-list-item prepend-icon="mdi-home" title="Home" value="home" @click="irLista">
                </v-list-item>


                <v-list-item color="blue" active prepend-icon="mdi-login" title="Iniciar sesión" value="login"
                    v-if="this.logged == false" @click="irLogin">
                </v-list-item>

                <v-list-item color="red" active prepend-icon="mdi-logout" title="Cerrar sesión" value="logout"
                    v-else-if="this.logged == true" @click="logout">
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

<script>
import { RouterLink, RouterView } from 'vue-router'

export default {
  data() {
    return {
      drawer: null,
      openRequest: null,
      db: null,
    }
  },

  methods: {
    irHome: function () {
      this.$router.push("/");
    },

    irLogin: function () {
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
                  keyPath: "id",
                  autoIncrement: true
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
                  keyPath: "id",
                  autoIncrement: true
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
    }
  },

  // Crea la base de datos al iniciarse (es una base de datos local)
  mounted() {
    this.openRequest = window.indexedDB.open("idbdwec", 1);

    // Crea tabla si no existe
    this.iniciarBD(this.db);

    // Cuando se crea la base de datos te dice si lo ha conseguido o no
    this.openRequest.onerror = e => {
      console.error("Error", e);
    };

    this.openRequest.onsuccess = e => {
      this.db = e.target.result;
      // continúa trabajando con la base de datos usando el objeto db
      console.info("tenemos bd!");
    };
  }
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

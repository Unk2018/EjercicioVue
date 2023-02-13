<script>
export default {
    // Datos
    data() {
        return {
            email: '',
            password: '',
            loginBtn: true,

            // Comprobadores del register
            emailWatch: false,
            passWatch: false,
            btnAction: true,

            // Datos para usuario (registro y login)
            openRequest: null,
            db: null,

            loginError: false,
            registerError: false,

            // Rules
            emailRules: [
                value => {
                    if (this.registerError == true) {
                        this.emailWatch = false;
                        return 'El usuario a registrar ya existe.';
                    } else if (/.+@.+\..+/.test(value)) {
                        this.emailWatch = true;
                        return true;
                    } else {
                        this.emailWatch = false;
                        return 'E-mail debe ser válido.';
                    }
                }
            ],
            passRules: [
                value => {
                    if (this.loginError == true) {
                        this.passWatch = false;
                        return 'El usuario a iniciar sesión no existe o la contraseña es incorrecta.';
                    } else if (value.length < 16 && value.length > 3) {
                        this.passWatch = true;
                        return true;
                    } else {
                        this.passWatch = false;
                        return 'Asegúrate que la contraseña tenga una longitud mayor de 3 y menor de 16.';
                    }
                }
            ],
        }
    },

    methods: {
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

        registrarUsuario: function (nombre, clave) {
            // Da los permisos
            let usuarios = this.db.transaction("usuarios", "readwrite").objectStore("usuarios");
            let usuario = null;
            let request = null;

            try {
                // Crear usuario
                usuario = {
                    nombre: nombre,
                    clave: clave,
                };

                // Si los datos no son vacíos
                if (this.emailWatch == true && this.passWatch == true) {
                    // Añadir usuario
                    request = usuarios.add(usuario); // (3)

                    request.onsuccess = () => {
                        // Cuando se introduce correctamente(4)
                        console.log("Usuario agregado", request.result);

                        this.email = ''
                        this.password = ''
                        this.registerError = false;
                        this.loginBtn = true;
                    };

                    request.onerror = () => {
                        console.error("Hay un error", request.error);
                    };
                }
            } catch (error) {
                console.error(error);
            }
        },

        comprobarUsuario: function (nombre, clave) {
            // Abre usuarios y guarda sus datos
            var objectStore = this.db.transaction("usuarios").objectStore("usuarios");
            var cursor;
            var logged = false;

            try {
                // Abre los datos obtenidos. Cuando lo hace correctamente, recorrerá los datos
                objectStore.openCursor().onsuccess = (event) => {
                    cursor = event.target.result;

                    // Si hay datos
                    if (cursor) {
                        if (cursor.value.nombre == nombre) {
                            logged = true;
                            cursor.continue();
                        } else {
                            cursor.continue();
                        }

                        // Cuando termina
                    } else {
                        // Si es true, entonces usuario existe
                        if (logged == true) {
                            this.email = ''
                            this.password = ''
                            this.registerError = true;
                            console.log("Ya existe el usuario a registrar")
                        } else {
                            this.registrarUsuario(nombre, clave);
                        }
                    }
                }
            } catch (error) {
                console.error(error);
            }
        },

        loginUsuario: function (nombre, clave) {
            // Abre usuarios y guarda sus datos
            var objectStore = this.db.transaction("usuarios").objectStore("usuarios");
            var cursor;
            var logged = false;
            var usuario = [nombre, clave];
            var parsed = null;

            try {
                // Abre los datos obtenidos. Cuando lo hace correctamente, recorrerá los datos
                objectStore.openCursor().onsuccess = (event) => {
                    cursor = event.target.result;

                    // Si hay datos
                    if (cursor) {
                        if (cursor.value.nombre == nombre && cursor.value.clave == clave) {
                            logged = true;
                            cursor.continue();
                        } else {
                            cursor.continue();
                        }

                        // Cuando termina
                    } else {
                        // Si es true, entonces significa que ha iniciado sesión correctamente
                        if (logged == true) {
                            console.log("Se ha logueado correctamente");
                            parsed = JSON.stringify(usuario);
                            localStorage.setItem('usuario', parsed);
                            this.$router.push("/");
                        } else {
                            this.password = '';
                            this.loginError = true;
                            console.log("No existe el usuario a loguear")
                        }
                    }
                }
            } catch (error) {
                console.error(error);
            }
        },

        // Desactiva/activa los botones del login y register
        comprobarReg: function () {
            try {
                if (this.emailWatch == true && this.passWatch == true) {
                    this.btnAction = false;
                } else {
                    this.btnAction = true;
                }
            } catch (error) {
                console.error(error);
            }
        }
    },

    // Oculta errores cuando pasa a register/login
    watch: {
        // Hace un reset a los valores al cambiar de formulario
        loginBtn: function (value) {
            if (value == true) {
                this.email = '';
                this.password = '';
                this.registerError = false;
                this.emailWatch = false;
                this.passWatch = false;
                this.btnAction = true;
            } else {
                this.email = '';
                this.password = '';
                this.loginError = false;
                this.emailWatch = false;
                this.passWatch = false;
                this.btnAction = true;
            }
        },

        emailWatch: function () {
            this.comprobarReg();
        },

        passWatch: function () {
            this.comprobarReg();
        },

        email: function (value) {
            if (value != '') {
                this.registerError = false;
            }
        },

        // Para dejar de mostrar el error del
        password: function (value) {
            if (value != '') {
                this.loginError = false;
            }
        }
    },

    // Crea la base de datos al iniciarse (es una base de datos local)
    mounted() {
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
                // continúa trabajando con la base de datos usando el objeto db
                console.info("tenemos bd!");
            };
        } catch (error) {
            console.error(error);
        }
    }
}
</script>

<template>
    <v-app class="bg-light-blue-lighten-3">
        <v-container>
            <v-sheet class="mx-auto bg-white pa-10 ma-15 bordeLogin" max-width="344" rounded>
                <div v-if="this.loginBtn == true">
                    <h1 class="text-center mb-5">
                        <v-icon>mdi-account-check</v-icon>
                        Iniciar sesión
                    </h1>

                    <v-text-field type="email" v-model="email" class="mb-2" prepend-inner-icon="mdi-account"
                        label="Email" :rules="emailRules">
                    </v-text-field>
                    <v-text-field type="text" v-model="password" prepend-inner-icon="mdi-lock" label="Contraseña"
                        placeholder="Introduce tu contraseña" :rules="passRules">
                    </v-text-field>

                    <v-btn color="success" prepend-icon="mdi-login" type="submit" block class="mt-2"
                        @click="loginUsuario(this.email, this.password)" :disabled="btnAction">Login</v-btn>

                    <v-btn variant="tonal" class="bg-white mt-2" type="submit" block @click="this.loginBtn = false">
                        Registrar cuenta
                    </v-btn>
                </div>

                <div v-else-if="this.loginBtn == false">
                    <h2 class="text-center mb-5">
                        <v-icon>mdi-account-plus</v-icon>
                        Registrar cuenta
                    </h2>

                    <v-text-field type="text" v-model="email" class="mb-2" prepend-inner-icon="mdi-account"
                        label="Email" :rules="emailRules">
                    </v-text-field>
                    <v-text-field type="text" v-model="password" prepend-inner-icon="mdi-lock" label="Contraseña"
                        placeholder="Introduce tu contraseña" :rules="passRules">
                    </v-text-field>

                    <v-btn color="success" type="submit" block class="mt-2"
                        @click="comprobarUsuario(this.email, this.password)" :disabled="btnAction">
                        Registrarse
                    </v-btn>

                    <v-btn variant="tonal" class="bg-white mt-2" type="submit" block @click="this.loginBtn = true">
                        Ir a login
                    </v-btn>
                </div>
            </v-sheet>
        </v-container>
    </v-app>
</template>
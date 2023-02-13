<script>
export default {
    // Datos
    data() {
        return {
            // Relacionado a BD y mostrar lista
            idSelect: '',
            producto: '',
            coste: '',
            cantidad: '',
            usuario: '',
            lista: [],

            // Buscador
            buscador: '',
            listaBuscador: [],
            useBuscador: false,

            // Estado de los botones
            editing: false,

            // Estado de la sesión
            logged: false,

            // Iniciar BD
            db: null,

            // Carousel
            enlaces: ["./src/assets/img/prod1.jpg", "./src/assets/img/prod2.jpg",
                "./src/assets/img/prod3.jpg"],
        }
    },

    methods: {
        mostrarProductos: function () {
            // Abre usuarios y guarda sus datos
            var objectStore = this.db.transaction("productos").objectStore("productos");
            var cursor;

            var costeDouble;
            var cantidadInt;

            try {
                // Vacía la lista para introducir todas las existentes de la base de datos
                this.lista = [];

                // Abre los datos obtenidos. Cuando lo hace correctamente, recorrerá los datos
                objectStore.openCursor().onsuccess = (event) => {
                    cursor = event.target.result;

                    // Si hay datos
                    if (cursor) {
                        costeDouble = parseFloat(cursor.value.coste).toFixed(2);
                        cantidadInt = parseFloat(cursor.value.cantidad).toFixed(2);

                        // Introduce datos a la lista
                        this.lista.push([
                            cursor.value.nombre,
                            costeDouble,
                            parseInt(cantidadInt),
                            cursor.value.usuario]);
                        cursor.continue();
                    }
                }
            } catch (error) {
                console.error(error);
            }
        },

        mostrarProductosUser: function () {
            // Abre usuarios y guarda sus datos
            var objectStore = this.db.transaction("productos").objectStore("productos");
            var cursor;

            var costeDouble = parseFloat(this.coste).toFixed(2);
            var cantidadInt = parseFloat(this.cantidad).toFixed(0);

            try {
                // Vacía la lista para introducir todas las existentes de la base de datos
                this.lista = [];

                // Abre los datos obtenidos. Cuando lo hace correctamente, recorrerá los datos
                objectStore.openCursor().onsuccess = (event) => {
                    cursor = event.target.result;

                    // Si hay datos
                    if (cursor) {
                        if (cursor.value.usuario == this.usuario) {
                            costeDouble = parseFloat(cursor.value.coste).toFixed(2);
                            cantidadInt = parseFloat(cursor.value.cantidad).toFixed(2);

                            // Introduce datos a la lista
                            // En el caso de usuarios, se guarda en la última la id del producto
                            this.lista.push([
                                cursor.value.nombre,
                                costeDouble,
                                parseInt(cantidadInt),
                                cursor.value.id]);
                        }
                        cursor.continue();
                    } else {
                        this.filtrarBuscador(this.buscador);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        },

        guardar: function () {
            var buscarLista = [];
            var costeDouble = parseFloat(this.coste).toFixed(2);
            var cantidadInt = parseFloat(this.cantidad).toFixed(0);

            // BD productos
            let productos = this.db.transaction("productos", "readwrite").objectStore("productos");
            let producto = null;
            let request = null;


            try {
                // Mira que producto y coste no sea vacío. Mira que el coste y cantidad es mayor de 0
                if (this.producto != '' && this.coste != '' && costeDouble > 0 && cantidadInt > 0) {
                    // Mira si existe uno anteriormente
                    buscarLista =
                        this.lista.filter(ind => ind[0] == this.producto);

                    if (buscarLista.length != 0) {
                        console.log("El producto introducido ya existe ya");
                        this.comprobarBD();
                    } else {
                        try {
                            // Crear usuario
                            producto = {
                                nombre: this.producto,
                                coste: costeDouble,
                                cantidad: parseInt(cantidadInt),
                                usuario: this.usuario
                            };

                            // Añadir producto
                            request = productos.add(producto); // (3)

                            request.onsuccess = () => {
                                // Cuando se introduce correctamente(4)
                                console.log("Producto agregado", request.result);
                                this.mostrarProductosUser();
                            };

                            request.onerror = () => {
                                console.error("Hay un error", request.error);
                            };
                        } catch (error) {
                            console.error(error);
                        }

                        this.producto = '';
                        this.coste = '';
                        this.cantidad = '';
                    }
                } else {
                    console.log("Hay campos inválidos. Asegúrate de que productos no esté vacío y que el " +
                        "coste y la cantidad sea mayor a 0");
                }
            } catch (e) {
                console.error(e);
            }
        },

        comprobarBD: function () {
            // Abre usuarios y guarda sus datos
            var objectStore = this.db.transaction("productos").objectStore("productos");
            var cursor;

            try {
                // Abre los datos obtenidos. Cuando lo hace correctamente, recorrerá los datos
                objectStore.openCursor().onsuccess = (event) => {
                    cursor = event.target.result;

                    // Si hay datos
                    if (cursor) {
                        // Si encuentra el producto
                        if (cursor.value.usuario == this.usuario && cursor.value.nombre == this.producto) {
                            this.sumarCantidad(cursor.value.id, cursor.value.cantidad);
                        }
                        cursor.continue();
                    } else {
                        this.filtrarBuscador(this.buscador);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        },

        // Suma al producto existente la cantidad añadida
        sumarCantidad: function (id, cantidad) {
            var objectStore = this.db
                .transaction("productos", "readwrite")
                .objectStore("productos");
            var request;
            var data;
            var requestUpdate;

            var costeDouble = parseFloat(this.coste).toFixed(2);
            var cantidadInt = parseFloat(this.cantidad).toFixed(0);

            try {
                // Comprueba que esté bien validado antes de introducir los datos
                if (costeDouble > 0 && cantidadInt > 0 && this.producto != '') {
                    // Coge el objeto de la id indicada
                    request = objectStore.get(id);

                    request.onerror = (event) => {
                        // Handle errors!
                        console.info("Se ha producido un error!");

                        // Vacía los campos y deja de editar
                        this.idSelect = '';
                        this.producto = '';
                        this.coste = '';
                        this.cantidad = '';
                        this.editing = false;
                    };

                    // En el caso de que consigue los datos de la id indicada
                    request.onsuccess = (event) => {
                        // Coge los antiguos valores del dato correspondiente
                        data = request.result;

                        // Define los nuevos valores del dato seleccionado
                        data.nombre = this.producto;
                        data.coste = costeDouble;
                        data.cantidad = parseInt(cantidadInt) + parseInt(cantidad);
                        data.usuario = this.usuario;

                        // Actualiza los datos por unos nuevos
                        requestUpdate = objectStore.put(data);

                        requestUpdate.onerror = () => {
                            // Hubo un error a la hora de actualizar los datos
                            console.info("no se puede modificar");

                            // Vacía los campos y deja de editar
                            this.idSelect = '';
                            this.producto = '';
                            this.coste = '';
                            this.cantidad = '';
                            this.editing = false;
                        };

                        requestUpdate.onsuccess = (event) => {
                            // Cuando se ha actualizado correctamente
                            console.info("modificado!");

                            // Vacía los campos y deja de editar
                            this.idSelect = '';
                            this.producto = '';
                            this.coste = '';
                            this.cantidad = '';
                            this.editing = false;

                            this.mostrarProductosUser();
                        };
                    };
                }
            } catch (error) {
                console.error(error);
            }
        },

        // Eliminar la base de datos
        borrar: function (id) {
            var request;

            try {
                // Elimina el dato indicado por la id. Solo funciona si la id es un string.
                request = this.db
                    .transaction("productos", "readwrite")
                    .objectStore("productos")
                    .delete(id);

                // En el caso de que funciona
                request.onsuccess = () => {
                    // Eliminado correctamente
                    console.info("Eliminado");

                    // Listado actual
                    this.mostrarProductosUser();
                };
            } catch (error) {
                console.error(error);
            }
        },

        activateEdit: function (id, producto, coste, cantidad) {
            this.idSelect = id;
            this.producto = producto;
            this.coste = coste;
            this.cantidad = cantidad;
            this.editing = true;
        },

        // Modificar los datos
        editar: function () {
            var objectStore = this.db
                .transaction("productos", "readwrite")
                .objectStore("productos");
            var request;
            var data;
            var requestUpdate;

            var costeDouble = parseFloat(this.coste).toFixed(2);
            var cantidadInt = parseFloat(this.cantidad).toFixed(0);

            try {
                // Comprueba que esté bien validado antes de introducir los datos
                if (costeDouble > 0 && cantidadInt > 0 && this.producto != '') {
                    // Coge el objeto de la id indicada
                    request = objectStore.get(this.idSelect);

                    request.onerror = (event) => {
                        // Handle errors!
                        console.info("Se ha producido un error!");

                        // Vacía los campos y deja de editar
                        this.idSelect = '';
                        this.producto = '';
                        this.coste = '';
                        this.cantidad = '';
                        this.editing = false;
                    };

                    // En el caso de que consigue los datos de la id indicada
                    request.onsuccess = (event) => {
                        // Coge los antiguos valores del dato correspondiente
                        data = request.result;

                        // Define los nuevos valores del dato seleccionado
                        data.nombre = this.producto;
                        data.coste = costeDouble;
                        data.cantidad = parseInt(cantidadInt);
                        data.usuario = this.usuario;

                        // Actualiza los datos por unos nuevos
                        requestUpdate = objectStore.put(data);

                        requestUpdate.onerror = () => {
                            // Hubo un error a la hora de actualizar los datos
                            console.info("no se puede modificar");

                            // Vacía los campos y deja de editar
                            this.idSelect = '';
                            this.producto = '';
                            this.coste = '';
                            this.cantidad = '';
                            this.editing = false;
                        };

                        requestUpdate.onsuccess = (event) => {
                            // Cuando se ha actualizado correctamente
                            console.info("modificado!");

                            // Vacía los campos y deja de editar
                            this.idSelect = '';
                            this.producto = '';
                            this.coste = '';
                            this.cantidad = '';
                            this.editing = false;

                            this.mostrarProductosUser();
                        };
                    };
                }
            } catch (error) {
                console.error(error);
            }
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

        filtrarBuscador: function (valorBuscar) {
            // Pone solo en la lista del buscador el valor introducido (lo filtra)
            this.listaBuscador = this.lista.filter(producto => producto[0].indexOf(valorBuscar) != -1);
        },
    },

    watch: {
        // Mira a ver si ha cambiado el valor del buscador. Si ha cambiado, entonces solo muestra 
        // la tabla del buscador. Si no, entonces muestra toda la tabla
        buscador: function (value) {
            if (value != '') {
                this.filtrarBuscador(value);
                this.useBuscador = true;
            } else {
                this.useBuscador = false;
            }
        }
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
                                this.mostrarProductosUser();
                            } else {
                                cursor.continue();
                            }
                        }
                    }
                } else {
                    this.mostrarProductos();
                }
            };
        } catch (error) {
            console.log(error);
        }
    }
}
</script>

<template>
    <v-sheet v-if="this.logged == false" no-gutters class="mb-5">
        <v-carousel hide-delimiters>
            <v-carousel-item v-for="enlace in enlaces" :key="enlace" :src="enlace" cover>
            </v-carousel-item>
        </v-carousel>
    </v-sheet>

    <v-container class="mt-3">
        <v-sheet v-if="this.logged == true" class="mx-auto bg-blue-grey-lighten-5 pa-10" max-width="344">

            <h1 class="text-center mb-5">Productos</h1>

            <v-text-field type="text" v-model="producto" prepend-inner-icon="mdi-basket-plus" label="Producto">
            </v-text-field>
            <v-text-field type="number" v-model="coste" prepend-inner-icon="mdi-currency-eur" label="Coste">
            </v-text-field>
            <v-text-field type="number" v-model="cantidad" prepend-inner-icon="mdi-counter" label="Cantidad">
            </v-text-field>

            <v-btn v-if="!this.editing" color="blue-darken-1" type="submit" block class="mt-2"
                @click="guardar">Guardar</v-btn>
            <v-btn v-if="this.editing" color="yellow-lighten-1" type="submit" block class="mt-2"
                @click="editar">Editar</v-btn>
        </v-sheet>

        <div v-else-if="this.logged == false" class="mt-3 mb-3">
            <h1 class="text-center mb-4">Compra donde tu quieras, a donde tú quieras</h1>
            <h2 class="text-center">Lista de productos</h2>
        </div>
    </v-container>

    <v-row no-gutters class="mt-5 mb-5">
        <v-col cols="0" sm="1" md="2" lg="2">
        </v-col>

        <v-col cols="12" sm="10" md="8" lg="8">

            <v-sheet class="mx-auto" max-width="344">
                <v-text-field type="text" placeholder="Nombre del producto" prepend-inner-icon="mdi-magnify"
                    v-model="buscador" label="Buscar producto...">
                </v-text-field>
            </v-sheet>

            <v-table class="mt-2 mb-5">
                <thead>
                    <tr>
                        <th class="text-center">
                            #
                        </th>
                        <th class="text-center">
                            Productos
                        </th>
                        <th class="text-center">
                            Coste
                        </th>
                        <th class="text-center">
                            Cantidad
                        </th>
                        <!-- Solo muestra si no está logueado -->
                        <th v-if="this.logged == false" class="text-center">
                            Usuario
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <!-- Recorre toda la lista -->
                    <tr v-for="(producto, index) in lista" :key="producto" class="text-center"
                        v-if="this.logged == true && this.useBuscador == false">
                        <td>{{ index + 1 }}</td>
                        <td>{{ producto[0] }}</td>
                        <td>{{ producto[1] }} €</td>
                        <td>{{ producto[2] }}</td>
                        <td>
                            <v-btn size="45" prepend-icon="mdi-pencil" color="yellow-darken-1"
                                @click="activateEdit(producto[3], producto[0], producto[1], producto[2])">
                            </v-btn>

                            <v-btn size="45" prepend-icon="mdi-delete" color="red" @click="borrar(producto[3])">
                            </v-btn>
                        </td>
                    </tr>

                    <!-- Recorre toda la lista -->
                    <tr v-for="(producto, index) in listaBuscador" :key="producto" class="text-center"
                        v-if="this.logged == true && this.useBuscador == true">
                        <td>{{ index + 1 }}</td>
                        <td>{{ producto[0] }}</td>
                        <td>{{ producto[1] }} €</td>
                        <td>{{ producto[2] }}</td>
                        <td>
                            <v-btn size="45" prepend-icon="mdi-pencil" color="yellow-darken-1"
                                @click="activateEdit(producto[3], producto[0], producto[1], producto[2])">
                            </v-btn>

                            <v-btn size="45" prepend-icon="mdi-delete" color="red" @click="borrar(producto[3])">
                            </v-btn>
                        </td>
                    </tr>

                    <!-- Recorre toda la lista con todos los productos -->
                    <tr v-for="(producto, index) in lista" :key="producto" class="text-center"
                        v-if="this.logged == false && this.useBuscador == false">
                        <td>{{ index + 1 }}</td>
                        <td>{{ producto[0] }}</td>
                        <td>{{ producto[1] }} €</td>
                        <td>{{ producto[2] }}</td>
                        <td>{{ producto[3] }}</td>
                    </tr>

                    <!-- Cambia tabla dependiendo de si está usando el buscador o no -->
                    <tr v-for="(producto, index) in listaBuscador" :key="producto" class="text-center"
                        v-if="this.logged == false && this.useBuscador == true">
                        <td>{{ index + 1 }}</td>
                        <td>{{ producto[0] }}</td>
                        <td>{{ producto[1] }} €</td>
                        <td>{{ producto[2] }}</td>
                        <td>{{ producto[3] }}</td>
                    </tr>
                </tbody>
            </v-table>
        </v-col>

        <v-col cols="0" sm="1" md="2" lg="2">
        </v-col>
    </v-row>
</template>
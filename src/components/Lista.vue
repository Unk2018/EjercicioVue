<script>
export default {
    // Datos
    data() {
        return {
            idSelect: '',
            producto: '',
            coste: '',
            cantidad: '',
            lista: [],
            editing: false,
        }
    },

    methods: {
        guardar() {
            var buscarLista = [];
            var costeDouble = parseFloat(this.coste).toFixed(2);
            var cantidadInt = parseFloat(this.cantidad).toFixed(0);

            try {
                // Mira si existe uno anteriormente
                buscarLista =
                    this.lista.filter(ind => ind[0] == this.producto);

                if (buscarLista.length != 0) {
                    console.log("El producto introducido ya existe ya");
                } else {
                    // Mira que producto y coste no sea vacío. Mira que el coste y cantidad es mayor de 0
                    if (this.producto != '' && this.coste != '' && costeDouble > 0 && cantidadInt > 0) {
                        this.lista.push([
                            this.producto,
                            costeDouble,
                            cantidadInt]);

                        this.producto = '';
                        this.coste = '';
                        this.cantidad = '';
                    }
                }
            } catch (e) {
                console.error(e);
            }
        },

        // Quita la id introducida de la lista
        borrar(producto) {
            var nuevaLista;

            nuevaLista =
                this.lista.filter(prod => prod != this.lista.filter(ind => ind[0] == producto)[0]);

            // Nueva lista será la filtrada
            this.lista = nuevaLista;
        },

        activateEdit(id, producto, coste, cantidad) {
            this.idSelect = id;
            this.producto = producto;
            this.coste = coste;
            this.cantidad = cantidad;
            this.editing = true;
        },

        editar() {
            var costeDouble = parseFloat(this.coste).toFixed(2);
            var cantidadInt = parseFloat(this.cantidad).toFixed(0);

            // Edita la lista de productos
            this.lista.splice(parseInt(this.idSelect), 1, [this.producto, costeDouble, cantidadInt]);

            // Vacía los campos y deja de editar
            this.idSelect = '';
            this.producto = '';
            this.coste = '';
            this.cantidad = '';
            this.editing = false;
        }
    }
}
</script>

<template>
    <v-container>
        <v-sheet class="mx-auto bg-blue-grey-lighten-5 pa-10" max-width="344">
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
    </v-container>

    <v-row no-gutters class="mt-5 mb-5">
        <v-col cols="0" sm="1" md="2" lg="2">
        </v-col>

        <v-col cols="12" sm="10" md="8" lg="8">

            <v-sheet class="mx-auto" max-width="344">
                <v-text-field type="text" placeholder="Nombre del producto" prepend-inner-icon="mdi-magnify"
                    label="Buscar producto...">
                </v-text-field>
            </v-sheet>

            <v-table>
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
                        <th class="text-center">
                            Acciones
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="(producto, index) in lista" :key="producto" class="text-center">
                        <td>{{ index + 1 }}</td>
                        <td>{{ producto[0] }}</td>
                        <td>{{ producto[1] }}</td>
                        <td>{{ producto[2] }}</td>
                        <td>
                            <v-btn size="45" prepend-icon="mdi-pencil" color="yellow-darken-1"
                                @click="activateEdit(index, producto[0], producto[1], producto[2])">
                            </v-btn>

                            <v-btn size="45" prepend-icon="mdi-delete" color="red" @click="borrar(producto[0])">
                            </v-btn>
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </v-col>

        <v-col cols="0" sm="1" md="2" lg="2">
        </v-col>
    </v-row>
</template>
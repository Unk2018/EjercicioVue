<script>
export default {
    // Datos
    data() {
        return {
            producto: '',
            coste: '',
            cantidad: '',
            lista: [],
            editing: false,
        }
    },

    methods: {
        guardar() {
            var buscarLista;
            var costeDouble = parseFloat(this.coste).toFixed(2);
            var cantidadInt = parseFloat(this.cantidad).toFixed(0);

            try {
                // Mira si existe uno anteriormente
                buscarLista =
                    this.lista.filter(ind => ind[0] == this.producto);

                if (buscarLista.length != 0) {
                    console.log("El producto introducido ya existe ya");
                }
            } catch (e) {
                console.log("No existe el producto a buscar. Introducimos uno nuevo")
                this.lista.push([
                    this.producto,
                    costeDouble,
                    cantidadInt]);

                this.producto = '';
                this.coste = '';
                this.cantidad = '';
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

        activateEdit(producto, coste) {
            this.producto = producto;
            this.coste = coste;
            this.editing = true;
        },

        editar() {
            this.producto = '';
            this.coste = '';
            this.editing = false;
        }
    }
}
</script>

<template>
    <h1>Esto es Lista</h1>

    <v-container>
        <v-sheet class="mx-auto" max-width="344">
            <v-text-field clearable v-model="producto" label="Producto"></v-text-field>
            <v-text-field clearable type="number" v-model="coste" label="Coste"></v-text-field>

            <v-btn v-if="!this.editing" type="submit" block class="mt-2" @click="guardar">Guardar</v-btn>
            <v-btn v-if="this.editing" type="submit" block class="mt-2" @click="editar">Editar</v-btn>
        </v-sheet>
    </v-container>

    <v-row no-gutters class="mt-5 mb-5">
        <v-col cols="0" sm="1" md="2" lg="2">
        </v-col>

        <v-col cols="12" sm="10" md="8" lg="8">
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
                            Acciones
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="(producto, index) in lista" :key="producto" class="text-center">
                        <td>{{ index + 1 }}</td>
                        <td>{{ producto[0] }}</td>
                        <td>{{ producto[1] }}</td>
                        <td>
                            <v-btn size="45" prepend-icon="mdi-pencil" color="yellow-darken-1"
                                @click="activateEdit(producto[0], producto[1])"></v-btn>

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
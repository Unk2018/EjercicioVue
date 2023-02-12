<script>
export default {
    // Datos
    data() {
        return {
            email: '',
            password: '',
        }
    },

    methods: {

    }
}
</script>

<template>
    <v-app class="bg-light-blue-lighten-3">
        <v-container>
            <v-sheet class="mx-auto bg-white pa-10 ma-15 bordeLogin" max-width="344" rounded>
                <h1 class="text-center mb-5">Iniciar sesión</h1>

                <v-text-field type="text" v-model="email" class="mb-2" prepend-inner-icon="mdi-account" label="Email">
                </v-text-field>
                <v-text-field type="text" v-model="password" prepend-inner-icon="mdi-lock" label="Contraseña"
                    placeholder="Introduce tu contraseña">
                </v-text-field>

                <v-btn color="success" prepend-icon="mdi-login" type="submit" block class="mt-2"
                    @click="login">Login</v-btn>

                <v-btn variant="outlined" color="red" class="bg-blue-lighten-4 mt-2" type="submit" block @click="login">
                    <v-icon color="red" left>mdi-google</v-icon>
                    Iniciar sesión con Google
                </v-btn>
            </v-sheet>
        </v-container>
    </v-app>
</template>
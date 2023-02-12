<script>
import { defineComponent } from 'vue';

// Components
import Login from '../components/Login.vue';

export default defineComponent({
    name: 'LoginView',

    components: {
        Login
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
});
</script>

<template>
    <Login />
</template>

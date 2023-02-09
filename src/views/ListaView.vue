<script>
import { defineComponent } from 'vue';

// Components
import Lista from '../components/Lista.vue';

export default defineComponent({
    name: 'ListaView',

    components: {
        Lista
    },
});
</script>

<template>
    <Lista />
</template>

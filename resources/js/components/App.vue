<template>
    <v-app>
        <v-main>
            <example-component></example-component>
        </v-main>
    </v-app>
</template>

<script>
import ExampleComponent from "./ExampleComponent.vue";

export default {
    components: {
        ExampleComponent,
    },
    // Anda bisa menambahkan data, methods, dll. di sini
};
</script>

<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="8">
                <v-card>
                    <v-card-title class="bg-primary">
                        <span class="text-white"
                            >Vuetify Example Component</span
                        >
                    </v-card-title>

                    <v-card-text class="pa-4">
                        <p class="mb-4">
                            I'm an example component using Vuetify!
                        </p>

                        <v-btn
                            color="primary"
                            prepend-icon="mdi-vuetify"
                            class="mr-2"
                        >
                            Primary Button
                        </v-btn>

                        <v-btn color="secondary" prepend-icon="mdi-laravel">
                            Secondary Button
                        </v-btn>

                        <v-alert
                            type="success"
                            icon="mdi-check-circle"
                            class="mt-4"
                        >
                            Vuetify has been successfully integrated with
                            Laravel!
                        </v-alert>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    mounted() {
        console.log("Vuetify component mounted.");
    },
};
</script>

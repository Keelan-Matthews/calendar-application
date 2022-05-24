<template>
    <v-row class="fill-height">
        <v-col>

            <div class="ma-5 pa-5">
                <h1 class="primary--text">Signed in as</h1>
                <v-select v-model="user"
                    :items="['Keelan Matthews', 'Karl Jacobs', 'James Bond', 'Yan Wong', 'Bob Ross']" standard
                    height="60" class="user-title" />
                <h1 class="mt-5 pt-5 mb-5 pb-5 grey--text">
                    <v-icon class="mr-3">mdi-calendar-multiple</v-icon>Saved Schedules
                </h1>
                <v-navigation-drawer permanent>
                    <v-list nav>
                        <v-list-item link>
                            <v-list-item-icon>
                                <v-icon>mdi-calendar</v-icon>
                            </v-list-item-icon>

                            <v-list-item-content>
                                <v-list-item-title>Keelan Matthews</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item link>
                            <v-list-item-icon>
                                <v-icon>mdi-calendar</v-icon>
                            </v-list-item-icon>

                            <v-list-item-content>
                                <v-list-item-title>Karl Jacobs</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item link>
                            <v-list-item-icon>
                                <v-icon>mdi-calendar</v-icon>
                            </v-list-item-icon>

                            <v-list-item-content>
                                <v-list-item-title>James Bond</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item link>
                            <v-list-item-icon>
                                <v-icon>mdi-calendar</v-icon>
                            </v-list-item-icon>

                            <v-list-item-content>
                                <v-list-item-title>Yan Wong</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item link>
                            <v-list-item-icon>
                                <v-icon>mdi-calendar</v-icon>
                            </v-list-item-icon>

                            <v-list-item-content>
                                <v-list-item-title>Bob Ross</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-navigation-drawer>
            </div>
        </v-col>
    </v-row>
</template>

<script>

export default {
    name: 'DashboardComp',

    data: () => ({
        user: null
    }),
};
</script>

<style>
.user-title {
    font-size: 25px;
}

.title {
    font-size: 30px !important;
}

.v-navigation-drawer__border {
    width: 0px !important;
}
</style>
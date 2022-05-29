<template>
    <!-- Keelan Matthews u21549967 -->
    <v-row class="fill-height">
        <v-col>

            <div class="ma-5 pa-5">
                <h1 class="primary--text">Signed in as</h1>
                <v-select v-model="user" @change="$emit('currUser',user)"
                    :items="['Keelan Matthews', 'Peter Jacobs', 'James Bond', 'Yan Wong', 'Bob Ross']" standard
                    height="60" class="user-title" />
                <h1 class="mt-5 pt-5 mb-5 pb-5 grey--text">
                    <v-icon class="mr-3">mdi-calendar-multiple</v-icon>Saved Schedules
                </h1>
                <v-navigation-drawer permanent>
                    <v-list nav>
                        <v-list-item link @click="updateSchedule1()" :class="{'v-btn--active': nav1}">
                            <v-list-item-icon>
                                <v-icon>mdi-calendar</v-icon>
                            </v-list-item-icon>

                            <v-list-item-content>
                                <v-list-item-title>Keelan Matthews</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item link @click="updateSchedule2()" :class="{'v-btn--active': nav2}">
                            <v-list-item-icon>
                                <v-icon>mdi-calendar</v-icon>
                            </v-list-item-icon>

                            <v-list-item-content>
                                <v-list-item-title>Peter Jacobs</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item link @click="updateSchedule3()" :class="{'v-btn--active': nav3}">
                            <v-list-item-icon>
                                <v-icon>mdi-calendar</v-icon>
                            </v-list-item-icon>

                            <v-list-item-content>
                                <v-list-item-title>James Bond</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item link @click="updateSchedule4()" :class="{'v-btn--active': nav4}">
                            <v-list-item-icon>
                                <v-icon>mdi-calendar</v-icon>
                            </v-list-item-icon>

                            <v-list-item-content>
                                <v-list-item-title>Yan Wong</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item link @click="updateSchedule5()" :class="{'v-btn--active': nav5}">
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
        user: null,
        schedule: 'keelan',
        nav1: false,
        nav2: false,
        nav3: false,
        nav4: false,
        nav5: false
    }),
    methods: {
        updateSchedule1() {
            this.schedule = 'keelan';
            this.nav1 = !this.nav1;
            this.nav2 = false;
            this.nav3 = false;
            this.nav4 = false;
            this.nav5 = false;
            this.$emit("schedule",this.schedule);
        },
        updateSchedule2() {
            this.schedule = 'peter';
            this.nav1 = false;
            this.nav2 = !this.nav2;
            this.nav3 = false;
            this.nav4 = false;
            this.nav5 = false;
            this.$emit("schedule",this.schedule);
        },
        updateSchedule3() {
            this.schedule = 'james';
            this.nav1 = false;
            this.nav2 = false;
            this.nav3 = !this.nav3;
            this.nav4 = false;
            this.nav5 = false;
            this.$emit("schedule",this.schedule);
        },
        updateSchedule4() {
            this.schedule = 'yan';
            this.nav1 = false;
            this.nav2 = false;
            this.nav3 = false;
            this.nav4 = !this.nav4;
            this.nav5 = false;
            this.$emit("schedule",this.schedule);
        },
        updateSchedule5() {
            this.schedule = 'bob';
            this.nav1 = false;
            this.nav2 = false;
            this.nav3 = false;
            this.nav4 = false;
            this.nav5 = !this.nav5;
            this.$emit("schedule",this.schedule);
        },
    }
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
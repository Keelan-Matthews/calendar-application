<template>
	<v-app>
		<v-main>
			<v-row>
				<v-col cols="3">
					<DashboardComp @schedule="updateSchedule" @currUser="updateUser" />
				</v-col>
				<v-col>
					<CalendarComp :currSchedule="schedule" :currUser="user" />
				</v-col>
			</v-row>
		</v-main>
	</v-app>
</template>

<script>
import CalendarComp from './components/CalendarComp';
import DashboardComp from './components/DashboardComp';

export default {
	name: 'App',

	components: {
		CalendarComp,
		DashboardComp
	},
	data: () => ({
		schedule: '',
		user: ''
	}),
	methods: {
		updateSchedule(event) {
			this.schedule = event;
		},
		updateUser(event) {
			this.user = event;
		}
	}
};
</script>

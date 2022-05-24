<template>
	<v-app>
		<v-main>
			<v-row>
				<v-col cols="3">
					<DashboardComp />
				</v-col>
				<v-col>
					<CalendarComp />
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
		//
	}),
};
</script>

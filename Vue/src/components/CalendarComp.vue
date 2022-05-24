<template>
	<v-row class="fill-height">
		<v-col>
			<v-sheet height="64" class="mt-4 mb-4">
				<v-toolbar flat>
					<v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">Today</v-btn>
					<v-btn fab text small color="grey darken-2" @click="prev">
						<v-icon small>mdi-chevron-left</v-icon>
					</v-btn>
					<v-btn fab text small color="grey darken-2" @click="next">
						<v-icon small>mdi-chevron-right</v-icon>
					</v-btn>
					<v-toolbar-title v-if="$refs.calendar">
						{{ $refs.calendar.title }}
					</v-toolbar-title>
					<v-spacer></v-spacer>
					<v-btn class="mr-4" color="primary" @click="dialog = true" dark>Add Event</v-btn>
					<v-menu bottom right>
						<template v-slot:activator="{ on, attrs }">
							<v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
								<span>{{ typeToLabel[type] }}</span>
								<v-icon right>mdi-menu-down</v-icon>
							</v-btn>
						</template>
						<v-list>
							<v-list-item @click="type = 'day'">
								<v-list-item-title>Day</v-list-item-title>
							</v-list-item>
							<v-list-item @click="type = 'week'">
								<v-list-item-title>Week</v-list-item-title>
							</v-list-item>
							<v-list-item @click="type = 'month'">
								<v-list-item-title>Month</v-list-item-title>
							</v-list-item>
							<v-list-item @click="type = '4day'">
								<v-list-item-title>4 days</v-list-item-title>
							</v-list-item>
						</v-list>
					</v-menu>
				</v-toolbar>
			</v-sheet>

			<v-dialog v-model="dialog" max-width="500" scrollable>
				<v-card>
					<v-toolbar color="primary" dark class="mb-5">
						<v-toolbar-title>Add Event</v-toolbar-title>
						<v-spacer></v-spacer>
					</v-toolbar>
					<v-container>
						<v-form @submit.prevent="addEvent" class="pl-3 pr-3">
							<v-row align="center">
								<v-col class="d-flex" cols="12" sm="6">
									<v-select v-model="eventType" :items="['Event', 'Task', 'Appointment']"
										label="Event Type" standard prepend-icon="mdi-calendar" />
								</v-col>
								<v-col class="d-flex" cols="12" sm="6">
									<v-select v-model="repeat" :items="['No Repeat', 'Monthly', 'Weekly', 'Daily']"
										label="Repeat" standard prepend-icon="mdi-replay" />
								</v-col>
							</v-row>

							<v-text-field v-model="name" type="text" label="Name" :counter="25" class="mb-5" />
							<v-text-field v-model="date" type="date" label="Date" />
							<v-row justify-md="center">
								<v-menu ref="menu" v-model="menu2" :close-on-content-click="false" :nudge-right="40"
									:return-value.sync="start" transition="scale-transition" offset-y max-width="290px"
									min-width="290px">
									<template v-slot:activator="{ on, attrs }">
										<v-text-field v-model="start" label="Picker in menu"
											prepend-icon="mdi-clock-time-four-outline" readonly v-bind="attrs"
											v-on="on"></v-text-field>
									</template>
									<v-time-picker v-if="menu2" v-model="start" full-width
										@click:minute="$refs.menu.save(start)"></v-time-picker>
								</v-menu>
								<v-menu ref="menu" v-model="menu2" :close-on-content-click="false" :nudge-right="40"
									:return-value.sync="end" transition="scale-transition" offset-y max-width="290px"
									min-width="290px">
									<template v-slot:activator="{ on, attrs }">
										<v-text-field v-model="end" label="Picker in menu"
											prepend-icon="mdi-clock-time-four-outline" readonly v-bind="attrs"
											v-on="on"></v-text-field>
									</template>
									<v-time-picker v-if="menu2" v-model="end" full-width
										@click:minute="$refs.menu.save(end)"></v-time-picker>
								</v-menu>
							</v-row>

							<v-text-field v-model="details" type="text" label="Description" :counter="255"
								class="mt-5" />
							<v-text-field v-model="venue" type="text" label="Venue" :counter="25" />
							<div class="text-right mt-4">
								<v-btn type="submit" color="primary" class="mr-4" @click.stop="dialog = false">Create
									Event</v-btn>
							</div>
						</v-form>
					</v-container>
				</v-card>
			</v-dialog>

			<v-sheet height="900">
				<v-calendar ref="calendar" v-model="focus" color="primary" :events="events" :event-color="getEventColor"
					:type="type" @click:event="showEvent" @click:more="viewDay" @click:date="viewDay"></v-calendar>
				<v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x>
					<v-card color="grey lighten-4" min-width="350px" flat>
						<v-toolbar :color="selectedEvent.color" dark>
							<v-btn @click="deleteEvent(selectedEvent.id)" icon>
								<v-icon>mdi-delete</v-icon>
							</v-btn>
							<v-toolbar-title v-html="selectedEvent.name + ' (' + selectedEvent.venue + ')'">
							</v-toolbar-title>
							<v-spacer></v-spacer>
						</v-toolbar>
						<v-card-text>
							<h2 v-html="selectedEvent.type" class="mb-4"></h2>
							<form v-if="currentEdit !== selectedEvent.id">
								{{ selectedEvent.details }}
							</form>
							<form v-else>
								<textarea-autosize v-model="selectedEvent.details" type="text" style="width: 100%"
									:min-height="100" placeholder="Add description"></textarea-autosize>
							</form>
							<h3 class="mt-4">Guests</h3>
							<div v-for="(guest, index) in selectedEvent.guests" :key="index" :style="borderStyle">
								<h4 v-html="guest.name[0]" class="mt-2 ml-4"></h4>
								<p v-html="guest.email[0]" class="ml-4"></p>
							</div>
						</v-card-text>
						<v-card-actions>
							<v-btn text color="secondary" @click="closeEvent()">Close</v-btn>
							<v-btn text v-if="currentEdit !== selectedEvent.id"
								@click.prevent="editEvent(selectedEvent)">Edit</v-btn>
							<v-btn text v-else @click.prevent="updateEvent(selectedEvent)">Save</v-btn>
						</v-card-actions>
					</v-card>
				</v-menu>
			</v-sheet>
		</v-col>
	</v-row>
</template>

<script>
export default {
	name: 'CalendarComp',

	data: () => ({
		today: new Date().toISOString().substring(0, 10),
		focus: new Date().toISOString().substring(0, 10),
		type: 'month',
		typeToLabel: {
			month: 'Month',
			week: 'Week',
			day: 'Day',
			'4day': '4 Days',
		},
		user: "peter",
		name: null,
		details: null,
		date: null,
		repeat: null,
		start: null,
		end: null,
		timed: null,
		eventType: null,
		venue: null,
		guests: null,
		colors: ['#2dc245', '#2dc26b', '#2dc28e', '#2dc2a1'],
		currentEdit: null,
		selectedEvent: {},
		selectedElement: null,
		selectedOpen: false,
		events: [],
		dialog: false,
		menu2: false,
		modal2: false
	}),
	mounted() {
		this.getEvents();
	},
	computed: {
		borderStyle() {
			return {
				"border-left-width": "4px",
				"border-left-color": this.selectedEvent.color,
				"border-left-style": "solid"
			};
		}
	},
	methods: {
		viewDay({ date }) {
			this.focus = date
			this.type = 'day'
		},
		getEventColor(event) {
			return event.color
		},
		setToday() {
			this.focus = ''
		},
		prev() {
			this.$refs.calendar.prev()
		},
		next() {
			this.$refs.calendar.next()
		},
		editEvent(ev) {
			this.currentEdit = ev.id;
		},
		closeEvent() {
			this.selectedOpen = false;
			this.currentEdit = null;
		},
		showEvent({ nativeEvent, event }) {
			const open = () => {
				this.selectedEvent = event
				this.selectedElement = nativeEvent.target
				requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
			}

			if (this.selectedOpen) {
				this.selectedOpen = false
				requestAnimationFrame(() => requestAnimationFrame(() => open()))
			} else {
				open()
			}

			nativeEvent.stopPropagation()
		},
		rnd(a, b) {
			return Math.floor((b - a + 1) * Math.random()) + a
		},
		getEvents() {

			fetch("http://localhost:3000/calendar/" + this.user)
				.then(res => res.json())
				.then(data => {

					console.log(data);
					let eventArray = data.schedule.event;

					eventArray.forEach(event => {

						/* Test if the event has a recurring attribute. If it does not,
						* then just push it to the array. Otherwise, push differently
						* based on how it repeats.
						*/
						if (event.date[0].$ != null) {
							const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

							if (event.date[0].$.repeat === 'Monthly') {
								const eventColor = this.colors[this.rnd(0, this.colors.length - 1)];

								for (let i = months.indexOf(event.date[0].month[0]); i < 12; i++) {
									let startDate = new Date(event.date[0].day + ' ' + months[i] + ' 2022 ' + event.date[0].startingTime[0]).toISOString().substring(0, 19);
									let endDate = new Date(event.date[0].day + ' ' + months[i] + ' 2022 ' + event.date[0].endingTime[0]).toISOString().substring(0, 19);

									let obj = {
										id: event.$.id,
										name: event.title[0],
										details: event.description[0],
										type: event.type[0],
										venue: event.venue[0],
										guests: event.guests[0].guest,
										start: startDate,
										end: endDate,
										timed: true,
										color: eventColor
									}

									this.events.push(obj);
								}
							}
							else if (event.date[0].$.repeat === 'Weekly') {
								const eventColor = this.colors[this.rnd(0, this.colors.length - 1)];

								for (let i = months.indexOf(event.date[0].month[0]); i < 12; i++) {
									//Get weekday to repeat from
									let weekday = new Date(event.date[0].day[0] + ' ' + months.indexOf(event.date[0].month[0]) + ' ' + 2022).getDay();

									//Populate first month from current day, then check every day of every month
									let day = (i == months.indexOf(event.date[0].month[0])) ? event.date[0].day[0] : 1;

									for (day; day <= 31; day++) {
										let startDate = new Date(day + ' ' + months[i] + ' 2022 ' + event.date[0].startingTime[0]).toISOString().substring(0, 19);
										let endDate = new Date(day + ' ' + months[i] + ' 2022 ' + event.date[0].endingTime[0]).toISOString().substring(0, 19);

										let weekCheck = new Date(startDate); //convert back to date to use getDay

										//If day matches the weekday it is meant to occur, add it
										if (weekCheck.getDay() == weekday) {
											let obj = {
												id: event.$.id,
												name: event.title[0],
												details: event.description[0],
												type: event.type[0],
												venue: event.venue[0],
												guests: event.guests[0].guest,
												start: startDate,
												end: endDate,
												timed: true,
												color: eventColor
											}

											this.events.push(obj);
										}
									}
								}
							}
							else if (event.date[0].$.repeat === 'Daily') {
								const eventColor = this.colors[this.rnd(0, this.colors.length - 1)];

								for (let i = months.indexOf(event.date[0].month[0]); i < 12; i++) {

									//Populate first month from current day, then populate every day of every month
									let day = (i == months.indexOf(event.date[0].month[0])) ? event.date[0].day[0] : 1;

									//Get number of days in the current month
									let dt = new Date('1 ' + months[i] + ' 2022');
									let month = dt.getMonth();
									let year = dt.getFullYear();
									let daysInMonth = new Date(year, month, 0).getDate();

									for (day; day <= daysInMonth; day++) {
										let startDate = new Date(day + ' ' + months[i] + ' 2022 ' + event.date[0].startingTime[0]).toISOString().substring(0, 19);
										let endDate = new Date(day + ' ' + months[i] + ' 2022 ' + event.date[0].endingTime[0]).toISOString().substring(0, 19);


										let obj = {
											id: event.$.id,
											name: event.title[0],
											details: event.description[0],
											type: event.type[0],
											venue: event.venue[0],
											guests: event.guests[0].guest,
											start: startDate,
											end: endDate,
											timed: true,
											color: eventColor
										}

										this.events.push(obj);
									}
								}
							}
						}
						else {
							let startDate = new Date(event.date[0].day + ' ' + event.date[0].month[0] + ' 2022 ' + event.date[0].startingTime[0]).toISOString().substring(0, 19);
							let endDate = new Date(event.date[0].day + ' ' + event.date[0].month[0] + ' 2022 ' + event.date[0].endingTime[0]).toISOString().substring(0, 19);

							let obj = {
								id: event.$.id,
								name: event.title[0],
								details: event.description[0],
								type: event.type[0],
								venue: event.venue[0],
								guests: event.guests[0].guest,
								start: startDate,
								end: endDate,
								timed: true,
								color: this.colors[this.rnd(0, this.colors.length - 1)]
							}
							this.events.push(obj);
						}
					})
				});

		},
		updateEvent(ev) {
			const options = {
				method: "PATCH",
				header: { "Content-Type": "application/json; charset=UTF-8" },
				body: JSON.stringify({
					details: ev.details,
				})
			}

			fetch("http://localhost:3000/calendar/" + this.user + "/update/" + this.currentEdit, options)
				.then(res => res.json())
				.then(data => console.log(data));

			this.selectedOpen = false;
			this.currentEdit = null;
		},
		deleteEvent() {
			const options = {
				method: "DELETE",
				header: { "Content-Type": "application/json; charset=UTF-8" }
			}

			fetch("http://localhost:3000/calendar/" + this.user + "/delete/" + this.currentEdit, options)
				.then(res => res.json())
				.then(data => console.log(data));

			this.selectedOpen = false;
			this.getEvents();
		},
		addEvent() {
			const options = {
				method: "POST",
				header: { "Content-Type": "application/json; charset=UTF-8" },
				body: JSON.stringify({

				})
			}

			fetch("http://localhost:3000/calendar/" + this.user + "/add", options)
				.then(res => res.json())
				.then(data => console.log(data));


			//Reset all variables to null after insert
		}
	}
};
</script>

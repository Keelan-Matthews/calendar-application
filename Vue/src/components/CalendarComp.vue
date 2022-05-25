<template>
	<v-row class="fill-height">
		<v-col>
			<v-sheet height="64" class="mt-4 mb-4 mr-5 pr-5">
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
					<v-btn class="mr-4" color="primary" @click="dialog = true" dark :class="isActive() ? 'd-block' : 'd-none'">Add Event</v-btn>
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

			<v-dialog v-model="dialog" max-width="500">
				<v-card>
					<v-toolbar color="primary" dark class="mb-5">
						<v-spacer></v-spacer>
						<v-toolbar-title>
							<v-icon class="mr-3">mdi-calendar-plus</v-icon>Add Event
						</v-toolbar-title>
						<v-spacer></v-spacer>
					</v-toolbar>
					<v-container>
						<v-form @submit.prevent="addEvent" class="pl-3 pr-3">
							<div style="overflow-y: auto; overflow-x: hidden; max-height: 700px;" class="pa-3">
								<v-row align="center">
									<v-col class="d-flex" cols="12" sm="6">
										<v-select v-model="eventType" :items="['Event', 'Task', 'Appointment']"
											label="Event Type" standard prepend-icon="mdi-calendar" required />
									</v-col>
									<v-col class="d-flex" cols="12" sm="6">
										<v-select v-model="repeat" :items="['No Repeat', 'Monthly', 'Weekly', 'Daily']"
											label="Repeat" standard prepend-icon="mdi-replay" required />
									</v-col>
								</v-row>

								<v-text-field v-model="name" type="text" label="Name" :counter="25" class="mb-5"
									required />
								<v-text-field v-model="date" type="date" label="Date" required />
								<v-row justify-md="center">
									<v-menu ref="menu" v-model="menu2" :close-on-content-click="false" :nudge-right="40"
										:return-value.sync="start" transition="scale-transition" offset-y
										max-width="290px" min-width="290px">
										<template v-slot:activator="{ on, attrs }">
											<v-text-field v-model="start" label="Start Time"
												prepend-icon="mdi-clock-time-four-outline" readonly v-bind="attrs"
												v-on="on" class="pl-3" required></v-text-field>
										</template>
										<v-time-picker v-if="menu2" v-model="start" :max="end" full-width
											@click:minute="$refs.menu.save(start)"></v-time-picker>
									</v-menu>
									<v-menu ref="menu2" v-model="menu3" :close-on-content-click="false"
										:nudge-right="40" :return-value.sync="end" transition="scale-transition"
										offset-y max-width="290px" min-width="290px">
										<template v-slot:activator="{ on, attrs }">
											<v-text-field v-model="end" label="End Time"
												prepend-icon="mdi-clock-time-four-outline" readonly v-bind="attrs"
												v-on="on" required></v-text-field>
										</template>
										<v-time-picker v-if="menu3" v-model="end" :min="start" full-width
											@click:minute="$refs.menu2.save(end)"></v-time-picker>
									</v-menu>
								</v-row>

								<v-text-field v-model="details" type="text" label="Description" :counter="255"
									class="mt-5" required />
								<v-text-field v-model="venue" type="text" label="Venue" :counter="25" required />

								<h4 class="grey--text">Guests</h4>
								<div v-for="(guest, index) in guests" :key="index" class="d-flex">
									<v-text-field type="text" placeholder="Name" v-model="guests[index].name"
										class="mr-3" :counter="10" />
									<v-text-field type="text" placeholder="email@example.com"
										v-model="guests[index].email" class="mr-3" :counter="40" />
									<v-icon @click="deleteGuest(index)">mdi-delete</v-icon>
								</div>
								<v-btn :class="guests.length >= 10 ? 'd-none mx-2 my-3' : 'd-block mx-2 my-3'" fab
									x-small color="primary" @click="addGuest()">
									<v-icon dark>
										mdi-plus
									</v-icon>
								</v-btn>
							</div>

							<div class="text-right mt-5 mb-3 pt-5">
								<v-btn type="submit" color="primary" class="mr-4" @click.stop="dialog = false">Create
									Event</v-btn>
							</div>
						</v-form>
					</v-container>
				</v-card>
			</v-dialog>

			<v-sheet height="800" class="mr-5 pr-5">
				<v-calendar ref="calendar" v-model="focus" color="primary" :events="events" :event-color="getEventColor"
					:type="type" @click:event="showEvent" @click:more="viewDay" @click:date="viewDay"></v-calendar>
				<v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x>
					<v-card color="grey lighten-4" min-width="350px" flat>
						<v-toolbar :color="selectedEvent.color" dark>
							<v-btn @click="deleteEvent(selectedEvent.id)" :class="isActive() ? 'd-block' : 'd-none'" icon>
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
									:min-height="100" placeholder="Add description" />
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
								@click.prevent="editEvent(selectedEvent)" :class="isActive() ? 'd-block' : 'd-none'">Edit</v-btn>
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
	props: ['currSchedule', 'currUser'],
	watch: {
		currSchedule: function(val) {
			this.user = val;
			this.getEvents();
		},
		currUser: function(val) {
			this.selectedUser = val;
		}
	},
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
		user: 'keelan',
		selectedUser: '',
		name: null,
		details: null,
		date: null,
		repeat: null,
		start: null,
		end: null,
		timed: true,
		eventType: null,
		venue: null,
		guests: [],
		colors: ['#2dc245', '#2dc26b', '#2dc28e', '#2dc2a1', '#2db3c2', '#2d7fc2', '#c22d89', '#c22d64', '#c7507b'],
		currentEdit: null,
		selectedEvent: {},
		selectedElement: null,
		selectedOpen: false,
		events: [],
		dialog: false,
		menu2: false,
		menu3: false,
	}),
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
		isActive() {
			let active = this.selectedUser.substring(0,this.selectedUser.indexOf(' ')).toLowerCase();
			return active === this.user;
		},
		getEvents() {
			this.events = [];

			if (this.user != undefined) {
				fetch("http://localhost:3000/calendar/" + this.user)
					.then(res => res.json())
					.then(data => {
						console.log(data);
						if (data.schedule.event === undefined) return;

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
										let weekday = new Date(event.date[0].day[0] + ' ' + months[months.indexOf(event.date[0].month[0])] + ' ' + ' 2022').getDay();

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
			}
		},
		updateEvent(ev) {
			const options = {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					details: ev.details,
				}),
			}
			console.log(ev.details);
			console.log(options.body);

			fetch("http://localhost:3000/calendar/" + this.user + "/update/" + this.currentEdit, options)
				.then(res => res.json())
				.then(data => console.log(data));

			this.selectedOpen = false;
			this.currentEdit = null;
		},
		deleteEvent() {
			const options = {
				method: "DELETE",
				headers: { "Content-Type": "application/json" }
			}

			fetch("http://localhost:3000/calendar/" + this.user + "/delete/" + this.currentEdit, options)
				.then(res => res.json())
				.then(data => {
					console.log(data);
					this.selectedOpen = false;
					this.getEvents();
				});
		},
		addGuest() {
			this.guests.push({ "name": '', "email": '' });
		},
		deleteGuest(i) {
			this.guests.splice(i, 1);
		},
		addEvent() {
			const options = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					"name": this.name,
					"details": this.details,
					"date": this.date,
					"repeat": this.repeat,
					"start": this.start,
					"end": this.end,
					"eventType": this.eventType,
					"venue": this.venue,
					"guests": this.guests
				})
			}

			console.log(options.body)

			fetch("http://localhost:3000/calendar/" + this.user + "/add", options)
				.then(res => res.json())
				.then(data => {
					console.log(data);
					//Reset all variables to null after insert
					this.name = null;
					this.details = null;
					this.date = null;
					this.repeat = null;
					this.start = null;
					this.end = null;
					this.eventType = null;
					this.venue = null;
					this.guests = []

					this.getEvents();
				});
		}
	}
};
</script>

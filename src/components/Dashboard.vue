<template>
  <v-app >
    <v-main>
      <v-container>
        <v-row>

          <v-col v-for="task in tasks" :key="task.id">
            <v-card>
              <v-col>
                <v-card-text>{{ task.id }}</v-card-text>
                <v-card-text>{{ task.title }}</v-card-text>
                <v-card-text>{{ task.location }}</v-card-text>
                <v-card-text>{{ task.date }}</v-card-text>
                <v-row>
                  <v-btn>Mark as Done</v-btn>
                  <v-btn>Modify</v-btn>
                  <v-btn>Delete</v-btn>
                </v-row>
              </v-col>
            </v-card>
          </v-col>
          <v-col>
            <v-card>
              <v-card-title>
                <h1>Dashboard</h1>
                <h2>{{ timestamp }}</h2>
              </v-card-title>
              <v-card-text>
                <h3>Today’s Upcoming Event:  {{todayUpcoming}}</h3>
                <h3>Total Upcoming Event:  {{totalUpcoming}}</h3>
              </v-card-text>
              <v-btn>
                Add a task
              </v-btn>
              <v-card-text>
                <h3>Current User: {{currentUser}}</h3>
              </v-card-text>
              <v-btn>
                Edit Profile
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      timestamp: '',
      todayUpcoming: 0,
      totalUpcoming: 0,
      currentUser: '',
      tasks: []
    };
  },
  created() {
    setInterval(() => {
      this.getNow();
    }, 1000)
  },
  methods: {
    getNow: function() {
      const today = new Date();
      const date = today.getFullYear() + '-' +
        (today.getMonth() + 1).toString().padStart(2, '0') + '-' +
        today.getDate().toString().padStart(2, '0');
      const time = today.getHours().toString().padStart(2, '0') + ":" +
        today.getMinutes().toString().padStart(2, '0') + ":" +
        today.getSeconds().toString().padStart(2, '0');
      const dateTime = date + ' ' + time;
      this.timestamp = dateTime;
    },
    updateTasks: async function () {
      const parentContainer = document.getElementById('form');

      let j = {username: user}
      const response1 = await fetch("/data", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(j)
      })
        .then(response => response.json())
        .then(function (data) {
          this.tasks = data;
        }).catch(error => console.error('Error:', error));
    }
  },
};
</script>

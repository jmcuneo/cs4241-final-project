<template>
  <v-app >
    <v-main>
      <v-container>
        <v-row>
          <v-col>
            <v-col v-for="task in tasks" :key="task._id">
              <v-card>
                <v-col>
                  <v-card-text>{{ task._id }}</v-card-text>
                  <v-card-text>{{ task.title }}</v-card-text>
                  <v-card-text>{{ task.location }}</v-card-text>
                  <v-card-text>{{ task.time }}</v-card-text>
                  <v-row>
                    <v-btn @click="selectTask(task)">Modify</v-btn>
                    <v-btn @click="deleteTask(task)">Delete</v-btn>
                  </v-row>
                </v-col>
              </v-card>
            </v-col>
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
              <v-btn @click="openAddDialog()">
                Add a task
              </v-btn>
              <v-card-text>
                <h3>Current User: {{currentUser}}</h3>
              </v-card-text>
              <v-btn @click="openProfileDialog()">
                Edit Profile
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <v-dialog v-model="dialogVisible" max-width="1000px">
        <v-card elevation="7" style="height: 500px">
          <v-card-title>Task Edit</v-card-title>
          <v-card-text>Task ID: {{currentTask.id}}</v-card-text>
          <v-text-field v-model="newTitle" label="Task Title" ></v-text-field>
          <v-text-field v-model="newLocation" label="Location"></v-text-field>
          <v-text-field v-model="newTime" label="Time"> </v-text-field>
          <v-row>
            <v-btn @click="updateInfo()">Confirm</v-btn>
            <v-btn @click="closeDialog()">Cancel</v-btn>
          </v-row>
        </v-card>
      </v-dialog>
      <v-dialog v-model="addDialogVisible" max-width="1000px" max-height="1000px">
        <v-card elevation="7" >
          <v-card-title>Add Task</v-card-title>
          <v-text-field v-model="addTitle" label="Task Title"></v-text-field>
          <v-text-field v-model="addLocation" label="Location"></v-text-field>
          <v-text-field v-model="addTime" label="Time"></v-text-field>
          <v-row>
            <v-btn @click="addTask()">Confirm</v-btn>
            <v-btn @click="closeAddDialog()">Cancel</v-btn>
          </v-row>
        </v-card>
      </v-dialog>
      <v-dialog  v-model="profileDialogVisible" max-width="1000px" max-height="1000px">
        <v-card elevation="7">
          <v-card-title>Profile Edit</v-card-title>
          <v-text-field
            v-model="password"
            label="New Password"
            :type="'password'"
          ></v-text-field>
          <v-text-field
            v-model="confirmPassword"
            label="Confirm Password"
            :type="'password'"
          ></v-text-field>
          <v-row>
            <v-btn @click="updatePassword()">Confirm</v-btn>
            <v-btn @click="closeProfileDialog()">Cancel</v-btn>
          </v-row>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script>
import {useDate} from "vuetify";

export default {
  name: "App",
  data() {
    return {
      timestamp: '',
      todayUpcoming: 0,
      totalUpcoming: 0,
      currentUser: '',
      currentTask: {},
      dialogVisible: false,
      addDialogVisible: false,
      profileDialogVisible:false,
      newTitle: '',
      newLocation: '',
      newTime: '',
      addTitle: '',
      addLocation: '',
      addTime: '',
      password:'',
      confirmPassword:'',
      tasks: []
    };
  },
  async created() {
    this.currentUser = this.$route.query.username;
    console.log(this.currentUser)
    if (this.currentUser === undefined){
      this.$router.push({ name: 'Login' });
    }
    await this.updateTasks();
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
      this.timestamp = date + ' ' + time;
    },
    updateTasks: async function () {
      let j = {username: this.currentUser}
      const response1 = await fetch("/data", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(j)
      })
        .then(response => response.json())
        .then(data => {
          this.tasks = data;
          console.log(data)
        })
        .catch(error => console.error('Error:', error));
    },
    selectTask(item) {
      this.currentTask = item; // Ensure currentContact is declared in data
      this.newTitle = item.title;
      this.newLocation = item.location;
      this.newTime = item.time;
      this.dialogVisible = true;
    },
    async deleteTask(item) {
      const json = {_id: item._id},
        body = JSON.stringify(json);
      try {
        const response = await fetch("/delete", {
          method: "DELETE",
          headers: {
            'Content-Type': 'application/json' // Ensure the server knows to expect JSON
          },
          body: body
        });
        if (response.ok) {
          await this.updateTasks();
        } else {
          throw new Error('Failed to Delete');
        }
      } catch (error) {
        console.error('Error:', error);
        alert(error.message);  // Optionally, handle user feedback
      }
    },
    async updateInfo() {
      const json = {_id: this.currentTask._id, title: this.newTitle, location: this.newLocation, time: this.newTime, owner: this.currentUser},
        body = JSON.stringify(json);
      console.log(json._id)
      try {
        const response = await fetch("/modify", {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json' // Ensure the server knows to expect JSON
          },
          body: body
        });
        if (response.ok) {
          await this.updateTasks();
          this.dialogVisible = false;
        } else {
          throw new Error('Failed to Update');
        }
      } catch (error) {
        console.error('Error:', error);
        alert(error.message);  // Optionally, handle user feedback
      }
    },
    closeDialog(){
      this.dialogVisible = false;
    },
    openAddDialog(){
      this.addTitle = '';
      this.addLocation = '';
      this.addTime = '';
      this.addDialogVisible = true;
    },
    closeAddDialog(){
      this.addDialogVisible = false;
    },
    openProfileDialog(){
      this.password = '';
      this.confirmPassword = '';
      this.profileDialogVisible = true;
    },
    closeProfileDialog(){
      this.profileDialogVisible = false;
    },
    async addTask() {
      const json = {title: this.addTitle, location: this.addLocation, time: this.addTime, owner: this.currentUser},
        body = JSON.stringify(json);
      try {
        const response = await fetch("/add", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json' // Ensure the server knows to expect JSON
          },
          body: body
        });
        if (response.ok) {
          await this.updateTasks();
          this.addDialogVisible = false;
        } else {
          throw new Error('Failed to add task');
        }
      } catch (error) {
        console.error('Error:', error);
        alert(error.message);
      }
    },
    async updatePassword() {
      if (this.password !== this.confirmPassword){
        alert('Password does not match');
      }
      else{
        const json = {username: this.currentUser, password: this.password},
          body = JSON.stringify(json);
        console.log(json._id)
        try {
          const response = await fetch("newpass", {
            method: "PUT",
            headers: {
              'Content-Type': 'application/json'
            },
            body: body
          });
          if (response.ok) {
            this.profileDialogVisible = false;
          } else {
            throw new Error('Failed to Update');
          }
        } catch (error) {
          console.error('Error:', error);
          alert(error.message);
        }
      }
    },
  },
};
</script>

<style scoped>
/* General app styling */
.v-app {
  font-family: 'Roboto', sans-serif;
  color: #333;
  background-color: #f5f5f5;
}

/* Row and column styling */
.v-row, .v-col {
  margin: 10px;
}

/* Card styling */
.v-card {
  margin: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  border-radius: 8px;
}

.v-card-title {
  background-color: #1976D2;
  color: white;
  padding: 16px 24px;
  font-size: 20px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.v-card-text {
  padding: 16px 24px;
  line-height: 1.5;
}

/* Button styling */
.v-btn {
  margin: 5px;
  color: white;
  background-color: #1976D2;
}

.v-btn:hover {
  background-color: #0D47A1;
}

/* Textarea styling */
.v-textarea {
  margin: 10px;
}

/* Text field styling */
.v-text-field {
  margin: 10px;
}

/* Dialog styling */
.v-dialog {
  border-radius: 8px;
}

.v-dialog .v-card {
  margin: 0;
}

/* Profile and task form dialog styling */
.profile-dialog .v-text-field, .task-dialog .v-text-field {
  margin-bottom: 20px;
}

/* Date picker styling */
.v-date-picker {
  margin: 10px;
}

/* Dashboard specifics */
.dashboard-card .v-card-title h1, .dashboard-card .v-card-title h2 {
  margin: 0;
}

.dashboard-card .v-card-text h3 {
  margin-top: 5px;
  margin-bottom: 10px;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .v-row, .v-col {
    flex-direction: column;
  }

  .v-card-title, .v-card-text {
    text-align: center;
  }

  .v-btn {
    width: 100%;
  }
}

</style>

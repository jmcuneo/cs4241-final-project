<template>
  <v-app >
    <v-main>
      <v-container>
        <v-col >
          <v-alert v-model="alertVisible" :text="errorMessage" :type="alertType"></v-alert>
            <v-card width="100%">
              <v-toolbar dark color="primary">
                <v-toolbar-title>{{isRegister ? stateObj.register.name : stateObj.login.name}} Form</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <form ref="form" @submit.prevent="isRegister ? register() : login()">
                  <v-text-field
                    v-model="username"
                    name="username"
                    label="Username"
                    type="text"
                    placeholder="username"
                    required
                  ></v-text-field>

                  <v-text-field
                    v-model="password"
                    name="password"
                    label="Password"
                    type="password"
                    placeholder="password"
                    required
                  ></v-text-field>

                  <v-text-field v-if="isRegister"
                                v-model="confirmPassword"
                                name="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                placeholder="confirm password"
                                required
                  ></v-text-field>
                  <v-btn type="submit" class="mt-4" color="primary" value="log in" onclick="">{{isRegister ? stateObj.register.name : stateObj.login.name}}</v-btn>
                  <div style="cursor: pointer" class="grey--text mt-4" v-on:click="isRegister = !isRegister;">
                    {{toggleMessage}}
                  </div>
                </form>
              </v-card-text>
            </v-card>
        </v-col>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      confirmPassword: "",
      alertType: "error",
      alertVisible: false,
      isRegister : false,
      errorMessage: "",
      stateObj: {
        register :{
          name: 'Registration',
          message: 'Already have an account? login.'
        },
        login : {
          name: 'Login',
          message: 'Register'
        }
      }
    };
  },
  methods: {
    submit(){
      if (this.isRegister){
        this.register();
      }
      else{
        this.login();
      }
    },
    async login() {
      const username = this.username,
        password = this.password,
        json = {username: username, password: password},
        body = JSON.stringify(json);

      try {
        const response = await fetch("/login", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: body
        });

        if (response.ok) {
          this.$router.push({ name: 'Home' , query: { username: this.username }});
        } else {
          const errMsg = await response.text();
          throw new Error(errMsg);
        }
      } catch (error) {
        this.alertType = "error";
        this.errorMessage = error.message;
        this.alertVisible = true;
      }
    },
    async register() {
      const username = this.username,
        password = this.password,
        json = {username: username, password: password},
        body = JSON.stringify(json);

      if (this.username !== this.confirmPassword){
        this.alertType = "error";
        this.errorMessage = "Password does not match";
        this.alertVisible = true;
      }
      else{
        try {
          const response = await fetch("/register", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: body
          });

          if (response.ok) {
            this.alertType = "success";
            this.errorMessage = "Successfully registered";
            this.alertVisible = true;
          } else {
            const errMsg = await response.text();
            throw new Error(errMsg);
          }
        } catch (error) {
          this.alertType = "error";
          this.errorMessage = error.message;
          this.alertVisible = true;
        }
      }
    }
  },
  computed: {
    toggleMessage : function() {
      return this.isRegister ? this.stateObj.register.message : this.stateObj.login.message }
  }
};
</script>

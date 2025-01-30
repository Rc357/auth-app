<template>
    <div class="login-container">
      <div class="login-box">
        <img class="logo" alt="My logo" src="../assets/logo.png">
        <h1>Welcome Back!</h1>
        <p class="subheading">Please log in to your account</p>
  
        <div class="input-group">
          <input type="text" v-model="email" placeholder="Email Address" class="input-field" :class="{'error-input': errors.email}">
          <span v-if="errors.email" class="error">{{ errors.email }}</span>
        </div>
  
        <div class="input-group">
          <input type="password" v-model="password" placeholder="Password" class="input-field" :class="{'error-input': errors.password}">
          <span v-if="errors.password" class="error">{{ errors.password }}</span>
        </div>
  
        <button v-on:click="login" class="btn-login">Login</button>
  
        <p class="signup-link">
          Don't have an account? <router-link to="/sign-up">Sign Up</router-link>
        </p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: "LoginPage",
    data() {
      return {
        API_URL: process.env.NODE_ENV === 'live'
                    ? `https://${process.env.VERCEL_URL}`  
                    : 'http://localhost:3000',
        email: '',
        password: '',
        errors: {}
      };
    },
    methods: {
      validateForm() {
        this.errors = {};
  
        if (!this.email.trim()) {
          this.errors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(this.email)) {
          this.errors.email = "Enter a valid email.";
        }
  
        if (!this.password.trim()) {
          this.errors.password = "Password is required.";
        }
  
        return Object.keys(this.errors).length === 0;
      },
      async login() {
        if (!this.validateForm()) {
            return;
        }

        try {
            console.log("Logging in with", { email: this.email.trim(), password: this.password.trim() });
            let result = await axios.post(this.API_URL+"/users/login", {
            email: this.email,
            password: this.password
            },  {
            headers: {
                'Content-Type': 'application/json'
            }
            });

            console.log(result); // Log the server response

            if (result.status === 200 && result.data && result.data.id) {
            const user = result.data;

            localStorage.setItem("user-info", JSON.stringify(user));
            this.$router.push({ name: 'HomePage' });
            } else {
            this.errors.email = "Invalid email or password.";
            }
        } catch (error) {
            console.error("Login failed:", error);

            if (error.response) {
                this.errors.email = error.response.data.message || "Invalid email or password.";
            } else if (error.request) {
                this.errors.email = "Server is unreachable. Please try again.";
            } else {
                // Other unknown error
                this.errors.email = "An unexpected error occurred.";
            }
            }

    }

    },
    mounted() {
      let user = localStorage.getItem('user-info');
      if (user) {
        this.$router.push({ name: 'HomePage' });
      }
    }
  }
  </script>
  
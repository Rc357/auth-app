<template>
    <div class="signup-container">
        <div class="signup-box">
            <img class="logo" alt="My logo" src="../assets/logo.png">
            <h1>Create an Account</h1>
            <p class="subheading">Join us and get started!</p>

            <div class="input-group">
                <input type="text" v-model="name" placeholder="Full Name" class="input-field" :class="{'error-input': errors.name}">
                <span v-if="errors.name" class="error">{{ errors.name }}</span>
            </div>

            <div class="input-group">
                <input type="text" v-model="email" placeholder="Email Address" class="input-field" :class="{'error-input': errors.email}">
                <span v-if="errors.email" class="error">{{ errors.email }}</span>
            </div>

            <div class="input-group">
                <input type="password" v-model="password" placeholder="Password" class="input-field" :class="{'error-input': errors.password}">
                <span v-if="errors.password" class="error">{{ errors.password }}</span>
            </div>

            <button v-on:click="signUp" class="btn-signup">Sign Up</button>

            <p class="login-link">
                Already have an account? <router-link to="/login">Login</router-link>
            </p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'SignUp',
    data() {
        return {
        API_URL: process.env.NODE_ENV === 'live'
                    ? `https://${process.env.VERCEL_URL}` 
                    : 'http://localhost:3000',
            name: '',
            email: '',
            password: '',
            errors: {}
        };
    },
    methods: {
        validateForm() {
            this.errors = {};

            if (!this.name.trim()) {
                this.errors.name = "Name is required.";
            }

            if (!this.email.trim()) {
                this.errors.email = "Email is required.";
            } else if (!/\S+@\S+\.\S+/.test(this.email)) {
                this.errors.email = "Enter a valid email.";
            }

            if (!this.password.trim()) {
                this.errors.password = "Password is required.";
            } else if (this.password.length < 6) {
                this.errors.password = "Password must be at least 6 characters.";
            }

            return Object.keys(this.errors).length === 0;
        },
        async signUp() {
            if (!this.validateForm()) {
                return;
            }
            try {
                // Send data to the backend
                let result = await axios.post(this.API_URL, {
                    name: this.name,
                    email: this.email.trim(),
                    password: this.password.trim() 
                });
                console.log(result); 
                if (result.status === 201) {
                    localStorage.setItem("user-info", JSON.stringify(result.data));
                    this.$router.push({ name: 'HomePage' });
                }
            } catch (error) {
                 // Handle the error
                if (error.response && error.response.status === 400) {
                this.errors.email = error.response.data.message; // Display the error message
                } else {
                console.error("Signup failed:", error);
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

<template>
    <nav class="navbar">
        <div class="nav-links">
            <router-link to="/" class="nav-link">Home</router-link>
        </div>
        <a href="#" @click.prevent="logout" class="nav-link logout">Logout</a>
    </nav>
</template>

<script>
export default {
    name: 'HeaderView',
    methods: {
        logout() {
            this.$emit("logout");
        }
    }
}
</script>

<style scoped>
/* Navbar container */
.navbar {
    background-color: #34495e; 
    padding: 15px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

/* Navigation links container */
.nav-links {
    display: flex;
    gap: 30px;
}

/* Styling for individual links */
.nav-link {
    color: white;
    text-decoration: none;
    font-size: 18px;
    font-weight: 500;
    transition: color 0.3s ease, transform 0.2s ease;
}

/* Hover effect for nav links */
.nav-link:hover {
    color: #f39c12; 
    transform: scale(1.1);
}

/* Logout link special styling */
.logout {
    color: #e74c3c; 
    font-weight: bold;
    margin-left: auto; 
}

.logout:hover {
    color: #c0392b; 
    transform: scale(1.1);
}
</style>

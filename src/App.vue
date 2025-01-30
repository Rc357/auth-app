<template>
  <router-view />
</template>

<script>

export default {
  name: 'App',

}
</script>

<style>

/* Reset default margin and padding for all elements */
*,
*::before,
*::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* Remove default styles for common elements */
body {
    font-family: Arial, sans-serif; 
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.logo {
    width: 120px;
    margin-bottom: 20px;
  }


  .signup-container,
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: #f4f7fa;
  }
  .signup-box,
  .login-box {
    background: #fff;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    text-align: center;
  }
  
  .input-group {
    margin-bottom: 20px;
    position: relative;
  }
  
  .input-field {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 2px solid #ccc;
    border-radius: 5px;
    transition: border 0.3s;
  }

  .error-input {
    border-color: #f44336;
  }
  
  .error {
    color: #f44336;
    font-size: 12px;
    position: absolute;
    bottom: -18px;
    left: 0;
  }


  h1 {
    font-size: 28px;
    margin-bottom: 10px;
  }
  
  .subheading {
    color: #888;
    margin-bottom: 20px;
  }
  
  
  .input-field:focus {
    border-color: #007BFF;
  }
  
  .btn-signup,
  .btn-login {
    width: 100%;
    padding: 12px;
    font-size: 16px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .btn-login:hover {
    background-color: #0056b3;
  }
  
  .login-link,
  .signup-link {
    margin-top: 10px;
  }
  
  .login-link a,
  .signup-link a {
    color: #007BFF;
    text-decoration: none;
  }
  .login-link  a:hover,
  .signup-link a:hover {
    text-decoration: underline;
  }
</style>

<template>
    <Header @logout="logoutUser" />
    <div class="home-container">
        <h1>Welcome to Dashboard</h1>

        <!-- CRUD Section for Items -->
        <section class="crud-section">
            <h2>Item List</h2>
            <table class="item-table">
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Created</th>
                        <th>Updated</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in items" :key="item.id">
                        <td>{{ item.name }}</td>
                        <td v-if="item.createdAt">{{ formatDate(item.createdAt) }}</td>
                        <td v-if="item.updatedAt">{{ formatDate(item.updatedAt) }}</td>
                        <td>
                            <button class="edit-btn" :disabled="item.owner !== currentUserId" @click="editItem(item)">Edit</button>
                            <button class="delete-btn" :disabled="item.owner !== currentUserId" @click="deleteItem(item.id)">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Add or Edit Item -->
            <div class="item-form">
                <h2>{{ editing ? "Edit Item" : "Add Item" }}</h2>
                <input 
                    type="text" 
                    v-model="newItem" 
                    placeholder="Enter item name" 
                    class="item-input" 
                />
                <button 
                    @click="editing ? updateItem() : addItem()" 
                    class="submit-btn">
                    {{ editing ? "Update" : "Add" }}
                </button>
            </div>
        </section>
    </div>
</template>

<script>
import Header from './Header.vue'
import axios from 'axios'

export default {
    name: "HomePage",
    components: { Header },
    data() {
        return {
            API_URL:  `https://${process.env.VUE_APP_APP_URL}`,
            items: [],
            newItem: "",
            editing: false,
            editId: null,
            currentUserId: null 
        }
    },
    methods: {
        logoutUser() {
            localStorage.removeItem("user-info");
            this.$router.push({ name: 'LoginPage' });
        },
        async fetchItems() {
            try {
                const response = await axios.get(this.API_URL+"/items");
                let allItems = response.data;
                allItems.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                this.items = response.data;
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        },
        async addItem() {
            if (!this.newItem.trim()) {
                alert("Item name cannot be empty.");
                return;
            }
             // Retrieve the current user's ID from local storage.
            const userInfo = JSON.parse(localStorage.getItem("user-info"));
            const userId = userInfo ? userInfo.id : null;
            if (!userId) {
                alert("User not logged in.");
                return;
            }
            try {
                const response = await axios.post(this.API_URL+"/items", {
                    name: this.newItem,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    owner: userId 
                });
                if (response.status === 201) {
                    this.items.push(response.data); 
                    this.newItem = ""; 
                }
            } catch (error) {
                console.error("Error adding item:", error);
            }
        },
        editItem(item) {
            this.newItem = item.name;
            this.editing = true;
            this.editId = item.id;
        },
        async updateItem() {
        if (!this.newItem.trim()) return;

        // Get user ID
        const userInfo = JSON.parse(localStorage.getItem("user-info"));
        const userId = userInfo ? userInfo.id : null;

        const originalItem = this.items.find(item => item.id === this.editId);
        if (!originalItem) return;

        const updatedData = {
            name: this.newItem.trim(),
            createdAt: originalItem.createdAt,
            updatedAt: new Date().toISOString(),
            owner: userId
        };

        try {
            // Send the update request
            const response = await axios.put(
            this.API_URL+`/items/${this.editId}`,
            updatedData
            );
            const updatedItem = response.data;
            this.items = this.items.map(item =>
            item.id === this.editId ? { ...item, ...updatedItem } : item
            );
            this.resetForm();
        } catch (error) {
            console.error("Error updating item:", error);
        }
        },

            async deleteItem(id) {
            // Get user ID
            const userInfo = JSON.parse(localStorage.getItem("user-info"));
            const userId = userInfo ? userInfo.id : null;

            try {
                await axios.delete(this.API_URL+`/items/${id}?userId=${userId}`);
                this.items = this.items.filter(item => item.id !== id);
            } catch (error) {
                console.error("Error deleting item:", error);
            }
            },

        resetForm() {
            this.newItem = "";
            this.editing = false;
            this.editId = null;
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`; // Format: dd/mm/yyyy
        }
    },
    mounted() {
        const user = localStorage.getItem('user-info');
        if (!user) {
            this.$router.push({ name: 'LoginPage' });
        } else {
            const parsedUser = JSON.parse(user);
            this.currentUserId = parsedUser.id; 
            this.fetchItems();
        }
    }
}
</script>

<style scoped>
.home-container {
    padding: 20px;
    text-align: center;
}

.crud-section {
    margin-top: 20px;
    max-width: 80%;
    margin: 0 auto;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #f9f9f9;
}

h2 {
    font-size: 1.5rem;
    margin-bottom: 10px;
}

.item-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
}

.item-table th,
.item-table td {
    padding: 10px;
    border: 1px solid #ddd;
    text-align: center;
}

.item-table th {
    background-color: #f4f4f4;
}

.item-table td {
    background-color: #fff;
}

.item-table tr:hover {
    background-color: #f0f0f0;
}

button {
    cursor: pointer;
    padding: 6px 12px;
    font-size: 14px;
    border: none;
    border-radius: 5px;
    transition: background-color 0.3s;
    margin-right: 10px; 
}

.edit-btn {
    background-color: #f39c12;
    color: white;
}

.edit-btn:hover {
    background-color: #e67e22;
}

.delete-btn {
    background-color: #e74c3c;
    color: white;
}

.delete-btn:hover {
    background-color: #c0392b;
}

.item-form {
    margin-top: 20px;
}

.item-input {
    width: 80%;
    padding: 8px;
    font-size: 14px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-sizing: border-box;
}

.submit-btn {
    padding: 10px 20px;
    background-color: #2ecc71;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
}

.submit-btn:hover {
    background-color: #27ae60;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

</style>

// HTML-da "avatar" elementini olib tashlash va "group"ni select qilish uchun
const addUserForm = document.getElementById("add-user-form")
const studentTable = document
    .getElementById("student-list")
    .getElementsByTagName("tbody")[0]
const teacherTable = document
    .getElementById("teacher-list")
    .getElementsByTagName("tbody")[0]

const formButton = addUserForm.querySelector("button[type='submit']") // Formadagi tugma
let editingUserId = null // Tahrirlanayotgan foydalanuvchi ID'si

function fetchUsers() {
    fetch("https://crm-1pv8.onrender.com/db")
        .then((response) => response.json())
        .then((users) => {
            studentTable.innerHTML = ""
            teacherTable.innerHTML = ""

            users.forEach((user) => {
                let row = ""
                if (user.role === "student") {
                    row = studentTable.insertRow()
                } else if (user.role === "teacher") {
                    row = teacherTable.insertRow()
                }

                if (row) {
                    row.innerHTML = `
                        <td>${user.username}</td>
                        <td>${user.name} ${user.surname}</td>
                        <td>${user.role}</td>
                        <td>${user.group || "N/A"}</td>
                        <td class="actionBtns">
                        <button class="editUser" onclick="editUser(${user.id})"><i class="fa-regular fa-pen-to-square"></i></button>
                        <button class="deleteUser" onclick="deleteUser(${user.id})"><i class="fa-regular fa-trash-can"></i></button>
                        ${
                            user.role === "student"
                                ? `<button class="coinBtn" onclick="editCoins(${user.id})"><i class="fa-solid fa-coins"></i></button>`
                                : ""
                        }
                        </td>
                    `
                }
            })
        })
        .catch((error) => console.error("Error fetching users:", error))
}

// Foydalanuvchi coinsini tahrirlash
function editCoins(userId) {
    fetch(`https://crm-1pv8.onrender.com/db/${userId}`)
        .then((response) => response.json())
        .then((user) => {
            if (user.role === "student") {
                const newCoins = prompt(
                    `Edit coins for ${user.username}`,
                    user.coins
                )
                if (newCoins !== null) {
                    // Coinsni yangilash
                    fetch(`https://crm-1pv8.onrender.com/db/${userId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({...user, coins: newCoins}),
                    })
                        .then((response) => response.json())
                        .then(() => {
                            alert("Coins updated successfully")
                            fetchUsers() // Ro‘yxatni yangilash
                        })
                        .catch((error) =>
                            console.error("Error updating coins:", error)
                        )
                }
            } else {
                alert("Only students' coins can be edited.")
            }
        })
        .catch((error) => console.error("Error fetching user:", error))
}

// Foydalanuvchilarni qo'shish yoki tahrir qilish
addUserForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const username = document.getElementById("username").value

    // Yangi foydalanuvchi qo'shishdan oldin, username ni tekshirish
    fetch("https://crm-1pv8.onrender.com/db")
        .then((response) => response.json())
        .then((users) => {
            const existingUser = users.find(
                (user) => user.username === username
            )

            if (existingUser) {
                // Agar username allaqachon mavjud bo'lsa, alert chiqarish
                alert("Username already exists, please choose a different one.")
            } else {
                // Yangi foydalanuvchi qo‘shish
                const newId = Date.now().toString() // IDni vaqt tamg‘asiga asoslash va string formatga o'tkazish

                const userData = {
                    id: newId, // ID string sifatida qo'shish
                    role: document.getElementById("role").value,
                    name: document.getElementById("name").value,
                    surname: document.getElementById("surname").value,
                    group: document.getElementById("group").value,
                    phone: document.getElementById("phone").value,
                    username: document.getElementById("username").value,
                    password: document.getElementById("password").value,
                    coins: 0, // Coins default 0 for new users
                }

                if (editingUserId) {
                    // Agar tahrir holatida bo‘lsa, yangilash
                    fetch(`https://crm-1pv8.onrender.com/db/${editingUserId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(userData),
                    })
                        .then((response) => response.json())
                        .then(() => {
                            alert("User updated successfully")
                            fetchUsers() // Ro‘yxatni yangilash
                            resetForm() // Formani qayta tiklash
                        })
                        .catch((error) =>
                            console.error("Error updating user:", error)
                        )
                } else {
                    // Yangi foydalanuvchini qo‘shish
                    fetch("https://crm-1pv8.onrender.com/db", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(userData),
                    })
                        .then((response) => response.json())
                        .then(() => {
                            alert("User added successfully")
                            fetchUsers() // Ro‘yxatni yangilash
                            addUserForm.reset() // Formani tozalash
                        })
                        .catch((error) =>
                            console.error("Error adding user:", error)
                        )
                }
            }
        })
        .catch((error) => console.error("Error checking username:", error))
})

function editUser(userId) {
    const userIdStr = userId.toString()

    fetch(`https://crm-1pv8.onrender.com/db/${userIdStr}`)
        .then((response) => response.json())
        .then((user) => {
            document.getElementById("name").value = user.name
            document.getElementById("surname").value = user.surname
            document.getElementById("role").value = user.role
            document.getElementById("group").value = user.group || ""
            document.getElementById("phone").value = user.phone
            document.getElementById("username").value = user.username
            document.getElementById("password").value = user.password

            editingUserId = userIdStr
            formButton.textContent = "Edit User" // Tugma matnini o'zgartirish
        })
        .catch((error) => console.error("Error editing user:", error))
}

function deleteUser(userId) {
    const userIdStr = userId.toString()

    if (confirm("Are you sure you want to delete this user?")) {
        fetch(`https://crm-1pv8.onrender.com/db/${userIdStr}`, {
            method: "DELETE",
        })
            .then(() => {
                alert("User deleted successfully")
                fetchUsers() // Ro‘yxatni yangilash
            })
            .catch((error) => console.error("Error deleting user:", error))
    }
}

function resetForm() {
    addUserForm.reset()
    formButton.textContent = "Add User"
    editingUserId = null
}

const logoutButton = document.getElementById("logout-button")

if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        localStorage.clear()
        window.location.href = "login.html"
    })
}

fetchUsers()

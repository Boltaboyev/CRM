// DOM elementlariga ulanish
const studentListTable = document.getElementById("student-list")

// Foydalanuvchilarni olish
function fetchStudents() {
    fetch("http://localhost:4000/users?role=student")
        .then((response) => response.json())
        .then((students) => {
            studentListTable.innerHTML = "" // Ro‘yxatni tozalash
            students.forEach((student) => {
                const row = studentListTable.insertRow()
                row.innerHTML = `
          <td>${student.name} ${student.surname}</td>
          <td>${student.group || "N/A"}</td>
          <td>${student.coins}</td>
          <td>
            <input type="number" id="coin-input-${
                student.id
            }" value="0" min="0" max="5">
            <button onclick="addCoins(${student.id})">Add Coins</button>
          </td>
        `
            })
        })
        .catch((error) => console.error("Error fetching students:", error))
}

// Coin qo'shish
function addCoins(studentId) {
    const coinInput = document.getElementById(`coin-input-${studentId}`)
    let coinsToAdd = parseInt(coinInput.value, 10)

    // Yangi coinlar soni manfiy yoki 0 bo'lishi mumkin emas
    if (isNaN(coinsToAdd) || coinsToAdd <= 0) {
        alert("Please enter a valid number of coins.")
        return
    }

    // 1 marta qo'shish mumkin bo'lgan coins soni 5 ta bilan cheklangan
    if (coinsToAdd > 5) {
        alert("You can only add up to 5 coins at a time.")
        return
    }

    // O'quvchining ma'lumotlarini olish va coinsni yangilash
    fetch(`http://localhost:4000/users/${studentId}`)
        .then((response) => response.json())
        .then((student) => {
            const newCoins = student.coins + coinsToAdd

            // Yangi coins qiymati bilan o'quvchini yangilash
            fetch(`http://localhost:4000/users/${studentId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({coins: newCoins}),
            })
                .then(() => {
                    alert(
                        `${coinsToAdd} coins added to ${student.name}'s account!`
                    )
                    fetchStudents() // Ro'yxatni yangilash
                })
                .catch((error) => console.error("Error adding coins:", error))
        })
        .catch((error) => console.error("Error fetching student:", error))

    // Inputni 0 ga qaytarish
    coinInput.value = 0
}

// Foydalanuvchilar ro‘yxatini yuklash
fetchStudents()

// DOM elementlariga ulanish
// const studentListTable = document.getElementById("student-list")

// Teacher ma'lumotlarini olish va guruhga tegishli o'quvchilarni ko'rsatish
function fetchTeacherGroupStudents() {
    const teacherId = localStorage.getItem("userId") // Teacher ID sini olish

    if (!teacherId) {
        alert("You are not logged in.")
        window.location.href = "login.html" // Login qilmagan bo‘lsa, login sahifasiga yo‘naltirish
        return
    }

    // Teacherning guruhini olish
    fetch(`http://localhost:4000/users/${teacherId}`)
        .then((response) => response.json())
        .then((teacher) => {
            const teacherGroup = teacher.group // Teacherning guruhini olish

            if (!teacherGroup) {
                alert("Group information is not available for this teacher.")
                return
            }

            // O'quvchilarning faqat teacherning guruhiga tegishlilarini olish
            fetch(
                `http://localhost:4000/users?role=student&group=${teacherGroup}`
            )
                .then((response) => response.json())
                .then((students) => {
                    studentListTable.innerHTML = "" // Ro‘yxatni tozalash
                    students.forEach((student) => {
                        const row = studentListTable.insertRow()
                        row.innerHTML = `
                            <td>${student.name} ${student.surname}</td>
                            <td>${student.group || "N/A"}</td>
                            <td>${student.coins}</td>
                            <td>
                                <input type="number" id="coin-input-${
                                    student.id
                                }" value="0" min="0" max="5">
                                <button onclick="addCoins(${
                                    student.id
                                })">Add Coins</button>
                            </td>
                        `
                    })
                })
                .catch((error) =>
                    console.error("Error fetching students:", error)
                )
        })
        .catch((error) => console.error("Error fetching teacher data:", error))
}

// Coin qo'shish
function addCoins(studentId) {
    const coinInput = document.getElementById(`coin-input-${studentId}`)
    let coinsToAdd = parseInt(coinInput.value, 10)

    // Yangi coinlar soni manfiy yoki 0 bo'lishi mumkin emas
    if (isNaN(coinsToAdd) || coinsToAdd <= 0) {
        alert("Please enter a valid number of coins.")
        return
    }

    // 1 marta qo'shish mumkin bo'lgan coins soni 5 ta bilan cheklangan
    if (coinsToAdd > 5) {
        alert("You can only add up to 5 coins at a time.")
        return
    }

    // O'quvchining ma'lumotlarini olish va coinsni yangilash
    fetch(`http://localhost:4000/users/${studentId}`)
        .then((response) => response.json())
        .then((student) => {
            const newCoins = student.coins + coinsToAdd

            // Yangi coins qiymati bilan o'quvchini yangilash
            fetch(`http://localhost:4000/users/${studentId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({coins: newCoins}),
            })
                .then(() => {
                    alert(
                        `${coinsToAdd} coins added to ${student.name}'s account!`
                    )
                    fetchTeacherGroupStudents() // Ro'yxatni yangilash
                })
                .catch((error) => console.error("Error adding coins:", error))
        })
        .catch((error) => console.error("Error fetching student:", error))

    // Inputni 0 ga qaytarish
    coinInput.value = 0
}

// Logout funksiyasi
const logoutButton = document.getElementById("logout-button")

if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        // localStorage ni tozalash
        localStorage.clear()

        // Foydalanuvchini login sahifasiga yo'naltirish
        window.location.href = "login.html"
    })
}

// Teacherning guruhiga tegishli o'quvchilarni yuklash
fetchTeacherGroupStudents()

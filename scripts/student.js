const studentInfo = document.getElementById("student-info")
const avatar = document.getElementById("avatar")
const updateForm = document.getElementById("update-form")

const studentId = localStorage.getItem("userId")

// O‘quvchi malumotlarini olish
function fetchStudent() {
    const studentId = localStorage.getItem("userId")

    if (!studentId) {
        alert("You are not logged in.")
        window.location.href = "login.html" // Agar login qilmagan bo‘lsa, login sahifasiga yo‘naltirish
        return
    }

    fetch(`https://crm-1pv8.onrender.com/db/users/${studentId}`)
        .then((response) => response.json())
        .then((student) => {
            studentInfo.innerHTML = `
                <p><strong>Name:</strong> ${student.name} ${student.surname}</p>
                <p><strong>Group:</strong> ${student.group || "N/A"}</p>
                <p><strong>Coins:</strong> ${student.coins}</p>
            `
            

            // Guruhga qarab o'quvchilarni ko'rsatish
            fetchStudentsGroup(student.group) // Studentning guruhini parametr sifatida uzatamiz
        })
        .catch((error) => console.error("Error fetching student data:", error))
}

fetchStudent()

// O‘quvchilarni guruhga qarab tartiblash va rankni ko‘rsatish
function fetchStudentsGroup() {
    const studentId = localStorage.getItem("userId") // Joriy foydalanuvchi ID sini olish

    if (!studentId) {
        alert("You are not logged in.")
        window.location.href = "login.html" // Agar login qilmagan bo‘lsa, login sahifasiga yo‘naltirish
        return
    }

    // Joriy foydalanuvchi ma'lumotlarini olish
    fetch(`https://crm-1pv8.onrender.com/db/users/${studentId}`)
        .then((response) => response.json())
        .then((currentStudent) => {
            const targetGroup = currentStudent.group // Foydalanuvchining guruhini olish

            if (!targetGroup) {
                alert("Group information is not available for this user.")
                return
            }

            // Foydalanuvchilarning guruh bo'yicha malumotlarini olish
            fetch("https://crm-1pv8.onrender.com/db/users")
                .then((response) => response.json())
                .then((users) => {
                    // Faol o'quvchilarni olish (admin va teacher'larsiz)
                    const students = users.filter(
                        (user) => user.role === "student"
                    )

                    // Guruhga qarab filtrlash
                    const groupStudents = students.filter(
                        (student) => student.group === targetGroup
                    )

                    // Jadvalni tozalash
                    const studentRankTable = document
                        .getElementById("student-rank-table")
                        .getElementsByTagName("tbody")[0]
                    studentRankTable.innerHTML = "" // Jadvalni tozalash

                    // Guruhni coins miqdoriga qarab tartiblash
                    groupStudents.sort((a, b) => b.coins - a.coins)

                    // Har bir studentni jadvalga qo'shish
                    groupStudents.forEach((student, index) => {
                        const row = studentRankTable.insertRow()
                        row.innerHTML = `
                            <td>${student.name} ${student.surname}</td>
                            <td>${student.coins}</td>
                            <td>${student.group}</td>
                            <td>${index + 1}</td>  <!-- Rankni ko'rsatish -->
                        `
                    })
                })
                .catch((error) =>
                    console.error("Error fetching students:", error)
                )
        })
        .catch((error) =>
            console.error("Error fetching current student data:", error)
        )
}

// fetchStudentsGroup() funksiyasini chaqirish
fetchStudentsGroup()

// Foydalanuvchilarning coins miqdori bo'yicha tartiblash va rankni hisoblash
function fetchStudents() {
    fetch("https://crm-1pv8.onrender.com/db/users")
        .then((response) => response.json())
        .then((users) => {
            // Faol o'quvchilarni olish (admin va teacher'larsiz)
            const students = users.filter((user) => user.role === "student")

            // Coins miqdoriga qarab tartiblash (eng ko'p coinsga ega bo'lgan yuqorida)
            students.sort((a, b) => b.coins - a.coins)

            const studentList = document.getElementById("student-list")
            studentList.innerHTML = "" // Ro'yxatni tozalash

            students.forEach((student, index) => {
                const row = studentList.insertRow()
                row.innerHTML = `
                    <td>${student.name} ${student.surname}</td>
                    <td>${student.group}</td>
                    <td>${student.coins}</td>
                    <td>${index + 1}</td>  <!-- Rankni ko'rsatish -->
                `
            })
        })
        .catch((error) => console.error("Error fetching students:", error))
}

// Coins bo'yicha rankni hisoblash
function calculateRank(coins) {
    if (coins >= 50) {
        return "1st place"
    } else if (coins >= 30) {
        return "2nd place"
    } else if (coins >= 10) {
        return "3rd place"
    } else {
        return "Participant"
    }
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

fetchStudents()

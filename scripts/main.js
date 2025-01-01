// Sahifalar yuklanganda, foydalanuvchining statusini tekshirish
window.addEventListener("load", () => {
    const userId = localStorage.getItem("userId")

    // Agar foydalanuvchi login qilmagan bo'lsa, faqat index va login sahifalariga kirishiga ruxsat berish
    if (!userId) {
        if (
            window.location.pathname !== "/index.html" &&
            window.location.pathname !== "/login.html"
        ) {
            window.location.href = "index.html" // Login yoki index sahifasiga yo'naltirish
        }
    } else {
        // Agar foydalanuvchi login qilgan bo'lsa, ro'lini tekshirib to'g'ri sahifaga yo'naltirish
        fetch("https://crm-1pv8.onrender.com/db/users/" + userId)
            .then((response) => response.json())
            .then((user) => {
                if (user) {
                    // Login qilgan foydalanuvchini ro'liga mos sahifaga yo'naltirish
                    if (
                        window.location.pathname === "/index.html" ||
                        window.location.pathname === "/login.html"
                    ) {
                        // Agar foydalanuvchi login qilingan bo'lsa, uni o'z ro'liga mos sahifaga yo'naltirish
                        if (user.role === "admin") {
                            window.location.href = "admin.html" // Admin sahifasiga yo‘naltirish
                        } else if (user.role === "teacher") {
                            window.location.href = "teacher.html" // Teacher sahifasiga yo‘naltirish
                        } else if (user.role === "student") {
                            window.location.href = "student.html" // Student sahifasiga yo‘naltirish
                        }
                    } else {
                        // Agar foydalanuvchi ro'liga mos bo'lmagan sahifada bo'lsa, uni qaytarish
                        if (
                            window.location.pathname === "/admin.html" &&
                            user.role !== "admin"
                        ) {
                            window.location.href = `${user.role}.html` // Admin sahifasiga kirish taqiqlanadi
                        } else if (
                            window.location.pathname === "/teacher.html" &&
                            user.role !== "teacher"
                        ) {
                            window.location.href = `${user.role}.html` // Teacher sahifasiga kirish taqiqlanadi
                        } else if (
                            window.location.pathname === "/student.html" &&
                            user.role !== "student"
                        ) {
                            window.location.href = `${user.role}.html` // Student sahifasiga kirish taqiqlanadi
                        }
                    }
                }
            })
            .catch((error) => console.error("Error fetching user data:", error))
    }
})

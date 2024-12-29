const loginForm = document.getElementById("login-form")
const usernameInput = document.getElementById("username")
const passwordInput = document.getElementById("password")
const logo = document.getElementById("login-logo")

let posX = 0,
    posY = 0
let directionX = 1,
    directionY = 1
const speed = 0.5

function moveLogo() {
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    posX += directionX * speed
    posY += directionY * speed

    if (posX + logo.offsetWidth >= windowWidth || posX <= 0) {
        directionX *= -1
    }
    if (posY + logo.offsetHeight >= windowHeight || posY <= 0) {
        directionY *= -1
    }

    logo.style.left = posX + "px"
    logo.style.top = posY + "px"

    requestAnimationFrame(moveLogo)
}

moveLogo()

loginForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const username = usernameInput.value
    const password = passwordInput.value

    fetch("http://localhost:4000/users")
        .then((response) => response.json())
        .then((users) => {
            const user = users.find(
                (user) =>
                    user.username === username && user.password === password
            )

            if (user) {
                localStorage.setItem("userId", user.id)

                if (user.role === "admin") {
                    window.location.href = "admin.html"
                } else if (user.role === "teacher") {
                    window.location.href = "teacher.html"
                } else if (user.role === "student") {
                    window.location.href = "student.html"
                }
            } else {
                showPopup("Invalid username or password!")
            }
        })
        .catch((error) => showPopup("Invalid username or password!"))
})

const popup = document.getElementById("loginPopup")
const closePopupButton = document.getElementById("closeLoginPopup")

function showPopup() {
    popup.style.right = "20px"
}

closePopupButton.addEventListener("click", (e) => {
    e.preventDefault()
    popup.style.right = "-100%" 
})

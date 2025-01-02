document.addEventListener("DOMContentLoaded", () => {
    const myCoinsElement = document.querySelector(".my-coins")
    const buyButtons = document.querySelectorAll("#buy-gift")

    let currentUser = null
    let currentUserCoins = 0

    const apiUrl = "http://localhost:4000/users"
    const telegramBotToken = "7480230294:AAFfmQoKpvFR56CI66qsbuRrkFQ9vCK5uQU"
    const telegramChatId = "-4780437225" 

    const userId = getUserIdFromLocalStorage()

    if (!userId) {
        alert("Foydalanuvchi aniqlanmadi! Iltimos, tizimga kiring.")
        return
    }

    fetch(`${apiUrl}/${userId}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(
                    "Foydalanuvchi ma'lumotlarini olishda xatolik yuz berdi"
                )
            }
            return response.json()
        })
        .then((userData) => {
            currentUser = userData
            currentUserCoins = userData.coins
            updateCoinsDisplay()
        })
        .catch((error) => console.error("API xatosi:", error))

    buyButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            const giftElement = event.target.parentElement
            const giftPrice = parseInt(
                giftElement.querySelector(".gift-price").textContent.trim(),
                10
            )
            const giftName = giftElement.querySelector("p").textContent.trim()

            if (currentUserCoins >= giftPrice) {
                showConfirmationPopup(giftName, giftPrice)
            } else {
                showPopup("Sizda yetarli coinlar mavjud emas!")
            }
        })
    })

    function updateCoinsDisplay() {
        myCoinsElement.innerHTML = `${currentUserCoins} <i class="fa-solid fa-coins"></i>`
    }

    function showPopup(message) {
        const popup = document.createElement("div")
        popup.classList.add("popup")
        popup.textContent = message

        document.body.appendChild(popup)

        setTimeout(() => {
            popup.remove()
        }, 3000)
    }

    function showConfirmationPopup(giftName, giftPrice) {
        const popup = document.createElement("div")
        popup.classList.add("confirmation-popup")

        popup.innerHTML = `
            <p>${giftName} sovg'asini olishga aminmisiz?</p>
            <button class="confirm-btn">Ha</button>
            <button class="cancel-btn">Yo'q</button>
        `

        document.body.appendChild(popup)

        const confirmBtn = popup.querySelector(".confirm-btn")
        const cancelBtn = popup.querySelector(".cancel-btn")

        confirmBtn.addEventListener("click", () => {
            popup.remove()
            sendTelegramNotification(giftName)
            processPurchase(giftPrice)
        })

        cancelBtn.addEventListener("click", () => {
            popup.remove()
        })
    }

    function processPurchase(giftPrice) {
        currentUserCoins -= giftPrice
        updateCoinsDisplay()

        fetch(`${apiUrl}/${userId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({coins: currentUserCoins}),
        }).catch((error) => console.error("API yangilash xatosi:", error))

        showPopup("So'rov yuborildi!")
    }

    function sendTelegramNotification(giftName) {
        const message = `Ism: ${currentUser.name} ${currentUser.surname}\n\n${giftName} sotib oldi`
        const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`

        fetch(telegramUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chat_id: telegramChatId,
                text: message,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        "Telegramga xabar yuborishda xatolik yuz berdi"
                    )
                }
            })
            .catch((error) => console.error("Telegram API xatosi:", error))
    }

    function getUserIdFromLocalStorage() {
        return localStorage.getItem("userId")
    }
})

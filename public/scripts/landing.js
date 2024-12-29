let loader = document.querySelector(".loader"),
    body = document.querySelector("body")
window.addEventListener("load", () => {
    loader.classList.add("loader_active")
    let interval = setInterval(removeLoader, 500)

    function removeLoader() {
        body.removeChild(loader)
        clearInterval(interval)
    }

    const form = document.getElementById("contactForm")
    const popupContainer = document.getElementById("popupContainer")
    const popupMessage = document.getElementById("popupMessage")
    const closePopupButton = document.getElementById("closePopup")

    function showPopup(message, isSuccess) {
        popupMessage.textContent = message
        popupMessage.style.color = isSuccess ? "green" : "red"
        popupContainer.classList.remove("hidden")
    }

    closePopupButton.addEventListener("click", () => {
        popupContainer.classList.add("hidden")
    })

    form.addEventListener("submit", async (e) => {
        e.preventDefault()

        const fullName = document.getElementById("fullName").value.trim()
        const number = document.getElementById("number").value.trim()

        const telegramBotToken =
            "7561312201:AAE3_gmQxQTRinpJudczrmPZrlKOY0ZhgDU"
        const telegramChatId = "-4630353819" 

        const message = `Yangi murojaat !\n\n\nIsm: ${fullName}\n\nTelefon: +998 ${number}`
        const url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chat_id: telegramChatId,
                    text: message,
                }),
            })

            if (response.ok) {
                showPopup("Tez orada siz bilan bog'lanamiz 😊", true)
                document.getElementById("fullName").value = ""
                document.getElementById("number").value = ""
            } else {
                const errorData = await response.json() 
                showPopup(`Xatolik yuz berdi keyinroq urinib ko'ring😔`, false)
            }
        } catch (error) {
            console.error("Tarmoq xatoligi:", error)
            showPopup("Tarmoq xatoligi 😔", false)
        }
    })

    popupContainer.addEventListener("click", (e) => {
        if (e.target === popupContainer) {
            popupContainer.classList.add("hidden")
        }
    })

    // tel number regex --------------------------------------------------------------------------------
    document
        .querySelector(".input-field")
        .addEventListener("input", (event) => {
            const input = event.target
            let value = input.value.replace(/\D/g, "")

            if (value.length > 2) {
                value = `(${value.substring(0, 2)}) ${value.substring(2)}`
            }
            if (value.length > 8) {
                value = `${value.substring(0, 8)}-${value.substring(8)}`
            }
            if (value.length > 11) {
                value = `${value.substring(0, 11)}-${value.substring(11, 13)}`
            }

            input.value = value
        })
})

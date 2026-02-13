import "./styles/index.css"
import logoImg from "./images/DiamanteCasino.png"
  const logo =  document.querySelector(".main__title-image")
logo.src = logoImg

const loginsDataContainer = document.querySelector(".logins__data-container")
const dateInput = document.querySelector(".logins__input")

const getLogins =  async () => {
     if (!dateInput.value) {
        alert("Selecciona una fecha")
        return
    }

    try {

        const response = await fetch(
            `https://bingotampicowebauth2-58a3ebcccca0.herokuapp.com/loginsByDay?fecha=${dateInput.value}`
        )

        const data = await response.json()
        console.log(data)

        renderLogins(data)

    } catch (error) {
        console.error("Error al obtener logins:", error)
    }
}


const renderLogins = (logins) => {
    loginsDataContainer.innerHTML = ""
      if (!Array.isArray(logins) || logins.length === 0) {
        loginsDataContainer.innerHTML = "<p>No hay logins en esa fecha</p>"
        return
    }

    logins.forEach((login) => {

        const nameElement = document.createElement("p")
        nameElement.classList.add("logins__data")
        nameElement.textContent = login.name;
        loginsDataContainer.appendChild(nameElement)

        const mobileElement = document.createElement("p");
        mobileElement.classList.add("logins__data")
        mobileElement.textContent = login.mobile
        loginsDataContainer.appendChild(mobileElement)
        

           const dateElement = document.createElement("p");
        dateElement.classList.add("logins__data")
        dateElement.textContent = login.loginDate
        loginsDataContainer.appendChild(dateElement)

        const hourElement = document.createElement("p");
        hourElement .classList.add("logins__data")
        hourElement.textContent = login.loginHour
        loginsDataContainer.appendChild(hourElement)
        
        
    })
}


dateInput.addEventListener("change", getLogins)

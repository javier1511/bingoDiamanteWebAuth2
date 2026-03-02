import "./styles/index.css"
import logoImg from "./images/DiamanteCasino.png"
import closeImg from "./images/close_40dp_1F1F1F_FILL0_wght400_GRAD0_opsz40.png"

  const logo =  document.querySelector(".main__title-image")
    logo.src = logoImg

    


// ===============================
// MODAL (Popup)
// ===============================
class Popup {
  constructor(selector) {
    this.selector = selector;

    // Reutiliza overlay existente si ya existe
    this.overlay = document.querySelector(".overlay");
    if (!this.overlay) {
      this.overlay = document.createElement("div");
      this.overlay.classList.add("overlay");
      document.body.appendChild(this.overlay);
    }
  }

  open() {
    this.overlay.classList.add("active");
    this.selector.classList.add("popup__opened");
  }

  close() {
    this.selector.classList.remove("popup__opened");
    this.overlay.classList.remove("active");
  }
}


const getPlayers = async () => {
  const response = await fetch('https://bingotampicowebauth2-58a3ebcccca0.herokuapp.com/player');

  if (!response.ok) {
    console.error("Error al obtener players", response.statusText);
    return [];
  }

  return await response.json();
};


const searchVisitasButton =  document.querySelector('.visitas__button')
const mobileInput = document.querySelector("#visitasInputMobile")
const idInput = document.querySelector("#visitasInputId")
const nameInput = document.querySelector("#visitasInputName")
const dataFetch =  document.querySelector(".cortesias__fetch-container")
console.log("dataFetch:", dataFetch);




const container = document.querySelector(".visit__modal-main")
const dataContainer = document.querySelector(".visit__modal-data-fetch-container")

const modalPopup = new Popup(container)
const modalMobile = document.querySelector("#modalMobile")
const modalName = document.querySelector("#modalName")





const displayPlayers = async () => {
    let queryMobile = modalMobile.value.trim().toLowerCase();
    let queryName =  modalName.value.trim().toLowerCase();

    const payload =  await getPlayers()

    let dataDisplay = payload
    .filter((evendata) => {
        const matchesMobile = queryMobile === '' || evendata.mobile?.includes(queryMobile);
        const matchesName = queryName === '' || evendata.name?.toLowerCase().includes(queryName);
        return matchesMobile && matchesName
    })
    .map((object) => {
        const {name, mobile, _id} = object;
        return `
        <p class="visit__modal-data-name" data-name="${name}" data-mobile="${mobile}" data-id="${_id}">${name}</p>
         <p class="visit__modal-data-name" data-name="${name}" data-mobile="${mobile}" data-id="${_id}">${mobile}</p>

 `;
    })
    .join('')

    dataContainer.innerHTML = dataDisplay|| '<p>No se encontraron registros.</p>';


        const valueName =  document.querySelectorAll(".visit__modal-data-name");

    valueName.forEach((element) => {
         

        element.addEventListener('click', (event) => {

            const {mobile, id, name} = event.target.dataset
            console.log("target:", event.target);
console.log("dataset:", event.target.dataset);


            mobileInput.value = mobile
            idInput.value = id
            nameInput.value = name


            modalPopup.close()



        })
    })

}

displayPlayers()
modalMobile.addEventListener('input', displayPlayers)
modalName.addEventListener('input', displayPlayers)
mobileInput.addEventListener('click', () => modalPopup.open())
const closeModal =  document.querySelector(".visit__modal-close")
closeModal.src = closeImg
closeModal.addEventListener('click', () => modalPopup.close ())


const validateSearch = () => {
  const id = idInput.value.trim();

  if (id === "") return "El id no puede ir vacío";

  return null;
};



searchVisitasButton.addEventListener("click", async (event) => {
    event.preventDefault()

    dataFetch.innerHTML = "";

    const error =  validateSearch();
    if(error){
        alert(error);
        return;
    }

    console.log("idInput.value:", idInput.value);

    try {
        const response =  await fetch(`https://bingotampicowebauth2-58a3ebcccca0.herokuapp.com/cortesias/${idInput.value}`)

        if(!response.ok) {
            alert("jugador no encontrado")
            return;
        }

        const data =  await response.json()
        console.log(data)

dataFetch.innerHTML = data.map((c) => `

    <p>${c.name}</p>
    <p>${c.mobile}</p>
    <p>${c.loginDate}</p>
    <p>${c.loginHour}</p>
    <p>${c.cortesias}</p>
  
`).join("");



        
    } catch (error) {
            console.error("Error en fetch", error);
    alert("Error al conectar con el servidor");
        
    }

})
import "./styles/index.css"
import closeImg from "./images/close_40dp_1F1F1F_FILL0_wght400_GRAD0_opsz40.png"
import logoImg from "./images/DiamanteCasino.png"
  const logo =  document.querySelector(".main__title-image")
    logo.src = logoImg
const registerButton = document.querySelector('#registerButton');
   const registermMobile = document.querySelector('#mobile')
    const registerName = document.querySelector('#name')
    const registroFecha = document.querySelector('#date')
    const registroHora = document.querySelector('#time');
  




const validateRegisterForm = function () {
  const errors = [];

  const mobile = registermMobile.value.trim();
  const name = registerName.value.trim();
  const fecha = registroFecha.value;
  const hora = registroHora.value;

  if (name.length < 3) {
    errors.push('El nombre debe tener al menos 3 caracteres');
  }

  const phonePattern = /^\d{10}$/; // exactamente 10 dígitos
  if (!phonePattern.test(mobile)) {
    errors.push('El teléfono debe tener exactamente 10 dígitos y solo números');
  }

  if (mobile === '1234567890') {
    errors.push('El teléfono no puede ser 1234567890');
  }

  if (fecha === '') {
    errors.push('La fecha no puede ir vacía');
  }

  if (hora === '') {
    errors.push('La hora no puede ir vacía');
  }

  return errors;
};
    


    const errorMessages = document.querySelector('#errorMessages')


registerButton.addEventListener('click', async(event) => {

event.preventDefault();

errorMessages.innerHTML = '';
const formError = validateRegisterForm()
if(formError.length > 0) {
    formError.forEach(error => {
        const errorItem = document.createElement('div')
            errorItem.textContent = error;
            errorMessages.appendChild(errorItem)

    })
    return
}





    try {

        const body = {
            mobile:registermMobile.value,
            name:registerName.value.toUpperCase(),
            registroFecha: registroFecha.value,
            registroHora: registroHora.value
        }
    

        const response = await fetch(`https://bingotampicowebauth2-58a3ebcccca0.herokuapp.com/player/signup`, {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(body)
        })


           const data = await response.json();
    console.log(data);

    if (!response.ok) {
      alert(data.message || "Error al registrar");
      return;
    }

    alert("Jugador registrado correctamente");
        
    } catch (error) {
          console.error("Error en registro", error);
        
    }
})



const currentTimeInFormOnload = () => {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        const currentTime = `${hours}:${minutes}:${seconds}`;

        const timeInput = document.querySelector("#time");
        const timevisit = document.querySelector('#timeVisit')
        if(timeInput) {
            timeInput.value = currentTime;

        }else{
            console.warn('No encontre el input de #time');
        }

         if(timevisit) {
            timevisit.value = currentTime;

        }else{
            console.warn('No encontre el input de #time');
        }


}

window.addEventListener('load', currentTimeInFormOnload);


const currentDateInformOnLoad = () => {
  const now = new Date();
  const day   = String(now.getDate()  ).padStart(2, '0');
  const month = String(now.getMonth()+1).padStart(2, '0');
  const year  = now.getFullYear();

  const formattedDate = `${year}-${month}-${day}`;
  const input = document.querySelector('#date');
  const visitDate = document.querySelector("#dateVisit")
  if (input) {
    input.value = formattedDate;
    console.log('Fecha asignada:', input.value);
  } else {
    console.warn('No encontré el input #date');
  }

    if (input) {
    visitDate.value = formattedDate;
    console.log('Fecha asignada:', visitDate.value);
  } else {
    console.warn('No encontré el input #dateVisit');
  }
};

// 2) Conecta tu función al evento load **una sola vez**
window.addEventListener('load', currentDateInformOnLoad);


class Popup {
    constructor(selector) {
        this.selector = selector;
        this.overlay = document.createElement("div");
        this.overlay.classList.add("overlay");
        document.body.appendChild(this.overlay); // Agrega el overlay al DOM
    }

    openPopup() {
        this.overlay.classList.add("active"); // Activa el overlay
        this.selector.classList.add("popup__opened");
    }

    closePopup() {
        this.selector.classList.remove("popup__opened");
        this.overlay.classList.remove("active"); // Oculta el overlay
    }
}





const mobileVisit = document.querySelector('#mobileVisit')
const nameVisit =  document.querySelector('#nameVisit')
const idVisit =  document.querySelector("#idVisit")
  const visitDate = document.querySelector("#dateVisit")
const timevisit = document.querySelector('#timeVisit')

const container = document.querySelector(".visit__modal-main")
const dataContainer = document.querySelector(".visit__modal-data-fetch-container")
const modalPopup = new Popup(container)
const modalMobile = document.querySelector("#modalMobile")
const modalName = document.querySelector("#modalName")

const getPlayers = async () => {
  const response = await fetch('https://bingotampicowebauth2-58a3ebcccca0.herokuapp.com/player');

  if (!response.ok) {
    console.error("Error al obtener players", response.statusText);
    return [];
  }

  return await response.json();
};

// 👉 Obtener y mostrar la data en consola
(async () => {
  const players = await getPlayers();
  console.log("Players:", players);
})();


const formatearFecha = iso => {
    if (!iso) return '';
    const [year, month, day] = iso.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
};


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

            const {mobile, name, id} = event.target.dataset
            console.log("target:", event.target);
console.log("dataset:", event.target.dataset);


            mobileVisit.value = mobile
            nameVisit.value = name
            idVisit.value = id

            modalPopup.closePopup()



        })
    })

}

displayPlayers()
modalMobile.addEventListener('input', displayPlayers)
modalName.addEventListener('input', displayPlayers)
mobileVisit.addEventListener('click', () => modalPopup.openPopup())
const closeModal =  document.querySelector(".visit__modal-close")
closeModal.src = closeImg
closeModal.addEventListener('click', () => modalPopup.closePopup())


const validateRegisterFormVisit = function () {
  const errors = [];

  const mobile = mobileVisit.value.trim();
  const name = nameVisit.value.trim();
  const fecha = visitDate.value;
  const hora = timevisit.value;

  if (name.length < 3) {
    errors.push('El nombre debe tener al menos 3 caracteres');
  }

  const phonePattern = /^\d{10}$/; // exactamente 10 dígitos
  if (!phonePattern.test(mobile)) {
    errors.push('El teléfono debe tener exactamente 10 dígitos y solo números');
  }

  if (mobile === '1234567890') {
    errors.push('El teléfono no puede ser 1234567890');
  }

  if (fecha === '') {
    errors.push('La fecha no puede ir vacía');
  }

  if (hora === '') {
    errors.push('La hora no puede ir vacía');
  }

  return errors;
};
    




const errorMessagesVisit = document.querySelector('#errorMessagesVisit');
const visitButton = document.querySelector("#visitButton");

visitButton.addEventListener('click', async (event) => {
    event.preventDefault();

    // Limpiar errores
    errorMessagesVisit.innerHTML = '';

    const formErrorVisit = validateRegisterFormVisit();

    // 👉 Si hay errores, mostrarlos y salir
    if (formErrorVisit.length > 0) {
        formErrorVisit.forEach(error => {
            const errorItem = document.createElement('div');
            errorItem.textContent = error;
            errorMessagesVisit.appendChild(errorItem);
        });
        return;
    }

    // 👉 Si NO hay errores, continuar
    try {
        const body = {
    
       
            player:idVisit.value
     
        };

    const response = await fetch(`https://bingotampicowebauth2-58a3ebcccca0.herokuapp.com/player/signin`, {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(body)
        })


           const data = await response.json();
    console.log(data);

    if (!response.ok) {
      alert(data.message || "Error al registrar");
      return;
    }

    alert("Visita registrada exitosamente");

    } catch (error) {
        console.error('Error al registrar visita', error);
    }
});

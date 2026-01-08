import "./styles/index.css"
import logoImg from "./images/DiamanteCasino.png"
  const logo =  document.querySelector(".main__title-image")
    logo.src = logoImg

// ===============================
// ELEMENTOS
// ===============================
const dataButton = document.querySelector(".data__button");
const mobileInput = document.querySelector(".data__input");
const dataFetch = document.querySelector(".data__fetch");

const modalContainer = document.querySelector(".data__modal");
const closeModalButton = document.querySelector(".data__modal-close");

const modalId = document.querySelector("#id");
const modalName = document.querySelector("#modalName");
const modalMobile = document.querySelector("#modalMobile");
const modalButton = document.querySelector(".data__form-button");

// ===============================
// MODAL (Popup)
// ===============================
class Popup {
  constructor(selector) {
    this.selector = selector;
    this.overlay = document.createElement("div");
    this.overlay.classList.add("overlay");
    document.body.appendChild(this.overlay);
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

const modalPopup = new Popup(modalContainer);

// ===============================
// ESTADO (Jugador seleccionado)
// ===============================
let selectedPlayer = null;

// ===============================
// VALIDACIONES
// ===============================
const validateSearch = () => {
  const mobile = mobileInput.value.trim();
  if (mobile === "") return "El celular no puede ir vacío";
  return null;
};

const validateUpdate = () => {
  const name = modalName.value.trim();
  const mobile = modalMobile.value.trim();

  if (name === "") return "El nombre no puede ir vacío";
  if (mobile === "") return "El celular no puede ir vacío";
  if (!/^\d+$/.test(mobile)) return "El celular solo debe contener números";

  return null;
};

// ===============================
// 1) BUSCAR JUGADOR
// ===============================
dataButton.addEventListener("click", async (event) => {
  event.preventDefault();

  // limpiamos resultado anterior
  dataFetch.innerHTML = "";
  selectedPlayer = null;

  // validación
  const error = validateSearch();
  if (error) {
    alert(error);
    return;
  }

  try {
    const mobile = mobileInput.value.trim();
    const response = await fetch(
      `https://bingotampicowebauth2-58a3ebcccca0.herokuapp.com/player/mobile/${mobile}`
    );

    if (!response.ok) {
      alert("Jugador no encontrado");
      return;
    }

    const data = await response.json();

    // guardamos player en memoria (rápido de acceder)
    selectedPlayer = {
      _id: data._id,
      name: data.name,
      mobile: data.mobile,
    };

    // pintamos
    dataFetch.innerHTML = `
      <p class="data__value">${data._id}</p>
      <p class="data__value">${data.name}</p>
      <p class="data__value">${data.mobile}</p>
    `;
  } catch (error) {
    console.error("Error en fetch", error);
    alert("Error al conectar con el servidor");
  }
});

// ===============================
// 2) ABRIR MODAL (click en resultado)
// ===============================
dataFetch.addEventListener("click", (event) => {
  const item = event.target.closest(".data__value");
  if (!item) return;

  if (!selectedPlayer) {
    alert("Primero busca un jugador");
    return;
  }

  // llenamos inputs del modal
  modalId.value = selectedPlayer._id;
  modalName.value = selectedPlayer.name;
  modalMobile.value = selectedPlayer.mobile;

  modalPopup.open();
});

// ===============================
// 3) ACTUALIZAR JUGADOR (PUT)
// ===============================
modalButton.addEventListener("click", async (event) => {
  event.preventDefault();

  if (!selectedPlayer) {
    alert("Primero busca un jugador");
    return;
  }

  const error = validateUpdate();
  if (error) {
    alert(error);
    return;
  }

  try {
    const body = {
      _id: modalId.value,
      name: modalName.value.trim(),
      mobile: modalMobile.value.trim(),
    };

    const response = await fetch(
      `https://bingotampicowebauth2-58a3ebcccca0.herokuapp.com/player/${modalId.value}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      alert("Datos no actualizados");
      return;
    }

    alert("Jugador actualizado correctamente");

    // ✅ ACTUALIZAMOS selectedPlayer (FORMA LEGIBLE)
    selectedPlayer._id = modalId.value;
    selectedPlayer.name = modalName.value.trim();
    selectedPlayer.mobile = modalMobile.value.trim();

    // actualizamos lo que se ve en pantalla
    dataFetch.innerHTML = `
      <p class="data__value">${selectedPlayer._id}</p>
      <p class="data__value">${selectedPlayer.name}</p>
      <p class="data__value">${selectedPlayer.mobile}</p>
    `;

    modalPopup.close();
  } catch (error) {
    console.error("Error al actualizar", error);
    alert("Error al conectar con el servidor");
  }
});

// ===============================
// 4) CERRAR MODAL
// ===============================
closeModalButton.addEventListener("click", () => modalPopup.close());

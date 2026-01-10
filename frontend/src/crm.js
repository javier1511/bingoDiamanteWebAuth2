import "./styles/index.css";
import closeImg from "./images/close_40dp_1F1F1F_FILL0_wght400_GRAD0_opsz40.png";
import logoImg from "./images/DiamanteCasino.png";

const logo = document.querySelector(".main__title-image");
if (logo) logo.src = logoImg;

// ===============================
// MODAL (Popup)
// ===============================
let mobilesArray = []; // aquí guardaremos SOLO los mobiles filtrados (+52)

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

// ===============================
// ELEMENTOS DOM
// ===============================
const mobileModalContainer = document.querySelector(".mobile__modal");
const crmPopup = new Popup(mobileModalContainer);

const dataContainer = document.querySelector(".visit__modal-data-fetch-container");

const crmButton = document.querySelector(".visit__modal-button");
const closeMobileModal = document.querySelector(".visit__modal-close");
if (closeMobileModal) closeMobileModal.src = closeImg;

// Inputs
const modalMobile = document.querySelector("#modalMobile");
const modalName = document.querySelector("#modalName");
const modalVisits = document.querySelector("#modalVisits");

// ===============================
// FETCH PLAYERS
// ===============================
const getPlayers = async () => {
  const response = await fetch("https://bingotampicowebauth2-58a3ebcccca0.herokuapp.com/player");

  if (!response.ok) {
    console.error("Error al obtener players", response.statusText);
    return [];
  }

  return await response.json();
};

// ===============================
// RENDER MOBILES EN EL MODAL
// ===============================
const renderMobilesInModal = () => {
  const mobileDataContainer = document.querySelector(".mobile__modal-data-container");
  if (!mobileDataContainer) return;

  mobileDataContainer.innerHTML = "";

  if (!mobilesArray || mobilesArray.length === 0) {
    mobileDataContainer.innerHTML = "<p>Sin móviles filtrados</p>";
    return;
  }

  mobilesArray.forEach((mobile) => {
    const p = document.createElement("p");
    p.classList.add("mobile__item");
    p.textContent = mobile;
    mobileDataContainer.appendChild(p);
  });
};

// ===============================
// MOSTRAR PLAYERS FILTRADOS + GUARDAR mobilesArray
// ===============================
const displayPlayers = async () => {
  const queryMobile = (modalMobile?.value || "").trim();
  const queryName = (modalName?.value || "").trim().toLowerCase();
  const queryVisit = (modalVisits?.value || "").trim();

  const payload = await getPlayers();

  const filtered = payload.filter((player) => {
    const mobileValue = String(player.mobile || "");
    const nameValue = String(player.name || "").toLowerCase();
    const visitValue = String(player.totalLogins ?? "").toLowerCase();

    const matchesMobile = queryMobile === "" || mobileValue.includes(queryMobile);
    const matchesName = queryName === "" || nameValue.includes(queryName);
    const matchesVisits = queryVisit === "" || visitValue.includes(queryVisit);

    return matchesMobile && matchesName && matchesVisits;
  });

  mobilesArray = filtered.map((player) => `+52${String(player.mobile || "").trim()}`);

  // 🔎 CONTEO TOTAL
console.log("📱 mobilesArray (total):", mobilesArray.length);
console.log("📱 mobilesArray:", mobilesArray);
const subtitlesMobilesArray =  document.querySelector(".mobile__modal-subtitle")
subtitlesMobilesArray.textContent = mobilesArray.length

  const html = filtered
    .map((player) => {
      const name = player.name || "";
      const mobile = player.mobile || "";
      const id = player._id || "";
      const totalLogins = player.totalLogins ?? 0;

      return `
        <p class="visit__modal-data-name"
           data-name="${name}"
           data-mobile="${mobile}"
           data-id="${id}">
           ${name}
        </p>

        <p class="visit__modal-data-mobile"
           data-mobile="${mobile}"
           data-id="${id}">
           ${mobile}
        </p>

        <p class="visit__modal-data-total">
           ${totalLogins}
        </p>
      `;
    })
    .join("");

  if (dataContainer) {
    dataContainer.innerHTML = html || "<p>No se encontraron registros.</p>";
  }
};

// ===============================
// EVENTOS INPUT (FILTRADO EN TIEMPO REAL)
// ===============================
if (modalMobile) modalMobile.addEventListener("input", displayPlayers);
if (modalName) modalName.addEventListener("input", displayPlayers);
if (modalVisits) modalVisits.addEventListener("input", displayPlayers);

// ===============================
// ABRIR MODAL
// ===============================
if (crmButton) {
  crmButton.addEventListener("click", async () => {
    await displayPlayers();
    renderMobilesInModal();
    crmPopup.open();
  });
}

if (closeMobileModal) {
  closeMobileModal.addEventListener("click", () => crmPopup.close());
}

// ===============================
// INICIAL
// ===============================
displayPlayers();

// ===============================
// SMS
// ===============================
const smsTextInput = document.querySelector(".mobile__modal-input");
const sendSmsButton = document.querySelector(".mobile__modal-button");


// ✅ lock anti doble envío (aunque haya doble click o doble listener)
let isSending = false;

const sendSmsToFilteredMobiles = async () => {
  // si ya está enviando, NO envíes otra vez
  if (isSending) return;

  const from = "Diamante";
  const text = (smsTextInput?.value || "").trim();

  if (!text) {
    alert("El mensaje no puede ir vacío");
    return;
  }

  if (text.length > 159) {
    alert("El mensaje excede los 159 caracteres");
    return;
  }

  if (!mobilesArray || mobilesArray.length === 0) {
    alert("No hay móviles filtrados para enviar");
    return;
  }

  const to = Array.from(new Set(mobilesArray)).filter(Boolean);

  try {
    isSending = true;
    if (sendSmsButton) sendSmsButton.disabled = true;

    const response = await fetch("https://bingotampicowebauth2-58a3ebcccca0.herokuapp.com/sendsms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from, text, to }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      alert(data?.message || "Error al enviar los mensajes");
      return;
    }

    alert(
      `📩 Envío completado\n\n` +
        `Lote: ${data.batchId}\n` +
        `Enviados: ${data.sent}\n` +
        `Fallidos: ${data.failed}`
    );
  } catch (error) {
    console.error("Error enviando SMS:", error);
    alert("Error al conectar con el servidor");
  } finally {
    isSending = false;
    if (sendSmsButton) sendSmsButton.disabled = false;
  }
};

// ===============================
// EVENTO BOTÓN ENVIAR SMS (ANTI-DUPLICADO EN DEV)
// ===============================
// ✅ Si el bundle corre 2 veces, esto evita agregar el listener 2 veces.
if (!window.__smsClickListenerAdded) {
  window.__smsClickListenerAdded = true;

  if (sendSmsButton) {
    sendSmsButton.addEventListener("click", (e) => {
      e.preventDefault();
      sendSmsToFilteredMobiles();
    });
  }
}

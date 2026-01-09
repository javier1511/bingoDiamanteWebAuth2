import "./styles/index.css"
import closeImg from "./images/close_40dp_1F1F1F_FILL0_wght400_GRAD0_opsz40.png"
import logoImg from "./images/DiamanteCasino.png"
  const logo =  document.querySelector(".main__title-image")
    logo.src = logoImg

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
closeMobileModal.src = closeImg

// IMPORTANTE: estos inputs deben existir en tu HTML
// Si tus IDs/clases son distintos, cámbialos aquí
const modalMobile = document.querySelector("#modalMobile");
const modalName = document.querySelector("#modalName");
const modalVisits = document.querySelector("#modalVisits")

// ===============================
// FETCH PLAYERS
// ===============================
const getPlayers = async () => {
  const response = await fetch("http://localhost:3000/player");

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

  // Limpia para evitar duplicados
  mobileDataContainer.innerHTML = "";

  // Si no hay mobiles filtrados
  if (!mobilesArray || mobilesArray.length === 0) {
    mobileDataContainer.innerHTML = "<p>Sin móviles filtrados</p>";
    return;
  }

  // Mostrar uno por línea
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

  // Filtrar players (los que ves en la lista)
  const filtered = payload.filter((player) => {
    const mobileValue = String(player.mobile || "");
    const nameValue = String(player.name || "").toLowerCase();
    const visitValue =  String(player.totalLogins || "").toLowerCase();

    const matchesMobile = queryMobile === "" || mobileValue.includes(queryMobile);
    const matchesName = queryName === "" || nameValue.includes(queryName);
    const matchesVisits = queryVisit === "" || visitValue.includes(queryVisit);

    return matchesMobile && matchesName && matchesVisits;
  });

  // ✅ Guardar SOLO mobiles filtrados con +52
  mobilesArray = filtered.map((player) => `+52${player.mobile}`);

  // Render de la lista (nombre / mobile / totalLogins)
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

  dataContainer.innerHTML = html || "<p>No se encontraron registros.</p>";
};

// ===============================
// EVENTOS INPUT (FILTRADO EN TIEMPO REAL)
// ===============================
if (modalMobile) modalMobile.addEventListener("input", displayPlayers);
if (modalName) modalName.addEventListener("input", displayPlayers);
if (modalVisits) modalVisits.addEventListener("input", displayPlayers);
// ===============================
// ABRIR MODAL: AQUI QUIERES SOLO LOS FILTRADOS
// ===============================
crmButton.addEventListener("click", async () => {
  await displayPlayers();      // asegura filtro actualizado
  renderMobilesInModal();      // pinta SOLO los mobiles filtrados
  crmPopup.open();             // abre modal
});

// Cerrar modal
closeMobileModal.addEventListener("click", () => crmPopup.close());

// ===============================
// INICIAL
// ===============================
displayPlayers();





// ===============================
// SMS
// ===============================
const smsTextInput = document.querySelector(".mobile__modal-input");
const sendSmsButton = document.querySelector(".mobile__modal-button");

const sendSmsToFilteredMobiles = async () => {
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

  // Evitar duplicados
  const to = Array.from(new Set(mobilesArray));

  try {
    sendSmsButton.disabled = true;

    const response = await fetch("http://localhost:3000/sendsms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        text,
        to,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      alert(data?.message || "Error al enviar los mensajes");
      return;
    }

    // ✅ Resultado en ALERTA
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
    sendSmsButton.disabled = false;
  }
};

// ===============================
// EVENTO BOTÓN ENVIAR SMS
// ===============================
sendSmsButton.addEventListener("click", (e) => {
  e.preventDefault();
  sendSmsToFilteredMobiles();
});



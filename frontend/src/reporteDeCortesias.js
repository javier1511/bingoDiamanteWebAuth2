import "./styles/index.css"
import logoImg from "./images/DiamanteCasino.png"
  const logo =  document.querySelector(".main__title-image")
    logo.src = logoImg
const searchAforoButton =  document.querySelector('.aforo__input-button')
const starDate = document.querySelector("#fechaInicialAforoInput")
const endDate = document.querySelector("#fechaFinalAforoInput")
const dataFetch = document.querySelector(".aforo__fetch")


const validateSearch = () => {
    const fechaInicio =  starDate.value;
    const fechaFinal = endDate.value;

      if(fechaInicio === "") return "La fecha inicial no puede ir vacia"
  if(fechaFinal === "") return "La fecha final no puede ir vacia"
  return null;
}



searchAforoButton.addEventListener("click", async (event) => {

    event.preventDefault()

    dataFetch.innerHTML = "";

    const error =  validateSearch();
    if(error){
        alert(error)
        return;
    }

    try {

        const response = await fetch(`http://localhost:3000/cortesias/reporte?fechaInicio=${starDate.value}&fechaFin=${endDate.value}`)

        if(!response.ok){
            alert("Sin datos");
            return;
        }

   const data = await response.json();


// render por día
dataFetch.innerHTML = data.porDia.map(item => `
  <p class="total-rango">${item.loginDate}</p>
  <p class="total-rango">${item.playersDistintos}</p>
  <p class="total-rango">${item.totalCortesias}</p>
`).join("");

// (opcional) render totales al final
dataFetch.innerHTML += `

  <p class="total-rango"><b>TOTAL</b></p>
<p class="total-rango"><b>${data.totales.playersDistintos}</p>
  <p class="total-rango"><b>${data.totales.totalCortesias}</p>

`;

        
        
    } catch (error) {
            console.error("Error en fetch", error);
    alert("Error al conectar con el servidor");
    }


})
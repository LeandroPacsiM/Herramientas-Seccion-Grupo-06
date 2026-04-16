// ========================================
// BOOKING FUNCTIONALITY (skill-booking)
// Referencia: .github/copilot/skills/skill-booking.md
// ========================================

const travelers = document.getElementById('travelers');
const restaBtn = document.getElementById('resta');
const sumaBtn = document.getElementById('suma');
const reservarBtn = document.getElementById('reservarButton');
const dateInput = document.getElementById('date');
const viajerosDisplay = document.getElementById('viajerosDisplay');
const totalPriceElement = localStorage.getItem("precioViaje");
const viajerosModal = document.getElementById('viajerosModal');
const importeModal = document.getElementById('importeModal');

let counter = 1;

// Contador de Viajeros
if (restaBtn && travelers) {
  restaBtn.addEventListener('click', () => {
    if (parseInt(travelers.value) > 1) {
      travelers.value = parseInt(travelers.value) - 1;
      updateDisplay();
      validateForm();
    }
  });
}

if (sumaBtn && travelers) {
  sumaBtn.addEventListener('click', () => {
    travelers.value = parseInt(travelers.value) + 1;
    updateDisplay();
    validateForm();
  });
}

// Date Picker con validación de fecha mínima
if (typeof flatpickr === 'function' && dateInput) {
  flatpickr("#date", {
    dateFormat: "d-m-Y",
    minDate: new Date(),
    onChange: function() {
      validateForm();
      updateDisplay();
    }
  });
}

function updateDisplay() {
  if (!travelers) return;
  counter = parseInt(travelers.value);

  if (viajerosDisplay) {
    viajerosDisplay.textContent = counter;
  }
  
  // Actualizar modal si existe
  if (viajerosModal) {
    viajerosModal.textContent = `N° de Viajeros: ${counter}`;
  }
  
  // Calcular total si existe precio
  if (totalPriceElement) {
    const totalAmount = counter * totalPriceElement;
    if (importeModal) {
      importeModal.textContent = `S/ ${totalAmount}`;
    }
  }
}

function validateForm() {
  if (!dateInput || !travelers || !reservarBtn) return;
  const hasDate = dateInput.value.trim() !== "";
  const hasValidTravelers = parseInt(travelers.value) > 0;
  reservarBtn.disabled = !(hasDate && hasValidTravelers);
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  updateDisplay();
  validateForm();
});


// ========================================
// GALLERY FUNCTIONALITY (skill-gallery)
// Referencia: .github/copilot/skills/skill-gallery.md
// ========================================

let currentImageIndex = 0;
const images = [
  'img/index/carusel/destino-MacchuPicchu.jpg',
  'img/index/carusel/destino-MacchuPicchu.jpg',
  'img/index/carusel/destino-MacchuPicchu.jpg',
  'img/index/carusel/destino-MacchuPicchu.jpg'
];

function changeImage(thumbnail) {
  const featured = document.getElementById('featured');
  currentImageIndex = Array.from(document.querySelectorAll('.gallery-thumbnail'))
    .indexOf(thumbnail);
  featured.src = thumbnail.src;
  updateThumbnails();
  updateIndicator();
}

function previousImage() {
  currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
  updateGallery();
}

function nextImage() {
  currentImageIndex = (currentImageIndex + 1) % images.length;
  updateGallery();
}

function updateGallery() {
  document.getElementById('featured').src = images[currentImageIndex];
  updateThumbnails();
  updateIndicator();
}

function updateThumbnails() {
  document.querySelectorAll('.gallery-thumbnail').forEach((t, i) => {
    t.classList.toggle('active', i === currentImageIndex);
  });
}

function updateIndicator() {
  const indicator = document.querySelector('.gallery-indicator');
  if (indicator) {
    indicator.textContent = `${currentImageIndex + 1} de ${images.length}`;
  }
}

// Initialize gallery on page load
document.addEventListener('DOMContentLoaded', () => {
  updateThumbnails();
});



////////////////////////////////////////////////////////////////////////



const datosViajerosContainer = document.querySelector('.datosViajeros');

function createForms(numberOfForms) {
  datosViajerosContainer.innerHTML = '';

  for (let i = 0; i < numberOfForms; i++) {
    const formContainer = document.createElement('div');
    formContainer.classList.add('datosViajeros');

    formContainer.innerHTML = `
      <form id="formModal-${i + 1}" action="#" method="post">
        <div class="formDatosViajeros">
          <label for="nombre-${i + 1}">Nombres:</label><br>
          <input type="text" id="nombre-${i + 1}" name="nombre-${i + 1}" required>
        </div>
        <div class="formDatosViajeros">
          <label for="apellido-${i + 1}">Apellidos:</label> <br>
          <input type="text" id="apellido-${i + 1}" name="apellido-${i + 1}" required>
        </div>
        <div class="formDatosViajeros">
          <label for="correo-${i + 1}">Correo Electrónico:</label> <br>
          <input type="email" id="correo-${i + 1}" name="correo-${i + 1}" required>
        </div>
        <div class="formDatosViajeros">
          <label for="wsp-${i + 1}">Número de WhatsApp:</label> <br>
          <input type="tel" id="wsp-${i + 1}" name="wsp-${i + 1}" required>
        </div>
        <div class="formDatosViajeros">
          <label for="fecha-nacimiento-${i + 1}">Fecha de Nacimiento:</label> <br>
          <input type="date" id="fecha-nacimiento-${i + 1}" name="fecha-nacimiento-${i + 1}" required>
        </div>
      </form>
    `;

    datosViajerosContainer.appendChild(formContainer);
  }
}

function scrollDestinosLeft() {
  const destinosHorizontal = document.querySelector('.destinosHorizontal');
  destinosHorizontal.scrollBy({
      left: -250,
      behavior: 'smooth'
  });
}

function scrollDestinosRight() {
  const destinosHorizontal = document.querySelector('.destinosHorizontal');
  destinosHorizontal.scrollBy({
      left: 250,
      behavior: 'smooth'
  });
}

function cerrarPago() {
  const pagar = document.getElementById('pagar');
  if (!pagar) {
    return;
  }

  pagar.style.display = 'none';
  pagar.setAttribute('aria-hidden', 'true');

  if (reservarBtn) {
    reservarBtn.focus();
  }
}

function abrirModal() {
  const pagar = document.getElementById('pagar');
  if (!pagar) {
    return;
  }

  pagar.style.display = 'block';
  pagar.setAttribute('aria-hidden', 'false');
  pagar.focus();
}

function continuar() {
  const pago = document.getElementById('Pago');
  const contacto = document.getElementById('contacto');

  if (contacto) {
    contacto.style.display = 'none';
  }

  if (pago) {
    pago.style.display = 'block';
  }
}

function regresarADatos() {
  const pago = document.getElementById('Pago');
  const contacto = document.getElementById('contacto');

  if (pago) {
    pago.style.display = 'none';
  }

  if (contacto) {
    contacto.style.display = 'block';
  }
}

function populateTravelData() {
  const featured = document.getElementById('featured');
  const viaje = localStorage.getItem('viajeSeleccionado');
  const tituloTicket = localStorage.getItem('TituloTicket');
  const precioGuardado = localStorage.getItem('precioViaje');
  const descripcionViaje = localStorage.getItem('descripcionViaje');
  const descripcion2 = localStorage.getItem('descripcion-2');
  const descripcion3 = localStorage.getItem('descripcion-3');
  const dia1 = localStorage.getItem('dia1');
  const dia2 = localStorage.getItem('dia2');
  const listaEquipaje = localStorage.getItem('listaEquipaje');

  const galleryImage = localStorage.getItem('imagen');
  if (featured && galleryImage) {
    featured.src = galleryImage;
  }

  if (viaje) {
    const title = document.getElementById('tituloViaje');
    if (title) {
      title.textContent = `Reservar Viaje a ${viaje}`;
    }
  }

  if (tituloTicket) {
    const viajeModal = document.getElementById('viajeModal');
    const tituloTicketElement = document.getElementById('tituloTicket');

    if (viajeModal) {
      viajeModal.textContent = tituloTicket;
    }

    if (tituloTicketElement) {
      tituloTicketElement.textContent = tituloTicket;
    }
  }

  if (precioGuardado) {
    const precioViajeModal = document.getElementById('precioViajeModal');
    const subTotalModal = document.getElementById('subTotalModal');
    const totalSpan = document.querySelector('.total span');

    if (precioViajeModal) {
      precioViajeModal.innerText = `S/ ${precioGuardado}`;
    }

    if (subTotalModal) {
      subTotalModal.innerText = `S/ ${precioGuardado}`;
    }

    if (totalSpan) {
      totalSpan.innerText = `S/ ${precioGuardado}`;
    }
  }

  const descripcion1Element = document.getElementById('descripcionViaje');
  const descripcion2Element = document.getElementById('descripcionViaje-2');
  const descripcion3Element = document.getElementById('descripcionViaje-3');
  const dia1Element = document.getElementById('dia-1');
  const dia2Element = document.getElementById('dia-2');
  const listaEquipajeElement = document.getElementById('listaEquipaje');

  if (descripcion1Element) {
    descripcion1Element.textContent = descripcionViaje || '';
  }

  if (descripcion2Element) {
    descripcion2Element.textContent = descripcion2 || '';
  }

  if (descripcion3Element) {
    descripcion3Element.textContent = descripcion3 || '';
  }

  if (dia1Element) {
    dia1Element.innerHTML = dia1 || '';
  }

  if (dia2Element) {
    dia2Element.innerHTML = dia2 || '';
  }

  if (listaEquipajeElement) {
    listaEquipajeElement.innerHTML = listaEquipaje || '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  populateTravelData();
});

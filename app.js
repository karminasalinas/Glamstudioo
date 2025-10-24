 // ======================= app.js =======================
// Lógica de "Hacer pedido" para maquillaje.
// Lee el formulario, calcula total (producto * cantidad + extras + envío)
// y muestra un resumen. Mantengo estructura e IDs.

/** Utilidad: formatea a moneda MXN */
function toMXN(num) {
  return Number(num || 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
}

/** Utilidad: toma precio desde data-precio (en selects/checks) */
function getPrecioFromDataset(el) {
  const raw = el?.dataset?.precio;
  return raw ? Number(raw) : 0;
}

document.addEventListener('DOMContentLoaded', () => {
  // Referencias a elementos que usaremos:
  const form = document.getElementById('formPedido');
  const outNombre = document.getElementById('outNombre');
  const outLista  = document.getElementById('outLista');
  const outTotal  = document.getElementById('outTotal');
  const btnConfirmar = document.getElementById('btnConfirmar');
  const confirmNombre = document.getElementById('confirmNombre');

  // Toast UX (aviso corto)
  const toastBtn = document.getElementById('btnToast');
  const toastEl  = document.getElementById('toastAviso');
  const toast    = (typeof bootstrap !== 'undefined' && toastEl) ? bootstrap.Toast.getOrCreateInstance(toastEl) : null;
  toastBtn?.addEventListener('click', () => toast?.show());

  form?.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita recargar la página

    // 1) Leemos campos base
    const nombre = document.getElementById('nombreCliente')?.value.trim();
    const selModelo = document.getElementById('selModelo');
    const selTalla  = document.getElementById('selTalla'); // (no se usa en HTML actual; se mantiene por estructura)
    const selColor  = document.getElementById('selColor'); // tono/color
    const cantidad  = Number(document.getElementById('inpCantidad')?.value || 0);

    // Validación mínima:
    if (!nombre || !selModelo?.value || !selColor?.value || cantidad < 1) {
      alert('Completa nombre, producto, tono/color y cantidad (mínimo 1).');
      return;
    }

    // 2) Precios base
    const optModelo = selModelo.options[selModelo.selectedIndex];
    const precioModelo = getPrecioFromDataset(optModelo) || 299; // fallback si no pones data-precio
    let total = precioModelo * cantidad;

    // 3) Extras / personalización (grabado, set con fijador)
    const chkNombreNumero = document.getElementById('chkNombreNumero');
    const chkParcheLiga   = document.getElementById('chkParcheLiga');

    const extrasSeleccionados = [];
    if (chkNombreNumero?.checked) {
      total += (getPrecioFromDataset(chkNombreNumero) || 49) * cantidad;
      extrasSeleccionados.push('Grabado en estuche');
    }
    if (chkParcheLiga?.checked) {
      total += (getPrecioFromDataset(chkParcheLiga) || 79) * cantidad;
      extrasSeleccionados.push('Set con mini fijador');
    }

    // Campos condicionales (mantengo nombres por compatibilidad)
    const inpNombre = document.getElementById('inpNombre')?.value.trim(); // Personalización texto (opcional)
    const inpNumero = document.getElementById('inpNumero')?.value.trim(); // Nota/ID (opcional)

    // 4) Envío e instrucciones
    const selEnvio = document.getElementById('selEnvio');
    const optEnvio = selEnvio ? selEnvio.options[selEnvio.selectedIndex] : null;
    const costoEnvio = getPrecioFromDataset(optEnvio) || 99;
    total += costoEnvio;

    const txtInstr = document.getElementById('txtInstrucciones')?.value.trim() || document.getElementById('txtNotas')?.value.trim();

    // 5) Pintamos resumen
    if (outNombre) outNombre.textContent = nombre;

    if (outLista) {
      outLista.innerHTML = `
        <li><strong>Producto:</strong> ${selModelo.value} — ${toMXN(precioModelo)} c/u × ${cantidad}</li>
        ${selTalla?.value ? `<li><strong>Variante:</strong> ${selTalla.value}</li>` : ''}
        <li><strong>Tono/Color:</strong> ${selColor.value}</li>
        <li><strong>Extras:</strong> ${extrasSeleccionados.length ? extrasSeleccionados.join(', ') : 'Ninguno'}</li>
        ${inpNombre || inpNumero ? `<li><strong>Personalización:</strong> ${inpNombre ? 'Texto: ' + inpNombre : ''} ${inpNumero ? ' | Nota: ' + inpNumero : ''}</li>` : ''}
        ${selEnvio ? `<li><strong>Envío:</strong> ${selEnvio.value} — ${toMXN(costoEnvio)}</li>` : ''}
        ${txtInstr ? `<li><strong>Instrucciones:</strong> ${txtInstr}</li>` : ''}
      `;
    }

    if (outTotal) outTotal.textContent = toMXN(total);

    // Habilitamos confirmar y pasamos nombre al modal
    if (btnConfirmar) btnConfirmar.disabled = false;
    if (confirmNombre) confirmNombre.textContent = nombre;
  });

  // Reset: limpiar también el resumen
  form?.addEventListener('reset', () => {
    setTimeout(() => {
      if (outNombre) outNombre.textContent = '—';
      if (outLista) outLista.innerHTML = '<li class="text-muted">Aún no has generado tu pedido.</li>';
      if (outTotal) outTotal.textContent = '$0';
      if (btnConfirmar) btnConfirmar.disabled = true;
    }, 0);
  });
});
// ===================== /app.js ======================

// ================== Actividades DOM (Banner, Testimonios, Contacto) ==================
document.addEventListener('DOMContentLoaded', () => {
  // -------- Actividad 1: Banner con getElementById --------
  const banner = document.getElementById('banner');
  const btnPromo = document.getElementById('btnPromo');

  btnPromo?.addEventListener('click', () => {
    banner.classList.remove('bg-dark', 'bg-primary', 'bg-success', 'bg-info', 'bg-danger', 'bg-warning');
    banner.classList.add('bg-warning'); // resalta promoción
    banner.classList.remove('text-white');
    banner.classList.add('text-dark');
  });

  // -------- Actividad 2: Testimonios --------
  // Destacar VIP
  const vipItems = document.getElementsByClassName('testimonio-vip');
  for (const item of vipItems) {
    item.classList.add('text-primary');
  }

  // Mostrar demo de DOM (todos los <p> en rojo)
  const allParagraphs = document.getElementsByTagName('p');
  // const allParagraphs = document.querySelectorAll('#testimonios p'); // opción localizada
  for (const p of allParagraphs) p.classList.add('text-danger');

  // -------- Actividad 3: Formulario de contacto --------
  const firstTextInput = document.querySelector('#formContacto input[type="text"]');
  firstTextInput?.classList.add('bg-success', 'bg-opacity-10'); // resalta el primer input

  // Botones del form en "danger"
  const contactoButtons = document.querySelectorAll('#formContacto button');
  contactoButtons.forEach(btn => {
    btn.classList.remove('btn-primary', 'btn-outline-secondary');
    btn.classList.add('btn-danger');
  });

  // Campo "nombre" resaltado + etiqueta
  const nombreInputs = document.getElementsByName('nombre');
  if (nombreInputs.length > 0) {
    const nombreInput = nombreInputs[0];
    nombreInput.classList.add('text-warning');
    const label = document.querySelector('label[for="cNombre"]');
    label?.classList.add('text-warning');
  }
});

// ======= WhatsApp flotante: mostrar tras scroll + mensaje por horario =======
document.addEventListener('DOMContentLoaded', () => {
  const waBtn = document.querySelector('.whatsapp-float');
  if (!waBtn) return; // Si no hay botón en la página, salimos

  // 1) Mensaje dinámico según hora local (9 a 18 h "en línea")
  const h = new Date().getHours();
  const enHorario = h >= 9 && h < 18;
  const msg = enHorario ? '¡Respondo ahora!' : 'Fuera de horario, te contesto pronto';
  waBtn.title = `WhatsApp — ${msg}`;
  waBtn.setAttribute('aria-label', `Chatea por WhatsApp — ${msg}`);

  // Prefill del texto en el chat (adaptado a maquillaje)
  const telefono = '527221234567'; // 52 + 10 dígitos (México)
  const texto = encodeURIComponent('Hola, vengo del sitio de GlamStudio. Me interesa maquillaje (producto, tono y cantidad).');
  waBtn.href = `https://wa.me/${telefono}?text=${texto}`;

  // 2) Mostrar/ocultar por scroll (aparece al bajar 300px)
  const UMBRAL = 300;
  const toggleWA = () => {
    if (window.scrollY > UMBRAL) {
      waBtn.classList.add('show');
    } else {
      waBtn.classList.remove('show');
    }
  };

  // Estado inicial y listener
  toggleWA();
  window.addEventListener('scroll', toggleWA, { passive: true });
});
// ========== CARRITO DE COMPRAS ==========
const carrito = [];
const contadorCarrito = document.getElementById("contadorCarrito");
const carritoItems = document.getElementById("carritoItems");
const carritoTotal = document.getElementById("carritoTotal");

function actualizarCarrito() {
  carritoItems.innerHTML = "";
  let total = 0;

  if (carrito.length === 0) {
    carritoItems.innerHTML = `<tr><td colspan="5" class="text-center text-muted">Tu carrito está vacío 🛍️</td></tr>`;
  } else {
    carrito.forEach((item, index) => {
      const subtotal = item.precio * item.cantidad;
      total += subtotal;
      carritoItems.innerHTML += `
        <tr>
          <td>${item.nombre}</td>
          <td>${toMXN(item.precio)}</td>
          <td>${item.cantidad}</td>
          <td>${toMXN(subtotal)}</td>
          <td>
            <button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito(${index})">
              <i class="fas fa-trash-alt"></i>
            </button>
          </td>
        </tr>
      `;
    });
  }

  carritoTotal.textContent = toMXN(total);
  contadorCarrito.textContent = carrito.length;
}

// Eliminar producto
function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
}

// Agregar producto al carrito
function agregarAlCarrito(nombre, precio) {
  const productoExistente = carrito.find(p => p.nombre === nombre);
  if (productoExistente) {
    productoExistente.cantidad++;
  } else {
    carrito.push({ nombre, precio, cantidad: 1 });
  }
  actualizarCarrito();
  // Pequeño feedback visual
  contadorCarrito.classList.add("animate__animated", "animate__bounceIn");
  setTimeout(() => contadorCarrito.classList.remove("animate__animated", "animate__bounceIn"), 800);
}

// ====== Asocia botones "Agregar al carrito" ======
document.addEventListener("DOMContentLoaded", () => {
  // Crea botón en cada producto
  const cards = document.querySelectorAll("#catalogo .card");
  cards.forEach(card => {
    const nombre = card.querySelector(".card-tittle, .card-title")?.textContent.trim();
    const precioTexto = card.querySelector(".text-success")?.textContent.replace("$", "").trim();
    const precio = parseFloat(precioTexto);
    if (nombre && precio) {
      const btn = document.createElement("button");
      btn.className = "btn btn-primary btn-sm mt-2";
      btn.innerHTML = `<i class="fas fa-cart-plus me-1"></i> Agregar`;
      btn.addEventListener("click", () => agregarAlCarrito(nombre, precio));
      card.querySelector(".card-body").appendChild(btn);
    }
  });
});

// Botón pagar (simulación)
document.getElementById("btnPagar")?.addEventListener("click", () => {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío 😅");
    return;
  }
  alert("¡Gracias por tu compra! 💄✨");
  carrito.length = 0;
  actualizarCarrito();
});

const pantalla = document.getElementById("pantalla");
const historial = document.getElementById("historial");
const expresion = document.getElementById("expresion");
const listaHistorial = document.getElementById("listaHistorial");
const btnTema = document.getElementById("btnTema");
const btnHistorial = document.getElementById("btnHistorial");
const btnLimpiarHistorial = document.getElementById("btnLimpiarHistorial");
const selDecimales = document.getElementById("selDecimales");
const panelHistorial = document.getElementById("panelHistorial");

const estado = {
  actual: "0",
  previo: null,
  operacion: null,
  despuesDeIgual: false,
  memoria: 0,
  historialCompleto: []
};

function decimales() {
  return parseInt(selDecimales.value, 10);
}

function formatear(n) {
  if (!Number.isFinite(n)) return "Error";
  return n.toFixed(decimales()).replace(/\.?0+$/, "");
}

function parseActual() {
  return parseFloat(estado.actual) || 0;
}

function emparejar(n) {
  return parseFloat(n.toFixed(decimales()));
}

function agregarHistorial(cuenta, resultado) {
  estado.historialCompleto.unshift({ cuenta, resultado });
  estado.historialCompleto = estado.historialCompleto.slice(0, 50);
  dibujarHistorial();
}

function dibujarHistorial() {
  listaHistorial.innerHTML = "";
  estado.historialCompleto.forEach((e) => {
    const div = document.createElement("div");
    div.className = "entrada";
    div.innerHTML = `<span>${e.cuenta}</span><b>${e.resultado}</b>`;
    listaHistorial.appendChild(div);
  });
}

function actualizarPantalla() {
  pantalla.value = estado.actual;
}

function digitar(digito) {
  if (estado.despuesDeIgual) {
    estado.actual = "0";
    estado.previo = null;
    estado.operacion = null;
    estado.despuesDeIgual = false;
  }
  if (digito === "." && estado.actual.includes(".")) return;
  if (estado.actual === "0" && digito !== ".") {
    estado.actual = digito;
  } else {
    estado.actual += digito;
  }
  actualizarPantalla();
}

function simbolo(op) {
  return { "+": "+", "-": "-", "*": "×", "/": "÷", "^": "^" }[op] || op;
}

function calcular(a, b, op) {
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return b === 0 ? NaN : a / b;
    case "^": return Math.pow(a, b);
    default: return b;
  }
}

function recordarResultado(a, b, op, r) {
  agregarHistorial(`${formatear(a)} ${simbolo(op)} ${formatear(b)} =`, formatear(r));
}

function aplicarFuncion(f) {
  const actual = parseActual();
  let resultado;
  let cuenta;
  switch (f) {
    case "x²":
      resultado = actual * actual;
      cuenta = `${formatear(actual)}² =`;
      break;
    case "√":
      if (actual < 0) { pantalla.value = "Error"; return; }
      resultado = Math.sqrt(actual);
      cuenta = `√(${formatear(actual)}) =`;
      break;
    case "1/x":
      if (actual === 0) { pantalla.value = "Error"; return; }
      resultado = 1 / actual;
      cuenta = `1/(${formatear(actual)}) =`;
      break;
    case "%":
      resultado = actual / 100;
      cuenta = `${formatear(actual)}% =`;
      break;
    case "±":
      estado.actual = formatear(-actual);
      actualizarPantalla();
      return;
    default:
      return;
  }
  resultado = emparejar(resultado);
  estado.actual = formatear(resultado);
  estado.previo = resultado;
  estado.operacion = null;
  estado.despuesDeIgual = false;
  agregarHistorial(cuenta, formatear(resultado));
  historial.textContent = "";
  actualizarPantalla();
}

function elegirOperacion(op) {
  const actual = parseActual();
  const previoOriginal = estado.previo;
  if (estado.previo !== null && estado.operacion && !estado.despuesDeIgual) {
    const r = calcular(estado.previo, actual, estado.operacion);
    if (!Number.isNaN(r)) {
      recordarResultado(previoOriginal, actual, estado.operacion, r);
      estado.previo = emparejar(r);
      estado.actual = formatear(estado.previo);
    }
  } else {
    estado.previo = actual;
  }
  estado.operacion = op;
  estado.despuesDeIgual = false;
  historial.textContent = `${formatear(estado.previo)} ${simbolo(op)}`;
  expresion.textContent = "";
  actualizarPantalla();
}

function calcularResultado() {
  const actual = parseActual();
  if (estado.previo === null || estado.operacion === null) return;
  const r = calcular(estado.previo, actual, estado.operacion);
  historial.textContent = `${formatear(estado.previo)} ${simbolo(estado.operacion)} ${formatear(actual)} =`;
  if (Number.isNaN(r)) {
    pantalla.value = "Error";
  } else {
    recordarResultado(estado.previo, actual, estado.operacion, r);
    estado.actual = formatear(emparejar(r));
  }
  estado.previo = null;
  estado.operacion = null;
  estado.despuesDeIgual = true;
  expresion.textContent = "Resultado";
  actualizarPantalla();
}

function limpiarTodo() {
  estado.actual = "0";
  estado.previo = null;
  estado.operacion = null;
  estado.despuesDeIgual = false;
  historial.textContent = "";
  expresion.textContent = "Resultado";
  actualizarPantalla();
}

function borrarUno() {
  if (estado.despuesDeIgual) return;
  if (estado.actual.length > 1) {
    estado.actual = estado.actual.slice(0, -1);
  } else {
    estado.actual = "0";
  }
  actualizarPantalla();
}

function accionMemoria(accion) {
  const actual = parseActual();
  if (accion === "MR") {
    estado.actual = formatear(estado.memoria);
    actualizarPantalla();
  } else if (accion === "MC") {
    estado.memoria = 0;
  } else if (accion === "MS") {
    estado.memoria = actual;
  } else if (accion === "M+") {
    estado.memoria = emparejar(estado.memoria + actual);
  } else if (accion === "M-") {
    estado.memoria = emparejar(estado.memoria - actual);
  }
}

function alternarTema() {
  const claro = document.body.classList.toggle("claro");
  btnTema.textContent = claro ? "☀️" : "🌙";
}

function alternarHistorial() {
  panelHistorial.style.display = panelHistorial.style.display === "none" ? "flex" : "none";
}

function limpiarHistorial() {
  estado.historialCompleto = [];
  dibujarHistorial();
}

document.addEventListener("click", (evento) => {
  const tecla = evento.target.closest("button");
  if (!tecla) return;
  const valor = tecla.dataset.valor;
  if (tecla.classList.contains("boton-memoria")) {
    accionMemoria(valor);
    return;
  }
  switch (valor) {
    case "AC": limpiarTodo(); break;
    case "DEL": borrarUno(); break;
    case "=": calcularResultado(); break;
    case "x²":
    case "√":
    case "1/x":
    case "±":
    case "%": aplicarFuncion(valor); break;
    default:
      if ("+-*/^".includes(valor)) elegirOperacion(valor);
      else digitar(valor);
  }
});

btnTema.addEventListener("click", alternarTema);
btnHistorial.addEventListener("click", alternarHistorial);
btnLimpiarHistorial.addEventListener("click", limpiarHistorial);

document.addEventListener("keydown", (evento) => {
  if (/^[0-9.]$/.test(evento.key)) {
    digitar(evento.key);
  } else if ("+-*/^".includes(evento.key)) {
    elegirOperacion(evento.key);
  } else if (evento.key === "Enter" || evento.key === "=") {
    calcularResultado();
  } else if (evento.key === "Escape") {
    limpiarTodo();
  } else if (evento.key === "Backspace") {
    borrarUno();
  }
});

actualizarPantalla();
panelHistorial.style.display = "none";
btnHistorial.textContent = "🕘";
// Muestra en qué punto del calendario estamos (las fechas incluyen UTC−6).
(function () {
  var fecha = function (texto) { return new Date(texto).getTime(); };
  var abre = fecha("2026-11-30T12:00:00-06:00");
  var cierra = fecha("2026-12-03T12:00:00-06:00");
  var inicio = fecha("2026-12-04T13:00:00-06:00");
  var fin = fecha("2026-12-04T17:00:00-06:00");

  // Días de calendario en CDMX que faltan para una fecha.
  function faltan(meta, ahora) {
    var dia = function (t) { return Math.floor((t - 6 * 3600000) / 86400000); };
    var n = dia(meta) - dia(ahora);
    return n === 0 ? "hoy" : n === 1 ? "mañana" : "en " + n + " días";
  }

  function actualizar() {
    var ahora = Date.now();
    var texto;
    if (ahora < abre) texto = "La competencia de práctica abre " + faltan(abre, ahora) + ".";
    else if (ahora < cierra) texto = "La competencia de práctica está abierta.";
    else if (ahora < inicio) texto = ""; // basta con el contador
    else if (ahora < fin) texto = "El concurso está en curso.";
    else texto = "El concurso ya terminó. Gracias por participar.";

    var estado = document.getElementById("estado");
    estado.textContent = texto;
    estado.hidden = !texto;

    document.querySelectorAll(".linea li").forEach(function (li) {
      var final = fecha(li.dataset.fin || li.dataset.inicio);
      var marca = li.querySelector(".marca");
      li.classList.toggle("pasado", ahora >= final);
      if (ahora >= final && !marca) {
        marca = document.createElement("span");
        marca.className = "marca";
        marca.textContent = "Ya pasó";
        li.appendChild(marca);
      }
    });
  }

  // Cuenta regresiva al inicio: 4 de diciembre de 2026, 13:00 h de la CDMX.
  function contar() {
    var resta = Math.max(0, Math.ceil((inicio - Date.now()) / 1000));
    var valores = {
      dias: Math.floor(resta / 86400),
      horas: Math.floor(resta / 3600) % 24,
      minutos: Math.floor(resta / 60) % 60,
      segundos: resta % 60
    };
    var contador = document.getElementById("contador");
    contador.hidden = resta === 0;
    contador.querySelectorAll(".cifra").forEach(function (cifra) {
      var unidad = cifra.dataset.unidad;
      var n = String(valores[unidad]);
      cifra.textContent = unidad === "dias" ? n : n.padStart(2, "0");
    });
  }

  function tic() {
    actualizar();
    contar();
  }

  tic();
  setInterval(tic, 1000);
})();

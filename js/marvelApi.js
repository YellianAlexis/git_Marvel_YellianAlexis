const myApiKey = "391114b5f8c3f033e4488133415b4e20";
const inputSearch = $("#busqueda").hide();
const out = $("#results");
const spinner = $("#gif");
spinner.hide();

// Selección escogida en el radiobutton
const checkbox = $("input[name=check]");
var opcion = "";
checkbox.click(function () {
  opcion = $(this).val();
  out.empty();
  peticion(opcion);
});

// Función de petición a la api
function peticion(eleccion) {
  $.ajax({
    url:
      `https://gateway.marvel.com:443/v1/public/${eleccion}?limit=100&apikey=${myApiKey}`,
    type: "GET",
    beforeStart: () => {
      spinner.show();
    },
    complete: () => {
      spinner.hide();
    },
    success: response => {
      inputSearch.show();
      console.log(response);
      inicio(response);
    },
    error: response => {
      spinner.show();
      alert('Lo siento ha ocurrido un error');
    }
  });

}

// Función de muestra de los contenidos inicialmente
function inicio(respuesta) {
  var json = respuesta.data.results;
  console.log(json);
  var resultados = $('#results');
  for (let i = 0; i < json.length; i++) {
    if (opcion === "comics") {
      if (json[i].description != '' && json[i].description != null) {
        var desc = json[i].description.slice(0, 20);
        see(desc);
        var enlace = '<a class="less" href="#"> ver menos</a><a class="more" href="#"> ver más</a>';
      } else {
        desc = "No hay descripción";
        enlace = '';
      }
      resultados.append(`<div class="elementos"><img rel="modal:open" src="${json[i].thumbnail.path}.${json[i].thumbnail.extension}"><p>${json[i].title}</p><p class="descp">${desc}${enlace}</p></div>`);
      $('.less').css('display','none');
    } else {
      resultados.append(`<div class="elementos"><img rel="modal:open" src="${json[i].thumbnail.path}.${json[i].thumbnail.extension}"><p>${json[i].name}</p></div>`);
    }
  }

  // Paginado
  jQuery(function ($) {
    var items = $("#results").children();

    var numItems = items.length;
    var perPage = 10;

    items.slice(perPage).hide();

    $("#pagination").pagination({
      items: numItems,
      itemsOnPage: perPage,
      cssStyle: "light-theme",

      onPageClick: function (pageNumber) {
        var showFrom = perPage * (pageNumber - 1);
        var showTo = showFrom + perPage;

        items.hide()
          .slice(showFrom, showTo).show();
      }
    });
  });
}

// Función de ver más o menos descripción
function see(dscrp) {
  if (dscrp.length != 20) {
    // Botón de ver más
    $('.more').on('click', function (e) {
      $('.less').css('display','block');
      $('.more').css('display','none');  
      e.preventDefault();
      $(this).parent();    
    });
  } else {
    // Botón de ver menos
    $('.less').on('click', function (e) {
      $('.less').css('display','none');
      $('.more').css('display','block');
      e.preventDefault();
      $(this).parent();      
    });
  }
}

// Añadimos el evento al pulsar el input, para el filtrado
var palabra = "";
$('#searching').on('keyup', function () {
  var letraPusada = "";
  palabra += letraPusada;
  filtrado(palabra);
});

// Función del filtrado según vaya escribiendo en el input 
function filtrado(letra) {
  var req = new XMLHttpRequest();
  var nombre = "";
  (opcion === "comics") ? (nombre = "title") : (nombre = "name")

  req.open("GET", `https://gateway.marvel.com:443/v1/public/${opcion}?${nombre}=${letra}&apikey=${myApiKey}`);
  req.addEventListener("load", function () {

    if (req.status >= 200 && req.status < 400) {
      console.log(req.responseText);
    } else {
      spinner.show();
      console.error(req.status + " " + req.statusText);
    }
  });
  // Gestor del evento que indica que la petición no ha podido llegar al servidor
  req.addEventListener("error", function () {
    console.error("Error de red"); // Error de conexión
  });
  req.send();
}

// Función que muestra la información extra al clickar sobre un comic o personaje
$('.elementos').find('img').click(function () {
  $(this).modal({
    fadeDuration: 100,
    closeClass: 'icon-remove',
    closeText: '!'
  });
})
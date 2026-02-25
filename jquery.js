//Autor: Iker Mozo
//Misiones completadas: 1, 2, 3, 4, 5
//
//M1 - Selectores: cambios visuales al cargar la página
//M2 - DOM: añadir y eliminar testimonios (con evento delegado BONUS)
//M3 - Eventos: click en tarjeta (ratón), keyup en textarea (teclado), submit formulario
//M4 - Animaciones: fadeIn en testimonios, slideDown/Up en pasos del proceso, animate en hero
//M5 - jQuery UI: datepicker en contacto.html

$(document).ready(function () {

    //MISIÓN 1 – SELECTORES

    //Por etiqueta: letter-spacing a todos los h2
    $("h2").css("letter-spacing", "1px");

    //Por clase: borde dorado adicional al hover real + badge en tarjetas
    $(".tarjeta").each(function () {
        $(this).append('<span class="badge-verificado"> Verificado</span>');
    });

    //Por ID: primera letra del título hero en dorado (delay para no colisionar con traductor.js)
    setTimeout(function () {
        var textoHero = $("#hero-titulo").text().trim();
        if (textoHero.length) {
            $("#hero-titulo").html(
                '<span style="color:#D4AF37;font-weight:800;text-shadow:0 0 8px rgba(212,175,55,0.6)">' +
                textoHero.charAt(0) + "</span>" + textoHero.slice(1)
            );
        }
    }, 100);

    //Selector avanzado :first — badge en el primer testimonio
    $(".testimonio:first").prepend('<span class="badge-top"> Más valorado</span>');

    //Selector avanzado :first — también hace el navbar sticky mediante jQuery
    $("head").append("<style>.navbar{ position:sticky !important; top:0; z-index:1050; }</style>");

    
    //MISIÓN 2 – ADICIÓN Y SUPRESIÓN
    

    //Añadir botón a cada testimonio existente
    $(".testimonio").append('<button class="btn-eliminar-testimonio" title="Eliminar">✕</button>');

    //Inyectar formulario para añadir nueva reseña bajo los testimonios
    $(".testimonios").append(
        '<div id="form-nueva-resena" class="mt-4 p-3" style="background:#f9f6ed;border-radius:10px;border-left:4px solid #D4AF37">' +
        '<h5 style="color:#011f3e;font-family:Montserrat,sans-serif;margin-bottom:1rem">Añadir reseña</h5>' +
        '<input type="text" id="input-autor" placeholder="Tu nombre y ciudad" class="form-control mb-2">' +
        '<textarea id="input-resena" placeholder="Escribe tu experiencia con Momentum..." class="form-control mb-2" rows="2"></textarea>' +
        '<button id="btn-publicar-resena" class="btn-enviar-resena">Publicar reseña</button>' +
        '</div>'
    );

    //Añadir nueva reseña al DOM con .append()
    $("#btn-publicar-resena").on("click", function () {
        var autor = $("#input-autor").val().trim();
        var texto = $("#input-resena").val().trim();
        if (!autor || !texto) {
            $("#input-autor, #input-resena").css("border-color", "#e74c3c");
            return;
        }
        $("#input-autor, #input-resena").css("border-color", "");
        var nueva = $(
            '<div class="col-lg-4 col-md-6 nueva-resena">' +
            '<div class="testimonio" style="display:none">' +
            '<button class="btn-eliminar-testimonio" title="Eliminar">✕</button>' +
            '<p class="testimonio-texto">"' + texto + '"</p>' +
            '<p class="testimonio-autor mb-0">' + autor + "</p>" +
            '<p class="testimonio-rol">Cliente reciente</p>' +
            "</div></div>"
        );
        $(".testimonios .row").append(nueva);
        nueva.find(".testimonio").fadeIn(400);
        $("#input-autor").val("");
        $("#input-resena").val("");
    });

    //Evento delegado para eliminar testimonios
    $(".testimonios").on("click", ".btn-eliminar-testimonio", function () {
        $(this).closest(".testimonio").fadeOut(300, function () {
            $(this).closest(".col-lg-4, .col-md-6, .nueva-resena").remove();
        });
    });

    //MISIÓN 3 – EVENTOS
    

    //Evento de RATÓN: click en .tarjeta muestra panel de contacto rápido con $(this)
    $(".tarjeta").on("click", function () {
        var servicio = $(this).find("h3").text();
        if ($(this).find(".panel-contacto-rapido").length) {
            $(this).find(".panel-contacto-rapido").slideUp(200, function () {
                $(this).remove();
            });
        } else {
            $(".panel-contacto-rapido").slideUp(200, function () { $(this).remove(); });
            $(this).append(
                '<div class="panel-contacto-rapido" style="display:none;margin-top:1rem;padding:0.75rem;background:#011f3e;border-radius:8px;color:white;text-align:center">' +
                '<small>¿Te interesa <strong>' + servicio + "</strong>?</small><br>" +
                '<a href="/contacto.html" style="color:#D4AF37;font-weight:600;font-size:0.9rem">→ Solicitar consulta gratuita</a>' +
                "</div>"
            );
            $(this).find(".panel-contacto-rapido").slideDown(300);
        }
    });

    //Evento de TECLADO: keyup en textarea de contacto muestra contador
    if ($("#mensaje").length) {
        $("#mensaje").after('<small id="contador-chars" style="color:#5A6C7D;display:block;margin-top:0.25rem">0 / 500 caracteres</small>');
        $("#mensaje").on("keyup", function () {
            var total = $(this).val().length;
            var color = total > 450 ? "#e74c3c" : "#5A6C7D";
            $("#contador-chars").text(total + " / 500 caracteres").css("color", color);
        });
    }

    //Tercer evento – SUBMIT: oculta el formulario y muestra confirmación
    if ($("#formulario-contacto").length) {
        $("#formulario-contacto").on("submit", function (e) {
            e.preventDefault();
            $(this).slideUp(400, function () {
                $("#confirmacion-envio").fadeIn(500);
            });
        });
    }

    //Tercer evento – SCROLL: resaltar nav-link activo según sección visible
    var seccionesNav = ["inicio", "servicios", "proceso"];
    function actualizarNavActivo() {
        var scrollPos = $(window).scrollTop() + 150;
        var activo = "";
        $.each(seccionesNav, function (i, id) {
            var sec = $("#" + id);
            if (sec.length && sec.offset().top <= scrollPos) {
                activo = id;
            }
        });
        $(".navbar-nav .nav-link").removeClass("active");
        if (activo) {
            $('.navbar-nav .nav-link[href="#' + activo + '"]').addClass("active");
        }
    }
    $(window).on("scroll", actualizarNavActivo);
    setTimeout(actualizarNavActivo, 300);

    
    //MISIÓN 4 – ANIMACIONES
    

    //.fadeIn() escalonado en los testimonios al cargar
    $(".testimonio").hide().each(function (i) {
        $(this).delay(i * 200).fadeIn(500);
    });

    //.slideDown() / .slideUp() — pasos del proceso colapsables al hacer clic
    $("#proceso ol li").css("cursor", "pointer").on("click", function () {
        var detalle = $(this).find(".detalle-paso");
        if (detalle.length) {
            detalle.slideUp(250, function () { $(this).remove(); });
        } else {
            var clon = $(this).find(".ms-2").clone();
            clon.find(".fw-bold").remove();
            var texto = clon.text().trim();
            var $p = $('<p class="detalle-paso" style="display:none;flex-basis:100%;margin:0.5rem 0 0 2rem;color:#5A6C7D;font-size:0.9rem">💡 ' + texto + "</p>");
            $(this).append($p);
            $p.slideDown(300);
        }
    });

    //.animate() con dos propiedades CSS: el subtítulo del hero entra desde abajo con opacidad
    $(".hero-subtitle").css({ opacity: 0, marginTop: "30px" }).animate(
        { opacity: 1, marginTop: "0px" },
        { duration: 900, delay: 400 }
    );

    //MISIÓN 5 – JQUERY UI
    
    //datepicker en contacto.html (el campo #fecha-consulta se inyecta en ese HTML)
    if ($("#fecha-consulta").length) {
        $("#fecha-consulta").datepicker({
            dateFormat: "dd/mm/yy",
            minDate: 0,
            maxDate: "+3M",
            dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
            monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
            firstDay: 1,
            showAnim: "slideDown"
        });
    }

});
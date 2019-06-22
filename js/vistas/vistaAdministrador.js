var VistaAdministrador = function(modelo, controlador, elementos) {
  this.modelo = modelo;
  this.controlador = controlador;
  this.elementos = elementos;
  var contexto = this;

  // suscripción de observadores
  this.modelo.preguntaAgregada.suscribir(function() {
    contexto.reconstruirLista();
  });
  this.modelo.preguntaEliminada.suscribir(function() {
    contexto.reconstruirLista();
  });  
  this.modelo.preguntaEditada.suscribir(function(){
    contexto.reconstruirLista();
  });
  this.modelo.respuestaVotada.suscribir(function(){
    contexto.reconstruirLista();
  });
};

VistaAdministrador.prototype = {
  //lista
  inicializar: function() {
    //llamar a los metodos para reconstruir la lista, configurar botones y validar formularios
    validacionDeFormulario();
    this.reconstruirLista();
    this.configuracionDeBotones();
  },

  construirElementoPregunta: function(pregunta) {
    var contexto = this;
    var nuevoItem = $('<li></li>').addClass("list-group-item").attr("id", pregunta.id);
    var interiorItem = $('.d-flex');
    var titulo = interiorItem.find('h5');
    titulo.text(pregunta.textoPregunta);
    interiorItem.find('small').text(pregunta.cantidadPorRespuesta.map(function(resp) {
      return " " + resp.textoRespuesta;
    }));
    nuevoItem.html($('.d-flex').html());
    return nuevoItem;
  },

  reconstruirLista: function() {
    var lista = this.elementos.lista;
    lista.html('');
    var preguntas = this.modelo.preguntas;
    for (var i = 0; i < preguntas.length; ++i){
      lista.append(this.construirElementoPregunta(preguntas[i]));
    }
  },

  configuracionDeBotones: function(){
    var e = this.elementos;
    var contexto = this;

    //asociacion de eventos a boton
    e.botonAgregarPregunta.click(function() {
      var value = e.pregunta.val();
      var respuestas = [];
      $('[name="option[]"]').each(function(i, input) {
        if(input.value !== '') {
          respuestas.push({'textoRespuesta': input.value, 'cantidad': 0});
        }
      })
      contexto.limpiarFormulario();
      contexto.controlador.agregarPregunta(value, respuestas);
    });
    
    e.botonBorrarPregunta.click(function() {
      var id = parseInt($('.list-group-item.active').attr('id'));
      contexto.controlador.borrarPregunta(id);
    });

    e.borrarTodo.click(function(){
      contexto.controlador.borrarTodo();
    });
    
    var editar = '';
    
    e.botonEditarPregunta.click(function(){
      editar = parseInt($('.list-group-item.active').attr('id'));
      const pregunta = contexto.modelo.preguntas.find(function(pregunta){
        return pregunta.id === editar;    
      });

      var textoPregunta = pregunta.textoPregunta;
      var respuestas = pregunta.cantidadPorRespuesta;
      
      e.pregunta.val(textoPregunta);
      
      $('#respuesta').hide();
      
      respuestas.forEach(function(respuesta,index){
        var $template = $('#optionTemplate'),
        $clone = $template
        .clone()
        .removeClass('hide')
        .attr('id', "respuesta" + parseInt(index+1))
        .insertBefore($template),
        $option = $clone.find('[name="option[]"]');
        $('#localStorageForm').formValidation('addField', $option);
        $option.val(respuesta.textoRespuesta)
        $clone.addClass('inputsEditables')
      });

      contexto.toggleButtons();
    });
    
    e.botonModificarPregunta.click(function(){    
      contexto.toggleButtons();
      respuestasNuevas = [];
      
      $('[name="option[]"]').each(function() {
        var textoRespuesta = $(this).val();
        if(textoRespuesta !== ''){
          var respuesta = {'textoRespuesta': textoRespuesta, 'cantidad': 0};
          respuestasNuevas.push(respuesta);
        }
      });
      
      contexto.controlador.editarPregunta(editar,e.pregunta.val(),respuestasNuevas);
      $('#respuesta').show();
      $('.inputsEditables').remove();
    });
  },
  
  limpiarFormulario: function(){
    $('.form-group.answer.has-feedback.has-success').remove();
  },
  
  toggleButtons: function(){    
    this.elementos.botonAgregarPregunta.toggleClass('hide');
    this.elementos.botonModificarPregunta.toggleClass('hide');
  },

  limpiarFormulario: function() {
    $('.form-group.answer.has-feedback.has-success').remove();
  }
}

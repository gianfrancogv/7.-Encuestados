var Modelo = function() {
  
  var preguntas = JSON.parse(localStorage.getItem("preguntas"));
  if(preguntas){
    this.preguntas = preguntas;
  } else {
    this.preguntas = [];
  }

  this.ultimoId = 0;

  //inicializacion de eventos
  this.preguntaAgregada = new Evento(this);
  this.preguntaEliminada = new Evento(this);
  this.preguntaEditada = new Evento(this);
  this.respuestaVotada = new Evento(this);
}

Modelo.prototype = {
  //se obtiene el id más grande asignado a una pregunta
  obtenerUltimoId: function() {
    var listadoId = [];
    this.preguntas.forEach(function(pregunta){
      listadoId.push(pregunta.id);
    });

    if (listadoId.length) {
      return Math.max(...listadoId);
    } else { 
      return 0;
    }
  },

  //se agrega una pregunta dado un nombre y sus respuestas
  agregarPregunta: function(nombre, respuestas) {
    var id = this.obtenerUltimoId();
    id++;
    var nuevaPregunta = {'textoPregunta': nombre, 'id': id, 'cantidadPorRespuesta': respuestas};
    this.preguntas.push(nuevaPregunta);
    this.guardar();
    this.preguntaAgregada.notificar(); 
  },

  borrarPregunta: function(id){
    this.preguntas = this.preguntas.filter(function(pregunta){
      return pregunta.id !== id;
    });
    this.guardar();
    this.preguntaEliminada.notificar();
  },

  borrarTodo: function(){
    this.preguntas = [];
    this.guardar();
    this.preguntaEliminada.notificar();
  },

  agregarVoto: function(nombrePregunta, respuestaSeleccionada){
    var pregunta = this.preguntas.find(function(pregunta){
      return pregunta.textoPregunta === nombrePregunta;   
    }); 
    var respuesta = pregunta.cantidadPorRespuesta.find(function(respuesta){
      return respuesta.textoRespuesta === respuestaSeleccionada;
    });
    
    respuesta.cantidad += 1;

    this.guardar();
    this.respuestaVotada.notificar();
  },

  editarPregunta: function(id, textoPregunta, respuestas){
    var pregunta = this.preguntas.find(function(pregunta){
      return pregunta.id === id;    
    });
    
    pregunta.textoPregunta = textoPregunta;
    pregunta.cantidadPorRespuesta = respuestas;
    
    this.guardar();
    this.preguntaEditada.notificar();
  },

  //se guardan las preguntas
  guardar: function(){
    window.localStorage.setItem('preguntas', JSON.stringify(this.preguntas));
  }
}
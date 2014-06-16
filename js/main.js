var URL_BASE = "http://localhost:9080/test/profesor/";
var URL_ALL = URL_BASE + "all";
var URL_ID = URL_BASE;
var URL_POST = URL_BASE;
var URL_DELETE = URL_BASE;
var URL_UPDATE = URL_BASE;

$(function() {

	$("#all").on("click",getAll);
	$(".nuevo, .modal-background, .modal-close").on("click",closeOpenModal);	
	$("#enviar").on( "click", enviarProfesor );
	$(document).on( "click", ".delete",obtenerProfesor );
	$(document).on( "click", "figure", obtenerProfesorActulizar );

});

function getAll(){
	$.ajax({
		url: URL_ALL,
		type: 'GET',
		success: procesaRespuesta,
		error: muestraError
	});
}

function closeOpenModal(){
	$(".modal-content, .modal-background").toggleClass("active");
	$("#nombre").val("");
	$("#idProfesor").val("");
}

function procesaRespuesta(data) {
	var outString = "";
	var pattern_list = "<li><figure><button class='delete'>x</button><input type='hidden' value='#ID#' /><img src='http://hhhhold.com/200'><figcaption>#TEXT#</figcaption></figure></li>";
    if (data.error) 
	{
		alert("Se ha producido el error  "
				+ data.error
				+ " en el servicio de búsqueda, si el error persiste contacte con el administrador.");
	} 
	else 
	{
		for ( var i=0;i<data.length;i++) {
			outString += pattern_list.replace(/#TEXT#/gi, data[i].nombre).replace(/#ID#/gi, data[i].id);
		}
		$('.student-list').html(outString);
	}
}

function muestraError(jqXHR, textStatus, error) {
	alert( "error: " + jqXHR.responseText);
}

function enviarProfesor(){
	var nombre = $("#nombre").val();
	var idProfesor = $("#idProfesor").val();
	if(nombre)
	{
		var data = {};
		data['nombre'] = nombre;
		if(idProfesor == "")
		{
			crearProfesor(data);
		}
		else
		{
			data['id'] = idProfesor;
			actulizarProfesor(data);
		}
	}
	else
	{
		alert("Nombre es obligatorio");
	}
}

function crearProfesor(data){
	$.ajax({
		url: URL_POST,
		type: 'POST',
		data : JSON.stringify(data),
		contentType : 'application/json',
		success: function(data){
			actualizarPantalla();
		},
		error: muestraError
	});
}

function actulizarProfesor(data){
	$.ajax({
		url: URL_UPDATE,
		type: 'PUT',
		data : JSON.stringify(data),
		contentType : 'application/json',
		success: function(data){
			actualizarPantalla();
		},
		error: muestraError
	});
}

function actualizarPantalla(){
	closeOpenModal();
	getAll();
}

function obtenerProfesorActulizar(event){
	var id = $(this).children('input:hidden').val();
	var data = {};
	data['id'] = id;
	$.ajax({
		url: URL_ID + id,
		type: 'GET',
		contentType : 'application/json',
		success: function(data){
			if(data.length > 0)
			{
				closeOpenModal();
				$("#nombre").val(data[0].nombre);
				$("#idProfesor").val(id);
			}
			
		},
		error: muestraError
	});
}

function obtenerProfesor(event){
	var id = $(this).siblings('input:hidden').val();
	borrarProfesor(id);
}

function borrarProfesor(id){
	if(id)
	{
		var data = {};
		data['id'] = id;
		$.ajax({
			url: URL_DELETE,
			type: 'DELETE',
			data : JSON.stringify(data),
			contentType : 'application/json',
			success: function(data){
				alert("Se ha borrado correctamente");
				getAll();
			},
			error: muestraError
		});
	}
	else
	{
		alert("Id es obligatorio");
	}
}

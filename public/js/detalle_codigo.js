var key = $('#hiddenkey').val()
var masterkey = $('#hiddenmasterkey').val()

$(document).ready(function(){
  inicializar()
  //leerDatos()
  $( '#materiales' ).load( 'materiales.html' );
  $( '#mano_obra' ).load( 'mano_obra.html' );
  $( '#herramientas' ).load( 'herramientas.html' );
  $( '#maquina' ).load( 'maquina.html' );
})

function goback(){
  $('#hiddenkey').val(masterkey);
  $( '#work-place' ).load( 'detalle_presupuesto.html' );
}

function inicializar(){
  detalle_codigo = firebase.database().ref().child('detalle_presupuestos').child(masterkey).child(key)
  presupuesto = firebase.database().ref().child('presupuestos').child(masterkey)
  presupuesto.once('value').then(function(snapshot) {
    $('#cantidad_codigo_master').val(snapshot.val().cantidad)
  $('#procedimiento').text((snapshot.val() && snapshot.val().procedimiento) || 'N/A')
    var subtotal = number_format((snapshot.val() && snapshot.val().subtotal) || '$0.00', 2)
    var iva = number_format((snapshot.val() && snapshot.val().iva) || '$0.00', 2)
    var total = number_format((snapshot.val() && snapshot.val().total) || '$0.00', 2)
    var indirectos = number_format((snapshot.val() && snapshot.val().indirectos) || '$0.00', 2)
    var utilidad = number_format((snapshot.val() && snapshot.val().utilidad) || '$0.00', 2)
  $('#subtotal').text('Subtotal: ' + '$'+subtotal)
  $('#iva').text('IVA: ' + '$'+iva)
  $('#total').text('Total: ' + '$'+total)
  $('#indirectos').val(indirectos)
  $('#utilidad').val(utilidad)
})
  detalle_codigo.once('value').then(function(snapshot) {
  $('#codigo').text('Codigo : ' + (snapshot.val() && snapshot.val().codigo) || 'N/A')
  $('#descripcion_codigo').text(((snapshot.val() && snapshot.val().descripcion) || 'N/A').substring(0,100) + '....')
  $('#cantidad_codigo').text('Cantidad : ' +(snapshot.val() && snapshot.val().cantidad) || 'N/A')
  $('#cantidad_codigo_master').val((snapshot.val() && snapshot.val().cantidad) || '0')
})
}


function fullPDF(){
  window.open('pdf_full.html?k=' + masterkey,'_blank');
}
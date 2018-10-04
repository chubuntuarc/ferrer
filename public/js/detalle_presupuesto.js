var key = $('#hiddenkey').val()
var masterkey = $('#hiddenkey').val()
  
$(document).ready(function(){
  //Master keys
  
  $('.loader-back').show()
  inicializar()
  $('#module-form').hide()
  $('#editar_codigo').hide()
})

var presupuestos
var elementoEditar

function inicializar(){
  //Objetos a inicializar
  detalle_presupuesto = firebase.database().ref().child('detalle_presupuestos').child(key)
  presupuesto = firebase.database().ref().child('presupuestos').child(key)
  presupuesto.once('value').then(function(snapshot) {
  $('#procedimiento').text((snapshot.val() && snapshot.val().procedimiento) || 'N/A')
      var subtotal = number_format((snapshot.val() && snapshot.val().subtotal) || '$0.00', 2)
      var iva = number_format((snapshot.val() && snapshot.val().iva) || '$0.00', 2)
      var total = number_format((snapshot.val() && snapshot.val().total) || '$0.00', 2)
    $('#subtotal').text('Subtotal: ' + '$'+subtotal)
    $('#iva').text('IVA: ' + '$'+iva)
    $('#total').text('Total: ' + '$'+total)
  })
  //Leer los codigos del presupuesto
  listaCodigos()
}

//Boton para agregar codigo al detalle de presupuesto
function agregarCodigo(){
  $('#module-form').show()
  $('#nuevo-codigo').hide()
  $('input.validate').val('')
  $('#guardar_codigo').show()
  $('#editar_codigo').hide()
}

//Boton cancelar en formulario de registro
function cancelarCodigo(){
  $('#module-form').hide()
  $('#nuevo-codigo').show()
}

//Registrar un nuevo codigo del presupuesto
function guardarCodigo(){
  var codigo = $('#codigo').val()
  var descripcion = $('#descripcion').val()
  var cantidad = $('#cantidad').val()
  var unidad = $('#unidad').val()
  var pu = $('#pu').val()
  var importe = $('#importe').val()
  detalle_presupuesto.push({
    codigo: codigo,
    descripcion: descripcion,
    cantidad : cantidad,
    unidad : unidad,
    pu : pu,
    importe : importe
  }).then((snap) => {
    $('#module-form').hide()
    $('#nuevo-codigo').show()
    M.toast({html: 'Guardado!', classes: 'rounded'})
  })
}

//Actualizar datos de un codigo del detalle de presupuesto
function actualizarCodigo(){
  var codigo = $('#codigo').val()
  var descripcion = $('#descripcion').val()
  var cantidad = $('#cantidad').val()
  var unidad = $('#unidad').val()
  var pu = $('#pu').val()
  var importe = $('#importe').val()
  if(isNaN(importe)){ importe = 0 }
  elementoEditar.update({
    codigo: codigo,
    descripcion: descripcion,
    cantidad : cantidad,
    unidad : unidad,
    pu : pu,
    importe : importe
  }).then((snap) => {
    $('#module-form').hide()
    $('#nuevo-codigo').show()
    $('input.validate').val('')
    $('#guardar_codigo').show()
    $('#editar_codigo').hide()
    M.toast({html: 'Actualizado!', classes: 'rounded'})
  })
}

//Listado de codigos en el detalle del presupuesto
function listaCodigos(){
  detalle_presupuesto.on('value',function(snap){
    $("#codigos-rows > tr").remove()
    var datos = snap.val()
    for(var key in datos){
      var nuevaFila='<tr>'
          nuevaFila+='<td>'+datos[key].codigo+'</td>'
          nuevaFila+='<td style="width: 100%;font-size: 10px;">'+datos[key].descripcion+'</td>'
          nuevaFila+='<td>'+datos[key].cantidad+'</td>'
          nuevaFila+='<td>'+datos[key].unidad+'</td>'
          nuevaFila+='<td>$'+number_format(datos[key].pu,2)+'</td>'
          nuevaFila+='<td>$'+number_format(datos[key].importe,2)+'</td>'
          nuevaFila+='<td><a href="#!" onclick="editarCodigo(\''+key+'\');"><i class="material-icons">edit</i></a></td>'
          nuevaFila+='<td><a href="#!" onclick="$( \'#work-place\' ).load( \'detalle_codigo.html\');$(\'#hiddenkey\').val(\''+key+'\');$(\'#hiddenmasterkey\').val(\''+masterkey+'\');"><i class="material-icons green-text">attach_money</i></a></td>'
          nuevaFila+='<td><a href="#!" onclick="borrarCodigo(\''+key+'\');"><i class="material-icons red-text">delete</i></a></td>'
          nuevaFila+='</tr>'
          $("#codigos-rows").append(nuevaFila)
    }
    $('.loader-back').hide()
    datatable()
    actualizarSubtotalEnCodigos()
  })
}

//Eliminar un codigo del detalle
function borrarCodigo(key){
  var checkstr =  confirm('Deseas eliminar el codigo?');
    if(checkstr === true){
      var elementoABorrar = detalle_presupuesto.child(key)
      elementoABorrar.remove()
    }else{
    return false;
    }
}

//Mandar a editar un codigo desde el listado
function editarCodigo(key){
  $('#module-form').show()
  $('#nuevo-codigo').hide()
  var elementoAEditar = detalle_presupuesto.child(key)
  elementoAEditar.once('value', function(snap){
    var datos = snap.val()
    elementoEditar = elementoAEditar
    $('#codigo').val(datos.codigo)
    $('#descripcion').val(datos.descripcion)
    $('#cantidad').val(datos.cantidad)
    $('#unidad').val(datos.unidad)
    $('#pu').val(datos.pu)
    $('#importe').val(datos.importe)
  })
  $('#guardar_codigo').hide()
  $('#editar_codigo').show()
  M.updateTextFields()
  $('select').formSelect()
}

//Actualizar el subtotal del proyecto desde la pantalla de detalle de presupuesto
function actualizarSubtotalEnCodigos(){
  var subtotal = 0
  detalle_presupuesto.on('value',function(snap){
    var datos = snap.val()
    for(var key in datos){
      if(datos[key].importe >= 0){
          subtotal += parseFloat(datos[key].importe)
      }
    }
    presupuesto.update({ subtotal: subtotal.toString() })
    $('#subtotal').text('Subtotal: ' + '$'+number_format(subtotal,2))
  })
  calcularIVA(parseFloat(subtotal))
}

function calcularIVA(subtotal){
  var sub = parseFloat(subtotal)
  var calc = 0.16
  var iva = sub * calc
  var total = iva + sub
  presupuesto.update({ iva: iva.toString(), total: total.toString() })
  $('#iva').text('IVA: ' + '$'+number_format(iva,2))
  $('#total').text('Total: ' + '$'+number_format(total,2))
}

//Calcular cuanto es el importe multiplicando cantidad por pu
function calcularImporte(){
  var cantidad = parseFloat($('#cantidad').val())
  var pu = parseFloat($('#pu').val())
  $('#importe').val(cantidad * pu)
}

function simplePDF(){
  window.open('pdf_simple.html?k=' + key,'_blank');
}

//Convertir a moneda
function number_format(amount, decimals) {
    amount += ''; // por si pasan un numero en vez de un string
    amount = parseFloat(amount.replace(/[^0-9\.]/g, '')); // elimino cualquier cosa que no sea numero o punto
    decimals = decimals || 0; // por si la variable no fue fue pasada
    // si no es un numero o es igual a cero retorno el mismo cero
    if (isNaN(amount) || amount === 0) 
        return parseFloat(0).toFixed(decimals);
    // si es mayor o menor que cero retorno el valor formateado como numero
    amount = '' + amount.toFixed(decimals);
    var amount_parts = amount.split('.'),
        regexp = /(\d+)(\d{3})/;
    while (regexp.test(amount_parts[0]))
        amount_parts[0] = amount_parts[0].replace(regexp, '$1' + ',' + '$2');
    return amount_parts.join('.');
}
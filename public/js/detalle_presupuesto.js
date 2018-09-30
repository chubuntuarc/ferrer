var key = $('#hiddenkey').val()
var masterkey = $('#hiddenkey').val()

$(document).ready(function(){
  inicializar()
  leerDatos()
  $('#module-form').hide()
  $('#editardata').hide()
})

var formulario
var presupuestos
var submit = $('#enviardata').text()
var elementoEditar

function inicializar(){
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
}

function enviarDatos(){
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
  })  
  $('#module-form').hide()
  $('#nuevo-codigo').show()
  M.toast({html: 'Guardado!', classes: 'rounded'});
  leerDatos()
}

function editarDatos(){
  var codigo = $('#codigo').val()
  var descripcion = $('#descripcion').val()
  var cantidad = $('#cantidad').val()
  var unidad = $('#unidad').val()
  var pu = $('#pu').val()
  var importe = $('#importe').val()
  if(isNaN(importe)){ importe = 0 }
  console.log(importe)
  elementoEditar.update({
    codigo: codigo,
    descripcion: descripcion,
    cantidad : cantidad,
    unidad : unidad,
    pu : pu,
    importe : importe
    })
  $('#module-form').hide()
  $('#nuevo-codigo').show()
  M.toast({html: 'Actualizado!', classes: 'rounded'});
  leerDatos()
  $('input').val('')
  $('#enviardata').show()
  $('#editardata').hide()
}

function leerDatos(){
  actualizarSubtotal()
  detalle_presupuesto.on('value',function(snap){
    $("#codigos-rows > tr").remove()
    var datos = snap.val()
    for(var key in datos){
      var nuevaFila='<tr>'
          nuevaFila+='<td>'+datos[key].codigo+'</td>'
          nuevaFila+='<td>'+datos[key].descripcion+'</td>'
          nuevaFila+='<td>'+datos[key].cantidad+'</td>'
          nuevaFila+='<td>'+datos[key].unidad+'</td>'
          nuevaFila+='<td>$'+number_format(datos[key].pu,2)+'</td>'
          nuevaFila+='<td>$'+number_format(datos[key].importe,2)+'</td>'
          nuevaFila+='<td><a href="#!" onclick="editar(\''+key+'\');"><i class="material-icons">edit</i></a></td>'
          nuevaFila+='<td><a href="#!" onclick="$( \'#work-place\' ).load( \'detalle_codigo.html\');$(\'#hiddenkey\').val(\''+key+'\');$(\'#hiddenmasterkey\').val(\''+masterkey+'\');"><i class="material-icons green-text">attach_money</i></a></td>'
          nuevaFila+='<td><a href="#!" onclick="borrar(\''+key+'\');"><i class="material-icons red-text">delete</i></a></td>'
          nuevaFila+='</tr>'
          $("#codigos-rows").append(nuevaFila)
    }
  })
}

function borrar(key){
  var checkstr =  confirm('Deseas eliminar el codigo?');
    if(checkstr === true){
      var elementoABorrar = detalle_presupuesto.child(key)
      elementoABorrar.remove()
      leerDatos()
    }else{
    return false;
    }
}

function editar(key){
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
  $('#enviardata').hide()
  $('#editardata').show()
  M.updateTextFields()
  $('select').formSelect()
}

function actualizarSubtotal(){
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
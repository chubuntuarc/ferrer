$(document).ready(function(){
  inicializarMano()
  $('#mano-form').hide()
  $('#editardatamano').hide()
})

var elementoEditar

function inicializarMano(){
  detalle_mano = firebase.database().ref().child('detalle_codigo').child(key).child('MO')
  leerDatosMano()
}

function enviarDatosMano(){
  var descripcion = $('#descripcion_mano').val()
  var cantidad = $('#cantidad_mano').val()
  var unidad = $('#unidad_mano').val()
  var costo = $('#costo_mano').val()
  var importe = $('#importe_mano').val()
  detalle_mano.push({
    descripcion: descripcion,
    cantidad: cantidad,
    unidad : unidad,
    costo : costo,
    importe : importe
  })  
  $('#mano-form').hide()
  $('#nueva-mano').show()
  M.toast({html: 'Guardado!', classes: 'rounded'})
}

function editarDatosMano(){
  var descripcion = $('#descripcion_mano').val()
  var cantidad = $('#cantidad_mano').val()
  var unidad = $('#unidad_mano').val()
  var costo = $('#costo_mano').val()
  var importe = $('#importe_mano').val()
  elementoEditar.update({
    descripcion: descripcion,
    cantidad: cantidad,
    unidad : unidad,
    costo : costo,
    importe : importe
    })
  $('#mano-form').hide()
  $('#nueva-mano').show()
  M.toast({html: 'Actualizado!', classes: 'rounded'})
  $('input.validate').val('')
  $('#enviardatamano').show()
  $('#enviardatamano').hide()
}

function leerDatosMano(){
  detalle_mano.on('value',function(snap){
    $("#mano-rows > tr").remove()
    var datos = snap.val()
    var count = 1
    var sub = 0
    for(var key in datos){
      var nuevaFila='<tr>'
          nuevaFila+='<td>MO-'+count+'</td>'
          nuevaFila+='<td>'+datos[key].descripcion+'</td>'
          nuevaFila+='<td>'+datos[key].cantidad+'</td>'
          nuevaFila+='<td>'+datos[key].unidad+'</td>'
          nuevaFila+='<td>$'+number_format(datos[key].costo,2)+'</td>'
          nuevaFila+='<td>$'+number_format(datos[key].importe,2)+'</td>'
          nuevaFila+='<td><a href="#!" onclick="editarMano(\''+key+'\');"><i class="material-icons">edit</i></a></td>'
          nuevaFila+='<td><a href="#!" onclick="borrarMano(\''+key+'\');"><i class="material-icons red-text">delete</i></a></td>'
          nuevaFila+='</tr>'
          $("#mano-rows").append(nuevaFila)
      count ++
      sub += parseFloat(datos[key].importe)
    }
    $('#subtotal_mano').text('Subtotal : $' + number_format(sub,2))
    actualizarSubtotal()
  })
}

function borrarMano(key){
  var checkstr =  confirm('Deseas eliminar la mano de obra?');
    if(checkstr === true){
      var elementoABorrar = detalle_mano.child(key)
      elementoABorrar.remove()
    }else{
    return false;
    }
}

function editarMano(key){
  $('#mano-form').show()
  $('#nueva-mano').hide()
  var elementoAEditar = detalle_mano.child(key)
  elementoAEditar.once('value', function(snap){
    var datos = snap.val()
    elementoEditar = elementoAEditar
    $('#descripcion_mano').val(datos.descripcion)
    $('#cantidad_mano').val(datos.cantidad)
    $('#unidad_mano').val(datos.unidad)
    $('#costo_mano').val(datos.costo)
    $('#importe_mano').val(datos.importe)
  })
  $('#enviardatamano').hide()
  $('#editardatamano').show()
  M.updateTextFields()
  $('select').formSelect()
}

//Calcular cuanto es el importe multiplicando cantidad por pu
function calcularImporteMano(){
  var cantidad = parseFloat($('#cantidad_mano').val())
  var costo = parseFloat($('#costo_mano').val())
  $('#importe_mano').val(cantidad * costo)
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
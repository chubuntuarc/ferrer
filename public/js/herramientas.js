$(document).ready(function(){
  inicializarHerramienta()
  leerDatosHerramienta()
  $('#herramienta-form').hide()
  $('#editardataherramienta').hide()
})

var elementoEditar

function inicializarHerramienta(){
  detalle_herramienta = firebase.database().ref().child('detalle_codigo').child(key).child('HER')
}

function enviarDatosHerramienta(){
  var descripcion = $('#descripcion_herramienta').val()
  var cantidad = $('#cantidad_herramienta').val()
  var unidad = $('#unidad_herramienta').val()
  var costo = $('#costo_herramienta').val()
  var importe = $('#importe_herramienta').val()
  detalle_herramienta.push({
    descripcion: descripcion,
    cantidad: cantidad,
    unidad : unidad,
    costo : costo,
    importe : importe
  })  
  $('#herramienta-form').hide()
  $('#nueva-herramienta').show()
  M.toast({html: 'Guardado!', classes: 'rounded'});
  actualizarSubtotal()
  leerDatosHerramienta()
}

function editarDatosHerramienta(){
  var descripcion = $('#descripcion_herramienta').val()
  var cantidad = $('#cantidad_herramienta').val()
  var unidad = $('#unidad_herramienta').val()
  var costo = $('#costo_herramienta').val()
  var importe = $('#importe_herramienta').val()
  elementoEditar.update({
    descripcion: descripcion,
    cantidad: cantidad,
    unidad : unidad,
    costo : costo,
    importe : importe
    })
  $('#herramienta-form').hide()
  $('#nueva-herramienta').show()
  M.toast({html: 'Actualizado!', classes: 'rounded'});
  actualizarSubtotal()
  leerDatosHerramienta()
  $('input').val('')
  $('#enviardataherramienta').show()
  $('#enviardataherramienta').hide()
}

function leerDatosHerramienta(){
  detalle_herramienta.on('value',function(snap){
    $("#herramienta-rows > tr").remove()
    var datos = snap.val()
    var count = 1
    var sub = 0
    for(var key in datos){
      var nuevaFila='<tr>'
          nuevaFila+='<td>HER-3%</td>'
          nuevaFila+='<td>'+datos[key].descripcion+'</td>'
          nuevaFila+='<td>'+datos[key].cantidad+'</td>'
          nuevaFila+='<td>'+datos[key].unidad+'</td>'
          nuevaFila+='<td>$'+number_format(datos[key].costo,2)+'</td>'
          nuevaFila+='<td>$'+number_format(datos[key].importe,2)+'</td>'
          nuevaFila+='<td><a href="#!" onclick="editarHerramienta(\''+key+'\');"><i class="material-icons">edit</i></a></td>'
          nuevaFila+='<td><a href="#!" onclick="borrarHerramienta(\''+key+'\');"><i class="material-icons red-text">delete</i></a></td>'
          nuevaFila+='</tr>'
          $("#herramienta-rows").append(nuevaFila)
      count ++
      sub += parseFloat(datos[key].importe)
    }
    $('#subtotal_herramienta').text('Subtotal : $' + number_format(sub,2))
  })
}

function borrarHerramienta(key){
  var checkstr =  confirm('Deseas eliminar la herramienta?');
    if(checkstr === true){
      var elementoABorrar = detalle_herramienta.child(key)
      elementoABorrar.remove()
      leerDatosHerramienta()
    }else{
    return false;
    }
}

function editarHerramienta(key){
  $('#herramienta-form').show()
  $('#nueva-herramienta').hide()
  var elementoAEditar = detalle_herramienta.child(key)
  elementoAEditar.once('value', function(snap){
    var datos = snap.val()
    elementoEditar = elementoAEditar
    $('#descripcion_herramienta').val(datos.descripcion)
    $('#cantidad_herramienta').val(datos.cantidad)
    $('#unidad_herramienta').val(datos.unidad)
    $('#costo_herramienta').val(datos.costo)
    $('#importe_herramienta').val(datos.importe)
  })
  $('#enviardataherramienta').hide()
  $('#editardataherramienta').show()
  M.updateTextFields()
  $('select').formSelect()
}

//Calcular cuanto es el importe multiplicando cantidad por pu
function calcularImporteHerramienta(){
  var cantidad = parseFloat($('#cantidad_herramienta').val())
  var costo = parseFloat($('#costo_herramienta').val())
  $('#importe_herramienta').val(cantidad * costo)
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
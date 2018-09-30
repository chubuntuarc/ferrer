$(document).ready(function(){
  inicializarMaquina()
  leerDatosMaquina()
  $('#maquina-form').hide()
  $('#editardatamaquina').hide()
})

var elementoEditar

function inicializarMaquina(){
  detalle_maquina = firebase.database().ref().child('detalle_codigo').child(key).child('MAQ')
}

function enviarDatosMaquina(){
  var descripcion = $('#descripcion_maquina').val()
  var cantidad = $('#cantidad_maquina').val()
  var unidad = $('#unidad_maquina').val()
  var costo = $('#costo_maquina').val()
  var importe = $('#importe_maquina').val()
  detalle_maquina.push({
    descripcion: descripcion,
    cantidad: cantidad,
    unidad : unidad,
    costo : costo,
    importe : importe
  })  
  $('#maquina-form').hide()
  $('#nueva-maquina').show()
  M.toast({html: 'Guardado!', classes: 'rounded'});
  actualizarSubtotal()
  leerDatosMaquina()
}

function editarDatosMaquina(){
  var descripcion = $('#descripcion_maquina').val()
  var cantidad = $('#cantidad_maquina').val()
  var unidad = $('#unidad_maquina').val()
  var costo = $('#costo_maquina').val()
  var importe = $('#importe_maquina').val()
  elementoEditar.update({
    descripcion: descripcion,
    cantidad: cantidad,
    unidad : unidad,
    costo : costo,
    importe : importe
    })
  $('#maquina-form').hide()
  $('#nueva-maquina').show()
  M.toast({html: 'Actualizado!', classes: 'rounded'});
  actualizarSubtotal()
  leerDatosMaquina()
  $('input').val('')
  $('#enviardatamaquina').show()
  $('#enviardatamaquina').hide()
}

function leerDatosMaquina(){
  detalle_maquina.on('value',function(snap){
    $("#maquina-rows > tr").remove()
    var datos = snap.val()
    var count = 1
    var sub = 0
    for(var key in datos){
      var nuevaFila='<tr>'
          nuevaFila+='<td>MAQ-'+count+'</td>'
          nuevaFila+='<td>'+datos[key].descripcion+'</td>'
          nuevaFila+='<td>'+datos[key].cantidad+'</td>'
          nuevaFila+='<td>'+datos[key].unidad+'</td>'
          nuevaFila+='<td>$'+number_format(datos[key].costo,2)+'</td>'
          nuevaFila+='<td>$'+number_format(datos[key].importe,2)+'</td>'
          nuevaFila+='<td><a href="#!" onclick="editarMaquina(\''+key+'\');"><i class="material-icons">edit</i></a></td>'
          nuevaFila+='<td><a href="#!" onclick="borrarMaquina(\''+key+'\');"><i class="material-icons red-text">delete</i></a></td>'
          nuevaFila+='</tr>'
          $("#maquina-rows").append(nuevaFila)
      count ++
      sub += parseFloat(datos[key].importe)
    }
    $('#subtotal_maquina').text('Subtotal : $' + number_format(sub,2))
  })
}

function borrarMaquina(key){
  var checkstr =  confirm('Deseas eliminar la maquina?');
    if(checkstr === true){
      var elementoABorrar = detalle_maquina.child(key)
      elementoABorrar.remove()
      leerDatosMaquina()
    }else{
    return false;
    }
}

function editarMaquina(key){
  $('#maquina-form').show()
  $('#nueva-maquina').hide()
  var elementoAEditar = detalle_maquina.child(key)
  elementoAEditar.once('value', function(snap){
    var datos = snap.val()
    elementoEditar = elementoAEditar
    $('#descripcion_maquina').val(datos.descripcion)
    $('#cantidad_maquina').val(datos.cantidad)
    $('#unidad_maquina').val(datos.unidad)
    $('#costo_maquina').val(datos.costo)
    $('#importe_maquina').val(datos.importe)
  })
  $('#enviardatamaquina').hide()
  $('#editardatamaquina').show()
  M.updateTextFields()
  $('select').formSelect()
}

//Calcular cuanto es el importe multiplicando cantidad por pu
function calcularImporteMaquina(){
  var cantidad = parseFloat($('#cantidad_maquina').val())
  var costo = parseFloat($('#costo_maquina').val())
  $('#importe_maquina').val(cantidad * costo)
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
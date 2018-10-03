$(document).ready(function(){
  $('.loader-back').show()
  inicializar()
  leerDatos()
  $('#module-form').hide()
  $('#editardata').hide()
  $('select').formSelect()
})

var formulario
var presupuestos
var submit = $('#enviardata').text()
var elementoEditar

function inicializar(){
  presupuestos = firebase.database().ref().child('presupuestos')
}

function enviarDatos(){
  var descripcion = $('#descripcion').val()
  var procedimiento = $('#procedimiento').val()
  var fecha = $('#fecha').val()
  var ubicacion = $('#ubicacion').val()
  var duracion = $('#duracion').val()
  var notas = $('#notas').val()
  var subtotal = $('#subtotal').val()
  var iva = $('#iva').val()
  var total = $('#total').val()
  var indirectos = $('#indirectos').val()
  var utilidad = $('#utilidad').val()
  var comment = $('#comment').val()
  presupuestos.push({
    descripcion: descripcion,
    procedimiento: procedimiento,
    fecha : fecha,
    ubicacion : ubicacion,
    duracion : duracion,
    notas : notas,
    subtotal : subtotal,
    iva : iva,
    total : total,
    indirectos : indirectos,
    utilidad : utilidad,
    comment : comment
  })  
  $('#module-form').hide()
  $('#nuevo-presupuesto').show()
  M.toast({html: 'Guardado!', classes: 'rounded'});
  leerDatos()
}

function editarDatos(){
  var descripcion = $('#descripcion').val()
  var procedimiento = $('#procedimiento').val()
  var fecha = $('#fecha').val()
  var ubicacion = $('#ubicacion').val()
  var duracion = $('#duracion').val()
  var notas = $('#notas').val()
  var subtotal = $('#subtotal').val()
  var iva = $('#iva').val()
  var total = $('#total').val()
  var indirectos = $('#indirectos').val()
  var utilidad = $('#utilidad').val()
  var comment = $('#comment').val()
  elementoEditar.update({
    descripcion: descripcion,
    procedimiento: procedimiento,
    fecha : fecha,
    ubicacion : ubicacion,
    duracion : duracion,
    notas : notas,
    subtotal : subtotal,
    iva : iva,
    total : total,
    indirectos : indirectos,
    utilidad : utilidad,
    comment : comment
    })
  $('#module-form').hide()
  $('#nuevo-presupuesto').show()
  M.toast({html: 'Actualizado!', classes: 'rounded'});
  leerDatos()
  $('input').val('')
  $('#enviardata').show()
  $('#editardata').hide()
}

function leerDatos(){
  presupuestos.on('value',function(snap){
    $("#presupuestos-rows > tr").remove()
    var datos = snap.val()
    for(var key in datos){
      var nuevaFila='<tr>'
          nuevaFila+='<td>'+datos[key].procedimiento+'</td>'
          nuevaFila+='<td>'+datos[key].fecha+'</td>'
          nuevaFila+='<td>'+datos[key].ubicacion+'</td>'
          nuevaFila+='<td>'+datos[key].duracion+'</td>'
          nuevaFila+='<td>$'+number_format(datos[key].subtotal,2)+'</td>'
          nuevaFila+='<td>$'+number_format(datos[key].iva,2)+'</td>'
          nuevaFila+='<td>$'+number_format(datos[key].total,2)+'</td>'
          nuevaFila+='<td><a href="#!" onclick="editar(\''+key+'\');"><i class="material-icons">edit</i></a></td>'
          //nuevaFila+='<td><a href="#!" onclick="$( \'#work-place\' ).load( \'detalle_presupuesto.html\',{k:\''+key+'\'});"><i class="material-icons green-text">attach_money</i></a></td>'
          nuevaFila+='<td><a href="#!" onclick="$( \'#work-place\' ).load( \'detalle_presupuesto.html\');$(\'#hiddenkey\').val(\''+key+'\')"><i class="material-icons green-text">attach_money</i></a></td>'
          nuevaFila+='<td><a href="#!" onclick="borrar(\''+key+'\');"><i class="material-icons red-text">delete</i></a></td>'
          nuevaFila+='</tr>'
          $("#presupuestos-rows").append(nuevaFila)
    }
    $('.loader-back').hide()
  })
}

function borrar(key){
  var checkstr =  confirm('Deseas eliminar el presupuesto?');
    if(checkstr === true){
      var elementoABorrar = presupuestos.child(key)
      elementoABorrar.remove()
      leerDatos()
    }else{
    return false;
    }
}

function editar(key){
  $('#module-form').show()
  $('#nuevo-presupuesto').hide()
  var elementoAEditar = presupuestos.child(key)
  elementoAEditar.once('value', function(snap){
    var datos = snap.val()
    elementoEditar = elementoAEditar
    $('#descripcion').val(datos.descripcion)
    $('#procedimiento').val(datos.procedimiento)
    $('#fecha').val(datos.fecha)
    $('#ubicacion').val(datos.ubicacion)
    $('#duracion').val(datos.duracion)
    $('#notas').val(datos.notas)
    $('#subtotal').val(datos.subtotal)
    $('#iva').val(datos.iva)
    $('#total').val(datos.total)
    $('#indirectos').val(datos.indirectos)
    $('#utilidad').val(datos.utilidad)
    $('#comment').val(datos.comment)
    M.updateTextFields()
    $('select').formSelect()
  })
  $('#enviardata').hide()
  $('#editardata').show()
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

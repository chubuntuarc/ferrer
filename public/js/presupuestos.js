$(document).ready(function(){
  $('.loader-back').show()
  inicializar()
  $('#module-form').hide()
  $('#editar_presupuesto').hide()
  $('select').formSelect()
})

var presupuestos
var elementoEditar

//Inicializar objeto principal
function inicializar(){
  presupuestos = firebase.database().ref().child('presupuestos')
  listaPresupuestos()
}

//Boton agregar presupuesto
function agregarPresupuesto(){
  $('#module-form').show()
  $('#nuevo-presupuesto').hide()
  $('input.validate').val('')
  $('#guardar_presupuesto').show()
  $('#editar_presupuesto').hide()
}

//Boton cancelar en formulario
function cancelarPresupuesto(){
  $('#module-form').hide()
  $('#nuevo-presupuesto').show()
}

//Registrar presupuesto
function guardarPresupuesto(){
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
  }).then((snap) => {
     $('#module-form').hide()
     $('#nuevo-presupuesto').show()
     M.toast({html: 'Guardado!', classes: 'rounded'})
  }) 
}

//Actualizar los datos del presupuesto
function actualizarPresupuesto(){
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
  }).then((snap) => {
    $('#module-form').hide()
    $('#nuevo-presupuesto').show()
    $('input.validate').val('')
    $('#guardar_presupuesto').show()
    $('#editar_presupuesto').hide()
    M.toast({html: 'Actualizado!', classes: 'rounded'})
  }) 
}

//Listado de los presupuestos creados
function listaPresupuestos(){
  presupuestos.on('value',function(snap){
    $("#presupuestos-rows > tr").remove()
    var datos = snap.val()
    for(var key in datos){
      var nuevaFila='<tr>'
          nuevaFila+='<td>'+datos[key].procedimiento+'</td>'
          nuevaFila+='<td class="hide-on-small-only">'+datos[key].fecha+'</td>'
          nuevaFila+='<td class="hide-on-small-only">'+datos[key].ubicacion+'</td>'
          nuevaFila+='<td class="hide-on-small-only">'+datos[key].duracion+'</td>'
          nuevaFila+='<td class="hide-on-small-only">$'+number_format(datos[key].subtotal,2)+'</td>'
          nuevaFila+='<td class="hide-on-small-only">$'+number_format(datos[key].iva,2)+'</td>'
          nuevaFila+='<td>$'+number_format(datos[key].total,2)+'</td>'
          nuevaFila+='<td class="hide-on-small-only"><a href="#!" onclick="editarPresupuesto(\''+key+'\');"><i class="material-icons">edit</i></a></td>'
          nuevaFila+='<td><a href="#!" onclick="$( \'#work-place\' ).load( \'detalle_presupuesto.html\');$(\'#hiddenkey\').val(\''+key+'\')"><i class="material-icons green-text">attach_money</i></a></td>'
          nuevaFila+='<td class="hide-on-small-only"><a href="#!" onclick="clonarPresupuesto(\''+key+'\');"><i class="material-icons orange-text">content_copy</i></a></td>'
          nuevaFila+='<td class="hide-on-small-only"><a href="#!" onclick="borrarPresupuesto(\''+key+'\');"><i class="material-icons red-text">delete</i></a></td>'
          nuevaFila+='</tr>'
          $("#presupuestos-rows").append(nuevaFila)
    }
    $('.loader-back').hide()
    datatable()
  })
}

//Llamar a edicion desde el listado
function editarPresupuesto(key){
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
  $('#guardar_presupuesto').hide()
  $('#editar_presupuesto').show()
}

function borrarPresupuesto(key){
  var checkstr =  confirm('Deseas eliminar el presupuesto?');
    if(checkstr === true){
      var elementoABorrar = presupuestos.child(key)
      elementoABorrar.remove()
    }else{
    return false;
    }
}

//Master key for clone
var mkey

//Clonar presupuesto
function clonarPresupuesto(key){
  mkey = key
  presupuesto_clonar = firebase.database().ref().child('presupuestos').child(key)
  presupuestos_clonar = firebase.database().ref().child('presupuestos')
  presupuesto_clonar.on('value',function(snap){
    presupuestos_clonar.push(snap.val()).then((snap) => {
     const key = snap.key 
     clonarDetallePresupuesto(key)
  }) 
  })
}

function clonarDetallePresupuesto(key){
  $('.loader-back').show()
  detalle_presupuesto_clonar = firebase.database().ref().child('detalle_presupuestos').child(mkey)
  detalle_presupuesto_nuevo_clonar = firebase.database().ref().child('detalle_presupuestos').child(key)
  detalle_presupuesto_clonar.on('value',function(snap){
    var datos = snap.val()
    for(var k in datos){
      clonarDEtalleCodigo(k)
      detalle_presupuesto_nuevo_clonar.push(datos[k])
    }
  })
}

function clonarDEtalleCodigo(k){
 setTimeout(function() { location.reload(); }, 5000) 
}
//FIN del clonado

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

var key = $('#hiddenkey').val()
var masterkey = $('#hiddenmasterkey').val()
var ca = $('#cantidad_codigo_master').val()
var indirectos = parseFloat($('#indirectos').val())
var utilidad = parseFloat($('#utilidad').val())

$(document).ready(function(){
  inicializarMateriales()
  $('#material-form').hide()
  $('#editardatamaterial').hide()
})

var elementoEditar

function inicializarMateriales(){
  detalle_presupuesto = firebase.database().ref().child('detalle_presupuestos').child(masterkey).child(key)
  detalles_presupuestos = firebase.database().ref().child('detalle_presupuestos').child(masterkey)
  detalle_material = firebase.database().ref().child('detalle_codigo').child(key).child('MAT')
  importes_materiales = firebase.database().ref().child('detalle_codigo').child(key).child('MAT')
  importes_mano = firebase.database().ref().child('detalle_codigo').child(key).child('MO')
  importes_herramientas = firebase.database().ref().child('detalle_codigo').child(key).child('HER')
  importes_maquinas = firebase.database().ref().child('detalle_codigo').child(key).child('MAQ')
  presupuesto = firebase.database().ref().child('presupuestos').child(masterkey)
  leerDatosMateriales()
}


function enviarDatosMateriales(){
  var descripcion = $('#descripcion_material').val()
  var cantidad = $('#cantidad_material').val()
  var unidad = $('#unidad_material').val()
  var costo = $('#costo_material').val()
  var importe = $('#importe_material').val()
  detalle_material.push({
    descripcion: descripcion,
    cantidad: cantidad,
    unidad : unidad,
    costo : costo,
    importe : importe
  })  
  $('#material-form').hide()
  $('#nuevo-material').show()
  M.toast({html: 'Guardado!', classes: 'rounded'});
}

function editarDatosMateriales(){
  var descripcion = $('#descripcion_material').val()
  var cantidad = $('#cantidad_material').val()
  var unidad = $('#unidad_material').val()
  var costo = $('#costo_material').val()
  var importe = $('#importe_material').val()
  elementoEditar.update({
    descripcion: descripcion,
    cantidad: cantidad,
    unidad : unidad,
    costo : costo,
    importe : importe
    })
  $('#material-form').hide()
  $('#nuevo-material').show()
  M.toast({html: 'Actualizado!', classes: 'rounded'})
  $('input.validate').val('')
  $('#enviardatamaterial').show()
  $('#editardatamaterial').hide()
}

function leerDatosMateriales(){
  detalle_material.on('value',function(snap){
    $("#materiales-rows > tr").remove()
    var datos = snap.val()
    var count = 1
    var sub = 0
    for(var key in datos){
      var nuevaFila='<tr>'
          nuevaFila+='<td>MAT-'+count+'</td>'
          nuevaFila+='<td>'+datos[key].descripcion+'</td>'
          nuevaFila+='<td>'+datos[key].cantidad+'</td>'
          nuevaFila+='<td>'+datos[key].unidad+'</td>'
          nuevaFila+='<td>$'+number_format(datos[key].costo,2)+'</td>'
          nuevaFila+='<td>$'+number_format(datos[key].importe,2)+'</td>'
          nuevaFila+='<td><a href="#!" onclick="editarMaterial(\''+key+'\');"><i class="material-icons">edit</i></a></td>'
          nuevaFila+='<td><a href="#!" onclick="borrarMaterial(\''+key+'\');"><i class="material-icons red-text">delete</i></a></td>'
          nuevaFila+='</tr>'
          $("#materiales-rows").append(nuevaFila)
      count ++
      sub += parseFloat(datos[key].importe)
    }
    $('#subtotal_materiales').text('Subtotal : $' + number_format(sub,2))
    $('.loader-back').hide()
    actualizarSubtotal()
  })
}

function borrarMaterial(key){
  var checkstr =  confirm('Deseas eliminar el material?');
    if(checkstr === true){
      var elementoABorrar = detalle_material.child(key)
      elementoABorrar.remove()
    }else{
    return false;
    }
}

function editarMaterial(key){
  $('#material-form').show()
  $('#nuevo-material').hide()
  var elementoAEditar = detalle_material.child(key)
  elementoAEditar.once('value', function(snap){
    var datos = snap.val()
    elementoEditar = elementoAEditar
    $('#descripcion_material').val(datos.descripcion)
    $('#cantidad_material').val(datos.cantidad)
    $('#unidad_material').val(datos.unidad)
    $('#costo_material').val(datos.costo)
    $('#importe_material').val(datos.importe)
  })
  $('#enviardatamaterial').hide()
  $('#editardatamaterial').show()
  M.updateTextFields()
  $('select').formSelect()
}


//Checar el detalle_presupuesto
function actualizarSubtotal(){
  var subtotal_materiales = 0
  var subtotal_mano = 0
  var subtotal_herramienta = 0
  var subtotal_maquina = 0
  importes_materiales.on('value',function(snap){
    var datos = snap.val()
    for(var key in datos){
      if(isNaN(datos[key].importe)){
        subtotal_materiales += 0
      }else{
        subtotal_materiales += parseFloat(datos[key].importe)
      }
    }
  })
  importes_mano.on('value',function(snap){
    var datos = snap.val()
    for(var key in datos){
      if(isNaN(datos[key].importe)){
        subtotal_mano += 0
      }else{
        subtotal_mano += parseFloat(datos[key].importe)
      }
    }
  })
  importes_herramientas.on('value',function(snap){
    var datos = snap.val()
    for(var key in datos){
      if(isNaN(datos[key].importe)){
        subtotal_herramienta += 0
      }else{
        subtotal_herramienta += parseFloat(datos[key].importe)
      }
    }
  })
  importes_maquinas.on('value',function(snap){
    var datos = snap.val()
    for(var key in datos){
      if(isNaN(datos[key].importe)){
        subtotal_maquina += 0
      }else{
        subtotal_maquina += parseFloat(datos[key].importe)
      }
    }
  })
  var subtotal_codigo = parseFloat(subtotal_materiales) + parseFloat(subtotal_mano) + parseFloat(subtotal_herramienta) + parseFloat(subtotal_maquina)
  $('#subtotal_codigo').text('$'+number_format(subtotal_codigo,2))
  var nuevo_indirectos = subtotal_codigo * indirectos
  var nuevo_utilidad = subtotal_codigo * utilidad
  var suma = subtotal_codigo + nuevo_indirectos + nuevo_utilidad
  console.log('x : ' + suma)
  $('#indirectos_codigo').text('Indirectos : $'+number_format(nuevo_indirectos,2))
  $('#utilidad_codigo').text('Utilidad : $'+number_format(nuevo_utilidad,2))
  $('#total_codigo').text('Total : $'+number_format(suma,2))
  guardarSubtotal(suma)
}

function guardarSubtotal(subtotal){
  var cantidad = parseFloat(ca)
  var importe = parseFloat(subtotal) * parseFloat(cantidad)
  detalle_presupuesto.update({ pu: subtotal.toString(), importe : importe })
  actualizarSubtotalPresupuesto()
}

function actualizarSubtotalPresupuesto(){
  var subtotal = 0
  detalles_presupuestos.on('value',function(snap){
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
function calcularImporteMaterial(){
  var cantidad = parseFloat($('#cantidad_material').val())
  var costo = parseFloat($('#costo_material').val())
  $('#importe_material').val(cantidad * costo)
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
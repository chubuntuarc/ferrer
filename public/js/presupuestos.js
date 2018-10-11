$(document).ready(function(){
  $('.loader-back').show()
  inicializar()
  $('#module-form').hide()
  $('#editar_presupuesto').hide()
  $('select').formSelect()
})

var presupuestos
var elementoAEditar
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
    $('#module-form').hide();
    $('#nuevo-presupuesto').show();
    $('input.validate').val('');
    $('#guardar_presupuesto').show();
    $('#editar_presupuesto').hide();
    M.toast({html: 'Actualizado!', classes: 'rounded'});
    var key = $('#presupuesto_key').val();
    actualizarCodigos(key);
  }); 
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
          nuevaFila+='<td class="hide-on-small-only" style="font-size: 10px;">'+datos[key].descripcion+'</td>'
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
  $('#presupuesto_key').val(key);
  $('#module-form').show();
  $('#nuevo-presupuesto').hide();
  elementoAEditar = presupuestos.child(key);
  elementoAEditar.once('value', function(snap){
    var datos = snap.val();
    elementoEditar = elementoAEditar;
    $('#descripcion').val(datos.descripcion);
    $('#procedimiento').val(datos.procedimiento);
    $('#fecha').val(datos.fecha);
    $('#ubicacion').val(datos.ubicacion);
    $('#duracion').val(datos.duracion);
    $('#notas').val(datos.notas);
    $('#subtotal').val(datos.subtotal);
    $('#iva').val(datos.iva);
    $('#total').val(datos.total);
    $('#indirectos').val(datos.indirectos);
    $('#utilidad').val(datos.utilidad);
    $('#comment').val(datos.comment);
    M.updateTextFields();
    $('select').formSelect();
  });
  $('#guardar_presupuesto').hide();
  $('#editar_presupuesto').show();
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

//Actualizar codigos con nuemro indirecto y utilidad
function actualizarCodigos(key){
      
       firebase.database().ref().child('presupuestos').child(key).on('value',function(snap){
         var datos = snap.val();
         for(var key in datos){
           $('#indirectos_h').val(datos.indirectos);
           $('#utilidad_h').val(datos.utilidad);
         }
       });
       firebase.database().ref().child('detalle_presupuestos').child(key).on('value',function(snap){
        var datos = snap.val()
        var masterkey = snap.key;
          for(var key in datos){
            presupuesto = firebase.database().ref().child('presupuestos').child(masterkey)
            detalle_presupuesto = firebase.database().ref().child('detalle_presupuestos').child(masterkey).child(key)
            detalles_presupuestos = firebase.database().ref().child('detalle_presupuestos').child(masterkey)
            detalle_presupuesto.on('value',function(snap){
               var datos = snap.val();
                for(var k in datos){
                  $('#cantidad_codigo_master').val(datos.cantidad);
                }
            });
            importes_materiales = firebase.database().ref().child('detalle_codigo').child(key).child('MAT');
            importes_mano = firebase.database().ref().child('detalle_codigo').child(key).child('MO');
            importes_herramientas = firebase.database().ref().child('detalle_codigo').child(key).child('HER');
            importes_maquinas = firebase.database().ref().child('detalle_codigo').child(key).child('MAQ');
      
            
            importes_mano.on('value',function(snap){
              var datos = snap.val();
              var subtotal_mano = 0;
              for(var key in datos){
                if(isNaN(datos[key].importe)){
                  subtotal_mano += 0
                }else{
                  subtotal_mano += parseFloat(datos[key].importe)
                }
              }
              $('#subtotal_mano').val(subtotal_mano);
            });
            importes_herramientas.on('value',function(snap){
              var datos = snap.val();
              var subtotal_herramienta = 0;
              for(var key in datos){
                if(isNaN(datos[key].importe)){
                  subtotal_herramienta += 0
                }else{
                  subtotal_herramienta += parseFloat(datos[key].importe)
                }
              }
              $('#subtotal_herramienta').val(subtotal_herramienta);
            });
            importes_maquinas.on('value',function(snap){
              var subtotal_maquina = 0;
              var datos = snap.val()
              for(var key in datos){
                if(isNaN(datos[key].importe)){
                  subtotal_maquina += 0
                }else{
                  subtotal_maquina += parseFloat(datos[key].importe)
                }
              }
              $('#subtotal_maquina').val(subtotal_maquina);
            });
            importes_materiales.on('value',function(snap){
              var datos = snap.val();
              var subtotal_materiales = 0;
              for(var key in datos){
                if(isNaN(datos[key].importe)){
                  subtotal_materiales += 0
                }else{
                  subtotal_materiales += parseFloat(datos[key].importe)
                }
              }
              $('#subtotal_materiales').val(subtotal_materiales);
              
                var subtotal_materiales = parseFloat($('#subtotal_materiales').val());
                var subtotal_mano = parseFloat($('#subtotal_mano').val());
                var subtotal_herramienta = parseFloat($('#subtotal_herramienta').val());
                var subtotal_maquina = parseFloat($('#subtotal_maquina').val());
                
                var subtotal_codigo = parseFloat(subtotal_materiales) + parseFloat(subtotal_mano) + parseFloat(subtotal_herramienta) + parseFloat(subtotal_maquina);
               
                var indirectos = parseFloat($('#indirectos_h').val());
                var utilidad = parseFloat($('#utilidad_h').val());
                var nuevo_indirectos = parseFloat(subtotal_codigo) * parseFloat(indirectos);
                var nuevo_utilidad = parseFloat(subtotal_codigo) * parseFloat(utilidad);
                
                var suma = parseFloat(subtotal_codigo) + parseFloat(nuevo_indirectos) + parseFloat(nuevo_utilidad);
                
                var ca = $('#cantidad_codigo_master').val();
                var cantidad = parseFloat(ca);
                var importe = parseFloat(parseFloat(suma).toFixed(2)) * parseFloat(cantidad);
                detalle_presupuesto.update({ pu: parseFloat(parseFloat(suma).toFixed(2)), importe : parseFloat(importe) });
                
                
                detalles_presupuestos.on('value',function(snap){
                  var datos = snap.val();
                  var subtotal = 0;
                  for(var key in datos){
                    if(datos[key].importe >= 0){
                        subtotal += parseFloat(datos[key].importe)
                    }
                  }
                  presupuesto.update({ subtotal: subtotal.toString() })
                  
                  var sub = parseFloat(subtotal)
                  var calc = 0.16
                  var iva = sub * calc
                  var total = iva + sub
                  presupuesto.update({ iva: iva.toString(), total: total.toString() });
                  
                });
            });
            
           
  
          }
      });
}
//FIN Actualizar codigos con nuemro indirecto y utilidad

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

//Get url values
$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return decodeURI(results[1]) || 0;
    }
}

var key = $.urlParam('k')

$(document).ready(function(){
  $('.loader-back').show();
  $('#notas').load('pdf/notas.html');
  inicializar();
  datosHead();
})

function inicializar(){
  presupuesto = firebase.database().ref().child('presupuestos').child(key)
  detalle_presupuesto = firebase.database().ref().child('detalle_presupuestos').child(key)
}

var descripcion
var procedimiento
var fecha
var ubicacion
var subtotal
var iva
var total

function datosHead(){
  presupuesto.once('value').then(function(snapshot) {
    if(snapshot.val().notas === 'No'){
       $('#notas').hide()
       }
    descripcion = snapshot.val().descripcion || 'N/A'
    procedimiento = snapshot.val().procedimiento || 'N/A'
    fecha = snapshot.val().fecha || 'N/A'
    ubicacion = snapshot.val().ubicacion || 'N/A'
    subtotal = 'Subtotal: $'+number_format((snapshot.val() && snapshot.val().subtotal) || '$0.00', 2)
    iva = 'IVA: $'+number_format((snapshot.val() && snapshot.val().iva) || '$0.00', 2)
    total = 'Total: $'+number_format((snapshot.val() && snapshot.val().total) || '$0.00', 2)
  $('.descripcion_proyecto').text(descripcion)
  $('.procedimiento_proyecto').text(procedimiento)
  $('.fecha_proyecto').text(fecha)
  $('.ubicacion_proyecto').text(ubicacion)
  $('#subtotal_proyecto').text(subtotal)
  $('#iva_proyecto').text(iva)
  $('#total_proyecto').text(total)
    $('#indirectos').val(snapshot.val().indirectos)
    $('#utilidad').val(snapshot.val().utilidad)
})
  
detalle_presupuesto.on('value',function(snap){
    var datos = snap.val()
    for(var key in datos){
      var nuevaFila='<tr>'
          nuevaFila+='<td style="font-size: 13px;text-align:center;font-weight:bold;">'+datos[key].codigo+'</td>'
          nuevaFila+='<td style="font-size: 10px;">'+datos[key].descripcion+'</td>'
          nuevaFila+='<td style="font-size: 13px;text-align:center;font-weight:bold;">'+datos[key].cantidad+'</td>'
          nuevaFila+='<td style="font-size: 13px;text-align:center;font-weight:bold;">'+datos[key].unidad+'</td>'
          nuevaFila+='<td style="font-size: 13px;text-align:center;font-weight:bold;">$'+number_format(datos[key].pu,2)+'</td>'
          nuevaFila+='<input type="hidden" id="'+key+'" value="'+datos[key].pu+'"/>'
          nuevaFila+='<td style="font-size: 13px;text-align:center;font-weight:bold;">$'+number_format(datos[key].importe,2)+'</td>'
          nuevaFila+='</tr>'
          $("#codigos-rows").append(nuevaFila)
    }
  
    var keys = Object.keys(datos)
    var importes
    for(var i = 0;i <= keys.length;i++){
      detalle_codigo = firebase.database().ref().child('detalle_codigo').child(keys[i])
      //Head
      var nuevoCodigo = '<div class="salto_pagina_anterior" id="codigos">'
          nuevoCodigo += '<div class="row">'
          nuevoCodigo += '<div class="col s6"><img src="images/logo.png" alt="" style="margin-top: 10px;height: 58px;"></div>'
          nuevoCodigo += '<div class="col s6 right-align">'
          nuevoCodigo += '<p style="font-weight: bold;font-size: 11px;margin-bottom: -16px;text-align:center;">J-Ferrer Tecnología Diseño y Construccion</p>'
          nuevoCodigo += '<p style="font-weight: bold;font-size: 11px;margin-bottom: -16px;text-align:center;">S.A de C.V JTD131226964 H. Colegio Militar</p>'
          nuevoCodigo += '<p style="font-weight: bold;font-size: 11px;margin-bottom: -16px;text-align:center;">#47 int 3 Col. Cumbres de Llano Largo</p>'
          nuevoCodigo += '<p style="font-weight: bold;font-size: 11px;margin-bottom: -16px;text-align:center;">Acapulco, Gro.</p>'
          nuevoCodigo += '</div>'
          nuevoCodigo += '</div>'
      
          nuevoCodigo += '<div class="row">'
          nuevoCodigo += '<div class="col s9" style="border: 1px solid;height: 60px;">'
          nuevoCodigo += '<p class="descripcion_proyecto" style="font-size: 10px;font-weight: bold;">'+descripcion+'</p>'
          nuevoCodigo += '</div>'
      
          nuevoCodigo += '<div class="col s3" style="border: 1px solid;height: 60px;text-align:center;">'
          nuevoCodigo += '<div class="row" style="margin-bottom:0px;margin-top: -5px;">'
          nuevoCodigo += '<p style="font-size: 10px;font-weight: bold;margin-bottom: -14px;">PROCEDIMIENTO</p>'
          nuevoCodigo += '</div>'
          nuevoCodigo += '<div class="row" style="margin-bottom:0px;">'
          nuevoCodigo += '<p class="procedimiento_proyecto" style="font-size: 10px;font-weight: bold;margin-bottom: -14px;">'+procedimiento+'</p>'
          nuevoCodigo += '</div>'
          nuevoCodigo += '<div class="row"style="margin-bottom:0px;">'
          nuevoCodigo += '<p style="font-size: 10px;font-weight: bold;margin-bottom: -14px;">FECHA</p>'
          nuevoCodigo += '</div>'
          nuevoCodigo += '<div class="row" style="margin-bottom:0px;">'
          nuevoCodigo += '<p class="fecha_proyecto" style="font-size: 10px;font-weight: bold;margin-bottom: -14px;">'+fecha+'</p>'
          nuevoCodigo += '</div>'
          nuevoCodigo += '</div>'
          nuevoCodigo += '</div>'
      
          nuevoCodigo += '<div class="row" style="margin-top: -18px;">'
          nuevoCodigo += '<div class="col s2" style="border:1px solid;height: 40px;">'
          nuevoCodigo += '<p style="font-size:10px;font-weight:bold;text-align:center;">UBICACION</p>'
          nuevoCodigo += '</div>'
          nuevoCodigo += '<div class="col s10" style="border:1px solid;height: 40px;">'
          nuevoCodigo += '<p class="ubicacion_proyecto" style="font-size:10px;font-weight:bold;text-align:center;margin-top: 4px;">'+ubicacion+'</p>'
          nuevoCodigo += '</div>'
          nuevoCodigo += '</div>'
          nuevoCodigo += '</div>'

          nuevoCodigo += '<div class="row center" style="border: 1px solid; margin-top: -18px;background-color: #00B0F0;color: #FFF; font-size: 12px;">'
          nuevoCodigo += '<div class="col s2"><p>CÓDIGO </p></div>'
          nuevoCodigo += '<div class="col s6"><p>DESCRIPCIÓN </p></div>'
          nuevoCodigo += '<div class="col s2"><p>CANTIDAD </p></div>'
          nuevoCodigo += '<div class="col s2"><p>UNIDAD </p></div>'
          nuevoCodigo += '</div>'
      
          nuevoCodigo += '<div class="row" style="margin-top: -20px;border: 1px solid;font-size: 10px;">'
          nuevoCodigo += '<div class="col s2" style="text-align:center;">'
          nuevoCodigo += '<p>'+datos[keys[i]].codigo+'</p>'
          nuevoCodigo += '</div>'
          nuevoCodigo += '<div class="col s6">'
          nuevoCodigo += '<p>'+datos[keys[i]].descripcion+'</p>'
          nuevoCodigo += '</div>'
          nuevoCodigo += '<div class="col s2" style="text-align:center;">'
          nuevoCodigo += '<p>'+datos[keys[i]].cantidad+'</p>'
          nuevoCodigo += '</div>'
          nuevoCodigo += '<div class="col s2" style="text-align:center;">'
          nuevoCodigo += '<p>'+datos[keys[i]].unidad+'</p>'
          nuevoCodigo += '</div>'
          nuevoCodigo += '</div>'
      
          nuevoCodigo += '<div class="row">'
          nuevoCodigo += '<div class="col s12">'
          nuevoCodigo += '<h5 style="text-align: center;font-size: 14px;color:#00B0F0;margin-top: -10px;">Análisis de Precios Unitarios</h5>'
          nuevoCodigo += '</div>'
          nuevoCodigo += '</div>'

           nuevoCodigo += '<div class="row" style="text-align:center;margin-top: -20px;border: 1px solid;font-size: 10px;height: 20px;line-height: 0px;font-weight: bold;">'
           nuevoCodigo += '<div class="col s1"><p>Codigo</p></div>'
           nuevoCodigo += '<div class="col s6"><p>Concepto</p></div>'
           nuevoCodigo += '<div class="col s1"><p>Unidad</p></div>'
           nuevoCodigo += '<div class="col s1"><p>Cantidad</p></div>'
           nuevoCodigo += '<div class="col s1"><p>Costo</p></div>'
           nuevoCodigo += '<div class="col s2"><p>Importe</p></div>'
           nuevoCodigo += '</div>'
      
           var div = 'material'+keys[i]
           nuevoCodigo += '<div id="titulo_'+div+'" class="row" style="font-size: 11px;margin-top: -26px;font-weight: bold;border-bottom: 1px solid cyan;"><div class="col s12"><p style="margin-bottom: 0px;margin-top: 5px;">Materiales</p></div></div>'
             nuevoCodigo += '<div id="'+div+'"></div>'
           nuevoCodigo += '<div class="row" style="font-size: 11px;margin-top: -26px;font-weight: bold;border-bottom: 1px solid cyan;"><div class="col s12"><p style="margin-bottom: 0px;margin-top: 5px;">Mano de obra</p></div></div>'
            var div2 = 'mano'+keys[i]
             nuevoCodigo += '<div id="'+div2+'"></div>'
            nuevoCodigo += '<div class="row" style="font-size: 11px;margin-top: -26px;font-weight: bold;border-bottom: 1px solid cyan;"><div class="col s12"><p style="margin-bottom: 0px;margin-top: 5px;">Equipo y herramientas</p></div></div>'
            var div3 = 'herramienta'+keys[i]
             nuevoCodigo += '<div id="'+div3+'"></div>'
            nuevoCodigo += '<div class="row" style="font-size: 11px;margin-top: -26px;font-weight: bold;border-bottom: 1px solid cyan;"><div class="col s12"><p style="margin-bottom: 0px;margin-top: 5px;">Maquinaria</p></div></div>'
            var div4 = 'maquina'+keys[i]
             nuevoCodigo += '<div id="'+div4+'"></div>'
      
            var submat = 'subtotal_materiales'+keys[i]
            nuevoCodigo += '<input type="hidden" id="'+submat+'" />'
            var subman = 'subtotal_mano_'+keys[i]
            nuevoCodigo += '<input type="hidden" id="'+subman+'" />'
            var subher = 'subtotal_herramienta_'+keys[i]
            nuevoCodigo += '<input type="hidden" id="'+subher+'" />'
            var submaq = 'subtotal_maquina_'+keys[i]
            nuevoCodigo += '<input type="hidden" id="'+submaq+'" />'
            
            var sub = 'subtotal_codigo_'+keys[i]
            var sub2 = 'indirectos_codigo'+keys[i]
            var sub3 = 'utilidad_codigo'+keys[i]
            var sub4 = 'total_codigo'+keys[i]
            nuevoCodigo += '<div class="row">'
            nuevoCodigo += '<p class="light-blue-text" id="'+sub+'" style="text-align: right;margin-right: 20px;font-size: 12px;"></p>'
            nuevoCodigo += '<p class="light-blue-text" id="'+sub2+'" style="text-align: right;margin-right: 20px;font-size: 12px;margin-top: -15px;"></p>'
            nuevoCodigo += '<p class="light-blue-text" id="'+sub3+'" style="text-align: right;margin-right: 20px;font-size: 12px;margin-top: -15px;"></p>'
            nuevoCodigo += '<p class="light-blue-text" id="'+sub4+'" style="text-align: right;margin-right: 20px;font-size: 16px;margin-top: -15px;font-weight: bold;"></p>'
            nuevoCodigo += '</div>'
      
            detalle_codigo_material = firebase.database().ref().child('detalle_codigo').child(keys[i]).child('MAT')
            detalle_codigo_material.once('value').then(function(mat) {
             var data_mat = mat.val();
             var arr = [];
             var count = 0;
             var nuevalinea = '';
             for(var key in data_mat){
               arr.push(key + ',');
               count++;
               var descripcion = data_mat[key]["descripcion"];
               var unidad = data_mat[key]["unidad"];
               var cantidad = data_mat[key]["cantidad"];
               var costo = data_mat[key]["costo"];
               var importe = data_mat[key]["importe"];
                nuevalinea += '<div class="row" style="font-size: 11px;margin-top: -20px;">';
                nuevalinea += '<div class="col s1">';
                nuevalinea += '<p>MAT-'+count+'</p>';
                nuevalinea += '</div>';
                nuevalinea += '<div class="col s6">';
                nuevalinea += '<p>'+descripcion+'</p>';
                nuevalinea += '</div>';
                nuevalinea += '<div class="col s1" style="text-align:center;">';
                nuevalinea += '<p>'+unidad+'</p>';
                nuevalinea += '</div>';
                nuevalinea += '<div class="col s1" style="text-align:center;">';
                nuevalinea += '<p>'+cantidad+'</p>';
                nuevalinea += '</div>';
                nuevalinea += '<div class="col s1" style="text-align:center;">';
                nuevalinea += '<p>$'+number_format(costo,2)+'</p>';
                nuevalinea += '</div>';
                nuevalinea += '<div class="col s2" style="text-align:center;">';
                nuevalinea += '<input type="hidden" class="import_value" value="'+importe+'"/>'; //Importe del elemento
                nuevalinea += '<p>$'+number_format(importe,2)+'</p>';
                nuevalinea += '</div>';
                nuevalinea += '</div>';
             }
                var divx = 'material'+mat.ref.parent.key;
                $('#'+divx).append(nuevalinea);
                $('#subtotal_materiales'+key).val(arr);
           })
           
      //Datos de mano de obra
               detalle_codigo_material = firebase.database().ref().child('detalle_codigo').child(keys[i]).child('MO')
           detalle_codigo_material.once('value').then(function(mat) {
             var data_mat = mat.val();
             var count = 0;
             var nuevalinea = '';
             for(var key in data_mat){
               count++;
               var descripcion = data_mat[key]["descripcion"];
               var unidad = data_mat[key]["unidad"];
               var cantidad = data_mat[key]["cantidad"];
               var costo = data_mat[key]["costo"];
               var importe = data_mat[key]["importe"];
                nuevalinea += '<div class="row" style="font-size: 11px;margin-top: -20px;">';
                nuevalinea += '<div class="col s1">';
                nuevalinea += '<p>MO-'+count+'</p>';
                nuevalinea += '</div>';
                nuevalinea += '<div class="col s6">';
                nuevalinea += '<p>'+descripcion+'</p>';
                nuevalinea += '</div>';
                nuevalinea += '<div class="col s1" style="text-align:center;">';
                nuevalinea += '<p>'+unidad+'</p>';
                nuevalinea += '</div>';
                nuevalinea += '<div class="col s1" style="text-align:center;">';
                nuevalinea += '<p>'+cantidad+'</p>';
                nuevalinea += '</div>';
                nuevalinea += '<div class="col s1" style="text-align:center;">';
                nuevalinea += '<p>$'+number_format(costo,2)+'</p>';
                nuevalinea += '</div>';
                nuevalinea += '<div class="col s2" style="text-align:center;">';
                nuevalinea += '<p>$'+number_format(importe,2)+'</p>';
                nuevalinea += '</div>';
                nuevalinea += '</div>';
                }
                var divx = 'mano'+mat.ref.parent.key;
                $('#'+divx).append(nuevalinea);
              })
               //Mano de obra fin
      
         //Datos de herramienta
               detalle_codigo_material = firebase.database().ref().child('detalle_codigo').child(keys[i]).child('HER')
           detalle_codigo_material.once('value').then(function(mat) {
             var data_mat = mat.val();
             var count = 0;
             var nuevalinea = '';
             for(var key in data_mat){
               count++;
               var descripcion = data_mat[key]["descripcion"];
               var unidad = data_mat[key]["unidad"];
               var cantidad = data_mat[key]["cantidad"];
               var costo = data_mat[key]["costo"];
               var importe = data_mat[key]["importe"];
                nuevalinea += '<div class="row" style="font-size: 11px;margin-top: -20px;">';
                nuevalinea += '<div class="col s1">';
                nuevalinea += '<p>HER-3%</p>';
                nuevalinea += '</div>';
                nuevalinea += '<div class="col s6">';
                nuevalinea += '<p>'+descripcion+'</p>';
                nuevalinea += '</div>';
                nuevalinea += '<div class="col s1" style="text-align:center;">';
                nuevalinea += '<p>'+unidad+'</p>';
                nuevalinea += '</div>';
                nuevalinea += '<div class="col s1" style="text-align:center;">';
                nuevalinea += '<p>'+cantidad+'</p>';
                nuevalinea += '</div>';
                nuevalinea += '<div class="col s1" style="text-align:center;">';
                nuevalinea += '<p>$'+number_format(costo,2)+'</p>';
                nuevalinea += '</div>';
                nuevalinea += '<div class="col s2" style="text-align:center;">';
                nuevalinea += '<p>$'+number_format(importe,2)+'</p>';
                nuevalinea += '</div>';
                nuevalinea += '</div>';
                }
                var divx = 'herramienta'+mat.ref.parent.key;
                $('#'+divx).append(nuevalinea);
              })
               //Mano herramienta fin
      
      //Datos de maquinaria
               detalle_codigo_material = firebase.database().ref().child('detalle_codigo').child(keys[i]).child('MAQ')
           detalle_codigo_material.once('value').then(function(mat) {
             var data_mat = mat.val()
             var count = 0
             for(var key in data_mat){
               count++
               var descripcion = data_mat[key]["descripcion"]
               var unidad = data_mat[key]["unidad"]
               var cantidad = data_mat[key]["cantidad"]
               var costo = data_mat[key]["costo"]
               var importe = data_mat[key]["importe"]
               var nuevalinea = '<div class="row" style="font-size: 11px;margin-top: -20px;">'
                nuevalinea += '<div class="col s1">'
                nuevalinea += '<p>MAQ-'+count+'</p>'
                nuevalinea += '</div>'
                nuevalinea += '<div class="col s6">'
                nuevalinea += '<p>'+descripcion+'</p>'
                nuevalinea += '</div>'
                nuevalinea += '<div class="col s1" style="text-align:center;">'
                nuevalinea += '<p>'+unidad+'</p>'
                nuevalinea += '</div>'
                nuevalinea += '<div class="col s1" style="text-align:center;">'
                nuevalinea += '<p>'+cantidad+'</p>'
                nuevalinea += '</div>'
                nuevalinea += '<div class="col s1" style="text-align:center;">'
                nuevalinea += '<p>$'+number_format(costo,2)+'</p>'
                nuevalinea += '</div>'
                nuevalinea += '<div class="col s2" style="text-align:center;">'
                nuevalinea += '<p>$'+number_format(importe,2)+'</p>'
                nuevalinea += '</div>'
                nuevalinea += '</div>'
               var divx = 'maquina'+mat.ref.parent.key
               $('#'+divx).append(nuevalinea)
                }
              })
               //Maquinaria fin
      
          //Se agrega el codigo
          $("#lista_codigos").append(nuevoCodigo);
          
          //Calculo subtotal, indiecto y utilidad de cada codigo
          var subs = parseFloat($('#'+keys[i]).val()); //Subtotal del codigo
          var indi = parseFloat($('#indirectos').val()); //Indirectos del proyecto
          var utili = parseFloat($('#utilidad').val()); //Utilidad del proyecto
          var sums = parseFloat(indi) + parseFloat(utili);
          var importe_original = number_format(subs / (1 + parseFloat(sums)),2);
          var indirecto = parseFloat(subs) / (1 + parseFloat(sums)) * parseFloat(indi);
          var utilidad = parseFloat(subs) / (1 + parseFloat(sums)) * parseFloat(utili);
          console.log('Subtotal: ' + importe_original)
          console.log('Indirecto: ' + indirecto)
          console.log('Utilidad: ' + utilidad)
          console.log('Sub final: ' + subs)
          //Aplicando en html
          $('#subtotal_codigo_'+keys[i]).text('$'+importe_original);
          $('#indirectos_codigo'+keys[i]).text('Indirecto : $'+number_format(indirecto,2));
          $('#utilidad_codigo'+keys[i]).text('Utilidad : $'+number_format(utilidad,2));
          $('#total_codigo'+keys[i]).text('Subtotal : $'+number_format(subs,2));
            
    }//FIN for para recorrer codigos
  })
}


setTimeout(function() { $('.loader-back').hide();window.print(); }, 5000);

var mediaQueryList = window.matchMedia('print');
mediaQueryList.addListener(function(mql) {
    if (mql.matches) {
        console.log('before print dialog open');
    } else {
        console.log('after print dialog closed');
var ventana = window.self;
                  ventana.opener = window.self;
                  ventana.close();
    }
});


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

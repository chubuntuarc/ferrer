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
  $('#notas').load('pdf/notas.html')
  inicializar()
  datosHead()
})

function inicializar(){
  presupuesto = firebase.database().ref().child('presupuestos').child(key)
  detalle_presupuesto = firebase.database().ref().child('detalle_presupuestos').child(key)
}

function datosHead(){
  presupuesto.once('value').then(function(snapshot) {
    if(snapshot.val().notas === 'No'){
       $('#notas').hide()
       }
    var descripcion = snapshot.val().descripcion || 'N/A'
    var procedimiento = snapshot.val().procedimiento || 'N/A'
    var fecha = snapshot.val().fecha || 'N/A'
    var ubicacion = snapshot.val().ubicacion || 'N/A'
    var subtotal = 'Subtotal: $'+number_format((snapshot.val() && snapshot.val().subtotal) || '$0.00', 2)
    var iva = 'IVA: $'+number_format((snapshot.val() && snapshot.val().iva) || '$0.00', 2)
    var total = 'Total: $'+number_format((snapshot.val() && snapshot.val().total) || '$0.00', 2)
  $('.descripcion_proyecto').text(descripcion)
  $('.procedimiento_proyecto').text(procedimiento)
  $('.fecha_proyecto').text(fecha)
  $('.ubicacion_proyecto').text(ubicacion)
  $('#subtotal_proyecto').text(subtotal)
  $('#iva_proyecto').text(iva)
  $('#total_proyecto').text(total)
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
          nuevaFila+='<td style="font-size: 13px;text-align:center;font-weight:bold;">$'+number_format(datos[key].importe,2)+'</td>'
          nuevaFila+='</tr>'
          $("#codigos-rows").append(nuevaFila)
    }
  })
}

setTimeout(function() { window.print(); }, 5000);

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

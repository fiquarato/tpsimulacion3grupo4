'use strict';

angular.module('Exponencial', ["chart.js"])
.controller('ExponencialController', 
  function ($scope, $confirm, $uibModal, Notification) {

    //Configuraciones generales de la libreria para graficar
    $scope.colors = ['#E54125', '#059BFF', '#4BC0C0', '#FFCE56', '#E7E9ED'];

    $scope.dataSeries = ['Numeros Aleatorios'];
    $scope.onClick = function(points, evt) {
    };
    $scope.datasetOverride = [{
      yAxisID: 'y-axis-1'
    }];
    $scope.options1 = {
      scales: {
        yAxes: [{
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left',
          ticks: {
            beginAtZero: true
          }
        }]
      }
    };

    $scope.disabledButton = false; 

    //Metodo que calcula los numeros aleatorios segun una cantidad deseada
    $scope.randomExponencial = function(lamda,cantidad, intervalos){

      if(lamda<=0) {
        Notification.error({message: 'Lamda debe ser mayor a cero', delay: 3000,  replaceMessage: true});
        return;
      }

      $scope.series = new Array()
      $scope.labels = new Array();
      $scope.data = new Array();
      $scope.randoms = new Array();
      var zetas = new Array();

            var max = -Number.MAX_VALUE,
      min = Number.MAX_VALUE;

      //FOR para crear numeros aleatorios con la formula EXPONENCIAL
      for (var i = 0; i < cantidad; i++) {
        var aux1 = Math.random();
        var random = (-(1/lamda)*Math.log(1-aux1));
        zetas.push(random);
        //Necesito el max y min de los numeros generados, para poder definir el paso de los intervalos
        if (max < random) {
          max = random;
        }
        if (min > random) {
         min = random;
       }
        //RANDOMS es un arreglo con los numeros que se listan, por performance se limita a 5000
        if($scope.randoms.length < 5000) {
          $scope.randoms.push(random.toFixed(2));
        }
      }
      
      //Esta forma de calcular max y min, no va mas. 
      // var max = Math.max(...zetas);
      // var min = Math.min(...zetas);
      $scope.paso = (max-min)/intervalos;

      //El arreglo LABELS guarda el valor maximo LIMITE de cada intervalo
      //El arreglo DATA sera un acumulador con la cantidad de numeros aleatorios presentados por intervalo
      for (var i = 1; i <= intervalos; i++) {
       min = min + $scope.paso;
       $scope.labels.push(min);
       $scope.data.push(0);
     }

     // FOR del arreglo con los numeros aleatorios generados
     for (var i = 0; i <= zetas.length; i++) {
      var labels = $scope.labels;
      var random = zetas[i];
      //FOR del arreglo con los limites maximos de cada intervalo, y pregunto si el numero z[i] pertenece
      //al intervalo, en caso positivo lo acumulo.
      for(var j = 0; j < labels.length; j++){
        if(random <= labels[j]){
          $scope.data[j]++;
          break;
        }
      }
    }
    //El arreglo series tiene el valor medio del intervalo, para presentarlo en la grafica
    for (var i = 0; i < $scope.labels.length; i++) {
     $scope.series.push(($scope.labels[i]-($scope.paso/2)).toFixed(2));
   }
   if($scope.data.length > 0){
    $scope.disabledButton = true;
  }
};

//Metodo para agregar de a un solo numero aleatorio
$scope.random1 = function(lamda){
  var aux1 = Math.random();
  var random = (-(1/lamda)*Math.log(1-aux1));
  
  if($scope.randoms.length < 5000) {
    $scope.randoms.push(random.toFixed(2));
  }

  for(var j = 0; j < $scope.labels.length; j++){
    if(random <= $scope.labels[j]){
      $scope.data[j]++;
      break;
    }
  }
};

//Metodo prueba chi cuadrado
$scope.pruebaChi = function(alfa, lamda,cantidad, intervalos){

  if(alfa<0 || alfa >1) {
    Notification.error({message: 'Alfa debe estar entre 0 y 1', delay: 3000,  replaceMessage: true});
    return;
  }
  
  $scope.frecuenciaEsperada = new Array();
  $scope.suma = 0;
  $scope.sumaFrecuenciaEsperada = 0;
  $scope.arrayChi = new Array();

  //Procedo a calcular la frecuencia esperada para cada intervalo
  for(var i = 0; i < $scope.labels.length; i++){

    //jStat es una libreria de JS que provee funciones para calcular distribuciones
    var aux1 = jStat.exponential.cdf($scope.labels[i], lamda);
    var aux2 = jStat.exponential.cdf($scope.labels[i]-$scope.paso, lamda);
    var aux3 = (aux1-aux2)*cantidad;
    $scope.frecuenciaEsperada.push(aux3);
    $scope.sumaFrecuenciaEsperada = $scope.sumaFrecuenciaEsperada+aux3;
  }

  //[(FE-FO)^2] / FE
  for(var i = 0; i < $scope.data.length; i++){
    var aux = (Math.pow($scope.data[i]-$scope.frecuenciaEsperada[i], 2))/$scope.frecuenciaEsperada[i];
    $scope.arrayChi.push(aux);
    $scope.suma = $scope.suma+aux;
  }

  //Grados de Libertad
  $scope.gdl = intervalos - 2 - 1;

  //Calculo chi cuadrado, 1-alfa -> Nivel de confianza
  //El nivel de confianza es la probabilidad de que el parámetro a estimar se encuentre 
  //en el intervalo de confianza. El nivel de confianza (p) se designa mediante 1 − α, 
  //y se suele tomar en tanto por ciento. 
  //Los niveles de confianza más usuales son: 90%; 95% y 99%. El nivel de significación se designa mediante α.
  $scope.chi = jStat.chisquare.inv(1-alfa,$scope.gdl);
  if($scope.suma<$scope.chi){
    $scope.verifica = 'VERDADERO'
  }
  else {
    $scope.verifica = "FALSO"
  }
};

});

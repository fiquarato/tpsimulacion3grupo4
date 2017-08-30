'use strict';

angular.module('Normal', ["chart.js"])
.controller('NormalController', 
  function ($scope, $confirm, $uibModal, Notification) {

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

    $scope.randomNormal = function(media,sigma,cantidad, intervalos){

      if(sigma<0) {
        Notification.error({message: 'Sigma no puede ser negativo', delay: 3000,  replaceMessage: true});
        return;
      }

      $scope.labels = new Array();
      $scope.series = new Array();
      $scope.data = new Array();
      $scope.zetas = new Array();
      $scope.randoms = new Array();

      var max = -Number.MAX_VALUE,
      min = Number.MAX_VALUE;

      for (var i = 0; i < cantidad; i++) {

        var aux1 = Math.random();
        var aux2 = Math.random();
        var z = (Math.sqrt(-2*Math.log(aux1)))*Math.cos(2*Math.PI*aux2);
        var random = (media+(z*sigma));
        $scope.zetas.push(random);
        if (max < random) {
          max = random;
        }
        if (min > random) {
         min = random;
       }
       if($scope.randoms.length < 5000) {
        $scope.randoms.push(random.toFixed(2));
      }
    }

      // var max = Math.max(...$scope.zetas);
      // var min = Math.min(...$scope.zetas);
      $scope.paso = (max-min)/intervalos;

      for (var i = 1; i <= intervalos; i++) {
       min = (min + $scope.paso);
       $scope.labels.push(min);
       $scope.data.push(0);
     }

     for (var i = 0; i <= $scope.zetas.length; i++) {
      var labels = $scope.labels;
      var random = $scope.zetas[i];
      for(var j = 0; j < labels.length; j++){
        if(random <= labels[j]){
          $scope.data[j]++;
          break;
        }
      }
    }
    for (var i = 0; i < $scope.labels.length; i++) {
      $scope.series.push(($scope.labels[i]-($scope.paso/2)).toFixed(2));
    }
    if($scope.data.length > 0){
      $scope.disabledButton = true;
    }
  };

  $scope.random1 = function(media,sigma){
    var aux1 = Math.random();
    var aux2 = Math.random();
    var z = (Math.sqrt(-2*Math.log(aux1)))*Math.cos(2*Math.PI*aux2);
    var random = (media+(z*sigma));
    $scope.zetas.push(random);

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

  $scope.pruebaChi = function(media, sigma, cantidad, intervalos, alfa){

    if(alfa<0 || alfa >1) {
      Notification.error({message: 'Alfa debe estar entre 0 y 1', delay: 3000,  replaceMessage: true});
      return;
    }

    $scope.frecuenciaEsperada = new Array();
    $scope.suma = 0;
    $scope.sumaFrecuenciaEsperada = 0;
    $scope.arrayChi = new Array();

    for(var i = 0; i < $scope.labels.length; i++){

      var aux1 = jStat.normal.cdf($scope.labels[i], media, sigma);
      var aux2 = jStat.normal.cdf($scope.labels[i]-$scope.paso, media, sigma);
      var aux3 = (aux1-aux2)*cantidad;
      $scope.frecuenciaEsperada.push(aux3);
      $scope.sumaFrecuenciaEsperada = $scope.sumaFrecuenciaEsperada+aux3;
    }

    for(var i = 0; i < $scope.data.length; i++){
      var aux = (Math.pow($scope.data[i]-$scope.frecuenciaEsperada[i], 2))/$scope.frecuenciaEsperada[i];
      $scope.arrayChi.push(aux);
      $scope.suma = $scope.suma+aux;
    }

    $scope.gdl = intervalos - 2 - 1;

    $scope.chi = jStat.chisquare.inv(1-alfa,$scope.gdl);
    if($scope.suma<$scope.chi){
      $scope.verifica = 'VERDADERO'
    }
    else {
      $scope.verifica = "FALSO"
    }
  };

});

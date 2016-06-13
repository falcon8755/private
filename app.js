angular.module('plunker', [])
  .factory('AlertService', function() {
    var types = [{
      "value": "CRASH",
      "name": "크래시"
    }, {
      "value": "TRANSACTION_SUCCESS",
      "name": "트랜잭션 성공률"
    }, {
      "value": "TRANSACTION_LATENCY",
      "name": "트랜잭션 응답시간"
    }, {
      "value": "NETWORK_ERROR",
      "name": "네트워크 오류"
    }, {
      "value": "NETWORK_LATENCY",
      "name": "네트워크 지연시간"
    }];

    var statuses = [{
      "value": "",
      "name": "상태없음"
    }, {
      "value": "RECOGNIZE",
      "name": "경보인지"
    }, {
      "value": "CANCEL_RECOGNIZE",
      "name": "인지취소"
    }, {
      "value": "RELEASE",
      "name": "경보해제"
    }];
    return {
      types: types,

      statuses: statuses
    }
  })
  .controller('MainCtrl', function(AlertService) {
    var vm = this;
    vm.onChangeGroupSelect = function() {
      console.log('change', vm.checkgroup)
    }
  })
  .directive('alertGroupSelector', function() {
    return {
      restrict: 'E',
      require: 'ngModel',
      scope: {
        onChange: '&',
        model: '=ngModel'
      },
      controller: function($scope, $element, $filter, AlertService) {
        var vm = this;

        vm.onChange = function() {
          var newModel = $.extend({}, $scope.model, {
            level: vm.levels,
            status: vm.statuses
          });

          vm.ngModelController.$setViewValue(newModel);

          if (!!$scope.onChange) {
            $scope.onChange();
          }
        };

        vm.statuses = AlertService.statuses.map(function(status) {
          return {
            'checked': false,
            'displayName': status.name,
            'value': status.value
          };
        });

        /* 메뉴창을 클릭할 경우 창이 사라지는 현상을 막는다. */
        $('.dropdown-menu').click(function(e) {
          // console.log(e)
          e.stopPropagation();
        });
        
        $('.search').click(function(e) {
          // console.log(e)
          e.stopPropagation();
        });
        
        $scope.$watch('searchText',function(val){
            vm.searchLevels = $filter('filter')(vm.levels, val);
            vm.searchStatuses = $filter('filter')(vm.statuses, val);
            
            console.log('vm.levels, vm.statuses', vm.levels, vm.statuses)
        });
      
        /*var dropdownEl = $element.find('.dropdown-menu');
  		  var dropdownEl2 = $('.dropdown-menu');
  		  console.log(dropdownEl, dropdownEl2);
  		  $element.find('.dropdown-menu').click(function(e){
  		    console.log('e', e);
  		  })*/
      },
      controllerAs: 'vm',
      templateUrl: 'alertgroupselector.html',
      link: function(scope, el, attrs, ctrl) {
        scope.vm.levels = [{
          checked: false,
          displayName: 'CRITICAL',
          value: 'CRITICAL'
        }, {
          checked: false,
          displayName: 'MAJOR',
          value: 'MAJOR'
        }, {
          checked: false,
          displayName: 'MINOR',
          value: 'MINOR'
        }];

        ctrl.$formatters.push(function(modelValue) {
          if (!modelValue) {
            modelValue = {};
          }

          if (!modelValue.level) {
            modelValue.level = scope.vm.levels;
          }

          if (!modelValue.status) {
            modelValue.status = scope.vm.statuses;
          }

          return modelValue;
        });

        ctrl.$parsers.push(function(viewValue) {
          return viewValue;
        });

        scope.vm.ngModelController = ctrl;
      }
    };
  });

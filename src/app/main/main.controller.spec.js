/**
 * @main.controller.spec.js
 * Unit Test for Main Controller
 */

describe('Main Controller', () => {
  let vm, scope;

  beforeEach(angular.mock.module('logoWriter'));

  beforeEach(inject(($controller, $rootScope) => {
    scope = $rootScope.$new();
    vm = $controller('MainController', {
      $scope: scope
    });
  }));

  it('should have a command object', () => {
    expect(vm.$scope.command).toBeDefined();
  });

  it('should have a executeCommand method', inject(() => {
    expect(vm.$scope.executeCommand).toBeDefined();
  }));

  it('should set the correct command value', inject(() => {
    vm.$scope.executeCommand('forward(20)');
    expect(vm.$scope.command).toEqual({cmd: 'forward', param: 20});
  }));
});

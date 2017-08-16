/**
 * @canvas.directive.spec.js
 * Unit Test for Editor Directive
 */
describe('Canvas Directive', function() {
  let vm;
  let element;

  beforeEach(angular.mock.module('logoWriter'));

  beforeEach(inject(($compile, $rootScope) => {

    element = angular.element(`
      <div canvas-directive></div>
    `);

    $compile(element)($rootScope.$new());
    $rootScope.$digest();
    vm = element.isolateScope().vm;
  }));

  it('should be compiled', () => {
    expect(element.html()).not.toEqual(null);
  });

  it('should have a draw method', () => {
    expect(vm).toEqual(jasmine.any(Object));
    expect(vm.draw).toBeDefined();
    expect(vm.$scope.color).toEqual('white');
  });
});

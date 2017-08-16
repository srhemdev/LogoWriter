/**
 * @editor.directive.spec.js
 * Unit Test for Editor Directive
 */
describe('Editor Directive', function() {
  let vm;
  let element;

  //Add logoWriter mock module
  beforeEach(angular.mock.module('logoWriter'));

  beforeEach(inject(($compile, $rootScope) => {

    element = angular.element(`
      <div editor-directive callback="test(data)"></div>
    `);

    $compile(element)($rootScope.$new());
    $rootScope.$digest();
    vm = element.isolateScope().vm;
  }));

  it('should be compiled', () => {
    expect(element.html()).not.toEqual(null);
  });

  it('should have an aceLoaded method', () => {
    expect(vm).toEqual(jasmine.any(Object));
    expect(vm.$scope.aceLoaded).toBeDefined();
    expect(vm.$scope.callback).toBeDefined();
  });
});

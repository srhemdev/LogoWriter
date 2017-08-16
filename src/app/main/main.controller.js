/**
 * @MainController
 * Serves as the common bridge for interaction between the editor and the canvas.
 */
export class MainController {
  constructor($scope) {
    'ngInject';
    this.$scope = $scope;
    let command = {cmd: null, param: null};
    this.$scope.command  = command;

    //Executes a valid command sent in by the editor.
    this.$scope .executeCommand = (str) => {
      let cmd = str.split('(');
      let func = cmd[0];
      let param = cmd [1].split(')')[0];

      switch (func) {
        case 'forward':
          command = {cmd: 'forward', param: parseInt(param)};
          break;
        case 'right':
          command = {cmd: 'right', param: 90};
          break;
        case 'left':
          command = {cmd: 'left', param: 90};
          break;
        case 'color':
          command = {cmd: 'color', param: param};
          break;
        case 'reset':
          command = {cmd: 'reset'};
          break;
      }

      this.$scope.$apply(() => {this.$scope.command = command;});
    }
  }
}

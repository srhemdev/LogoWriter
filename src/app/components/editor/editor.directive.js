/**
 * @EditorDirective
 * Renders the ACE Editor.
 * @returns {{restrict: string, scope: {callback: string}, template: string, controller: EditController, controllerAs: string}}
 * @constructor
 */
export function EditorDirective() {
  'ngInject';

  /**
   * scope.callback contains the callback to be called when a valid command is entered.
   * It passed back the command data to the Main Controller.
   */
  let directive = {
    restrict: 'A',
    scope: {
      callback: '&'
    },
    template: '<div class="logo-editor" ui-ace="{\
                useWrapMode : true,\
                showGutter: true,\
                theme:\'textmate\',\
                mode: \'javascript\',\
                firstLineNumber: 1,\
                onLoad: aceLoaded,\
                onChange: aceChanged\
                }"></div>',
    controller: EditController,
    controllerAs: 'vm'
  };

  return directive;
}

class EditController {
  constructor($scope) {
    'ngInject';
    this.$scope = $scope;

    //Loads the ace editor
    this.$scope.aceLoaded = (_editor) => {
      // Get editor session
      const _session = _editor.getSession();

      //Register a change listener for changes to within the editor
      _session.on("change", () => {
        //Get cursor position
        let obj = _editor.getCursorPosition();
        let currentRow = obj.row;
        //Get current cursor focused line
        let currentRowValue = _editor.session.getLine(currentRow);

        if (this.validateCommand(currentRowValue) && currentRowValue != '') {
          this.runCommand(currentRowValue);
        } else {
          //Use if you want to turn retain the previous annotations.But they won't clear out
          //_editor.session.setOption("useWorker", false)
          //Set error Annotations for invalid command
          _editor.getSession().setAnnotations([{
            row: currentRow,
            column: 0,
            text: "Error Message", //
            type: "error" // also warning and information
          }]);
        }
      });
    }
  }

  /**
   * Pass the command data to the callback
   * @param command
   */

  runCommand(command) {
    this.$scope.callback({data: command});
  }

  /**
   * Validate if the command matches the regex
   * @param str
   * @returns {boolean}
   */
  validateCommand(str) {
    const pattern = /^(forward\(\d+\)|left\(\)|right\(\)|color\((white|red|blue|green|black)\)|reset\(\))$/
    return pattern.test(str)
  }
}

import { config } from './index.config';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { MainController } from './main/main.controller';
import { EditorDirective } from '../app/components/editor/editor.directive';
import { CanvasDirective } from '../app/components/canvas/canvas.directive';

angular.module('logoWriter', [
  'ngAnimate',
  'ngCookies',
  'ngTouch',
  'ngSanitize',
  'ngMessages',
  'ngAria',
  'ngResource',
  'ui.router',
  'ui.bootstrap',
  'ui.ace'
  ])
  .config(config)
  .config(routerConfig)
  .run(runBlock)
  .controller('MainController', MainController)
  .directive('editorDirective', EditorDirective)
  .directive('canvasDirective', CanvasDirective);



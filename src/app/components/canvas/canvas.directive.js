/**
 * @CanvasDirective
 * Renders the Canvas to potray the commands entered in the ACE editor.
 * @returns {{restrict: string, scope: {cmd: string}, template: string, link: linkFunc, controller: CanvasController, controllerAs: string}}
 * @constructor
 */
export function CanvasDirective() {
  'ngInject';

  let directive = {
    restrict: 'A',
    scope: {
      cmd: '='
    },
    template: '<div class="canvas-directive">\
                <canvas class="line-canvas"></canvas>\
                <canvas class="turtle-canvas"></canvas>\
              </div>',
    link: linkFunc,
    controller: CanvasController,
    controllerAs: 'vm'
  };

  return directive;

  function linkFunc(scope, element, attrs, controller) {
    let watcher;
    watcher = scope.$watch('cmd', (n) => {
      if (n) {
        controller.draw(n.cmd, n.param)
      }

    }, true);

    scope.$on('$destroy', () => {
      watcher();
    });
  }

}

/**
 * @CanvasController
 * Controller for the CanvasDirective
 */

class CanvasController {
  constructor($scope, $element) {
    'ngInject';

    /**
     * Base and Turtle Canvas
     */
    const canvasLines = $element.find('.line-canvas')[0];
    const canvasTurtle = $element.find('.turtle-canvas')[0];
    const canvasContext = canvasLines.getContext('2d');
    const turtleContext = canvasTurtle.getContext('2d');

    /**
     * Default height and width for canvas
     */
    const w = $element[0].offsetWidth;
    const h = 306;
    let curX = parseInt(w / 2 - 4, 10);
    let curY = parseInt(h / 2 - 4, 10);

    this.canvas = angular.element('canvas');
    this.$scope = $scope;

    /**
     * Default color and turtle size values
     */
    this.$scope.color = 'white';
    this.turtleSize = 24;

    //Rotation Angle
    this.angle = 0;

    this.$scope.draw = this.draw;

    /**
     * Init method to set up the base canvas and turtle canvas positions.
     */
    this.init = () => {
      this.canvas.attr('width', w)
      this.canvas.attr('height', h)
      if (canvasLines.getContext && canvasTurtle.getContext) {
        this.setCanvas();
        this.setTurtle(turtleContext, curX, curY);
      }
    }

    /**
     * Set the canvas background, width, height
     */
    this.setCanvas = () => {
      canvasContext.fillStyle = "#666666";
      canvasContext.fillRect(0, 0, canvasLines.width, canvasLines.height);

      turtleContext.fillStyle = "#666666";
      turtleContext.fillRect(0, 0, canvasTurtle.width, canvasTurtle.height);
    }

    /**
     * Draw method to render the lines and direction on the canvas based on the command and parameter
     * @param cmd
     * @param val
     */
    this.draw = (cmd, val) => {
      const instruction = cmd;
      const num = val;
      let p;

      if (canvasLines.getContext && canvasTurtle.getContext) {
        switch(instruction) {
          //forward command to draw line
          case 'forward':
            p = this.drawLine(canvasContext, curX, curY, num);
            if (p) {
              curX = p.x;
              curY = p.y;
              turtleContext.clearRect(0, 0, this.canvas.attr('width'), h);
              this.setTurtle(turtleContext, curX, curY);
            }
            break;

          //right command to rotate the turtle direction clockwise
          case 'right':
            this.rotate(turtleContext, curX, curY, num);
            this.setTurtle(turtleContext, curX, curY);
            break;

          //left command to rotate the turtle direction anticlockwise
          case 'left':
            this.rotate(turtleContext, curX, curY, -num);
            this.setTurtle(turtleContext, curX, curY);
            break;

          //reset command to reset the canvas to default values
          case 'reset':
            canvasContext.clearRect(0, 0, this.canvas.attr('width'), h);
            this.setCanvas();
            this.setTurtle(turtleContext, parseInt($element[0].offsetWidth / 2 - 4, 10), 149);
            this.$scope.color = 'white';
            this.turtleSize = 24;
            this.angle = 0;
            curX = parseInt(w / 2 - 4, 10);
            curY = parseInt(h / 2 - 4, 10);
            break;

          // color command to change line colors
          case 'color':
            this.$scope.color = num;
        }
      }
    }

    //Call init method to initialize canvas
    this.init();
  }

  /**
   * Set the turtle position in the canvas.
   * @param turtleContext
   * @param curX
   * @param curY
   */
  setTurtle(turtleContext, curX, curY) {
    turtleContext.clearRect(0, 0, this.canvas.attr('width'), this.canvas.attr('height'));
    turtleContext.beginPath();
    let img = new Image();
    img.onload = () => {
      turtleContext.save();
      turtleContext.rect(curX - this.turtleSize / 2, curY - this.turtleSize / 2, this.turtleSize, this.turtleSize);
      turtleContext.clip();
      turtleContext.drawImage(img, curX - this.turtleSize / 2, curY - this.turtleSize / 2);
      turtleContext.restore();
    };
    img.src = 'https://png.icons8.com/turtle/office/16'
  }

  /**
   * Rotate the turtle in clockwise/anticlockwise direction based on rotateAngle
   * @param turtleContext
   * @param curX
   * @param curY
   * @param rotateAngle
   */
  rotate(turtleContext, curX, curY, rotateAngle) {
    turtleContext.clearRect(0, 0, this.canvas.attr('width'), this.canvas.attr('height'));
    turtleContext.save();
    turtleContext.translate(curX, curY);
    let new_angle = this.angle + parseInt(rotateAngle)
    let rad_angle = new_angle * (Math.PI / 180);
    turtleContext.rotate(rad_angle);
    turtleContext.fillRect(-this.turtleSize / 2, -this.turtleSize / 2, this.turtleSize, this.turtleSize);
    turtleContext.restore();
    this.angle = new_angle;
  }

  /**
   * Draw line based on the direction (x, y) values
   * @param canvasContext
   * @param curX
   * @param curY
   * @param length
   * @returns {Point}
   */
  drawLine(canvasContext, curX, curY, length) {
    //if((curX < 0 || curY < 0) || (curX > canvas.width || curY > canvas.height)) return;
    if (this.angle != 0) {
      let rad_angle = this.angle * (Math.PI / 180);
      canvasContext.beginPath();
      canvasContext.moveTo(curX, curY);
      var x = Math.round(curX + length * Math.sin(rad_angle));
      var y = Math.round(curY - length * Math.cos(rad_angle));
    } else {
      canvasContext.beginPath();
      canvasContext.moveTo(curX, curY);
      x = curX;
      y = curY - length;
    }

    //if((x < 0 || y < 0) || (x + 20 >= canvas.width || y + 20 >= canvas.height)) return;

    canvasContext.lineTo(x, y);
    canvasContext.strokeStyle = this.$scope.color;
    canvasContext.stroke();


    return new Point(x, y);
  }
}

/**
 * @Point
 * Point Class
 */
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

}

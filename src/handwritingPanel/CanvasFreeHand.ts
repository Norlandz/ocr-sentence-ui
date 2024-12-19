enum DrawMode {
  none = 'none',
  freehandDraw = 'freehandDraw',
  lineDraw = 'lineDraw',
  rectangleDraw = 'rectangleDraw',
  clearRect = 'clearRect',
}
/**
 * Not very reactive ....
 */
export class CanvasFreeHand {
  //todo destroy

  // private constructor() {}

  private _drawMode: DrawMode = DrawMode.freehandDraw;
  private drag = false;
  // public get _drawMode() {
  //   return this._drawMode
  // }

  public init() {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    // document.body.appendChild(canvas)

    // // Get screen dimensions for canvas size
    // const bodyRect = document.body.getBoundingClientRect()
    // const canvasWidth = bodyRect.width > 1920 ? bodyRect.width : 1920
    // const canvasHeight = bodyRect.height > 1080 ? bodyRect.height : 1080
    const canvasWidth = 1024;
    const canvasHeight = 128;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.oncontextmenu = () => false;

    // canvas.style.position = 'absolute';
    // canvas.style.top = '0';
    // canvas.style.zIndex = '110';

    // Get the 2d rendering context for canvas
    const context = canvas.getContext('2d', { willReadFrequently: true }) ?? (() => { throw new Error(); })(); // prettier-ignore
    // context.lineWidth = 2;
    context.lineWidth = 8;
    // context.strokeStyle = 'rgba(0,0,255,0.5)';

    this.init_FreehandDraw(canvas);

    return canvas;
  }

  // Sets up freehand drawing event listeners on the canvas
  private init_FreehandDraw(canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d') ?? (() => { throw new Error(); })(); // prettier-ignore
    let startX: number;
    let startY: number;
    let originalLineWidth: number;
    let originalStrokeStyle: string | CanvasGradient | CanvasPattern;

    const _this = this;

    let imageData_prev: ImageData = context.getImageData(0, 0, canvas.width, canvas.height);
    canvas.addEventListener('mousedown', function (event) {
      if (!event.ctrlKey && !event.altKey && !event.shiftKey && event.button === 0) {
        // Freehand drawing mode
        _this._drawMode = DrawMode.freehandDraw;
        context.beginPath();
        context.moveTo(event.offsetX, event.offsetY);
        context.stroke();
        _this.drag = true;
      } else if (!event.ctrlKey && !event.altKey && event.shiftKey && event.button === 0) {
        // Line draw mode
        _this._drawMode = DrawMode.lineDraw;
        imageData_prev = context.getImageData(0, 0, canvas.width, canvas.height);
        startX = event.offsetX;
        startY = event.offsetY;
        _this.drag = true;
      } else if (!event.ctrlKey && !event.altKey && !event.shiftKey && event.button === 2) {
        // event.preventDefault();
        //Clear rect
        imageData_prev = context.getImageData(0, 0, canvas.width, canvas.height);
        _this._drawMode = DrawMode.clearRect;
        startX = event.offsetX;
        startY = event.offsetY;
        originalLineWidth = context.lineWidth;
        originalStrokeStyle = context.strokeStyle;
        context.lineWidth = 1;
        context.strokeStyle = 'rgba(128,64,64,0.5)';
        _this.drag = true;
      } else if (event.ctrlKey && !event.altKey && !event.shiftKey && event.button === 0) {
        //Rectangle draw mode
        imageData_prev = context.getImageData(0, 0, canvas.width, canvas.height);
        _this._drawMode = DrawMode.rectangleDraw;
        startX = event.offsetX;
        startY = event.offsetY;
        _this.drag = true;
      } else {
        // @do_nothing
      }
    });

    canvas.addEventListener('mousemove', function (event) {
      if (_this._drawMode === DrawMode.freehandDraw && _this.drag === true && !(event.ctrlKey && event.altKey && event.shiftKey)) {
        // Continue freehand drawing
        context.lineTo(event.offsetX, event.offsetY);
        context.stroke();
        context.closePath();
        context.beginPath();
        context.moveTo(event.offsetX, event.offsetY);
      } else if (_this._drawMode === DrawMode.lineDraw && _this.drag === true && !(event.ctrlKey && event.altKey && event.shiftKey)) {
        context.putImageData(imageData_prev, 0, 0);
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(event.offsetX, event.offsetY);
        context.stroke();
        context.closePath();
      } else if (
        (_this._drawMode === DrawMode.rectangleDraw && _this.drag === true && !(event.ctrlKey && event.altKey && event.shiftKey)) ||
        (_this._drawMode === DrawMode.clearRect && _this.drag === true && !(event.ctrlKey && event.altKey && event.shiftKey))
      ) {
        // Draw Rect
        context.putImageData(imageData_prev, 0, 0);
        context.beginPath();
        context.rect(startX, startY, event.offsetX - startX, event.offsetY - startY);
        context.stroke();
        context.closePath();
      }
    });

    window.addEventListener('mouseup', function (event) {
      if (_this._drawMode === DrawMode.freehandDraw && _this.drag === true && event.button === 0) {
        _this.drag = false;
        context.lineTo(event.offsetX, event.offsetY);
        context.stroke();
        context.closePath();
        _this._drawMode = DrawMode.none;
      } else if (_this._drawMode === DrawMode.lineDraw && _this.drag === true && event.button === 0) {
        _this._drawMode = DrawMode.none;
      } else if ((_this._drawMode === DrawMode.rectangleDraw && _this.drag === true && event.button === 0) || (_this._drawMode === DrawMode.clearRect && _this.drag === true && event.button === 2)) {
        // event.preventDefault();
        _this.drag = false;
        let width = event.offsetX - startX;
        let height = event.offsetY - startY;
        if (width < 0) {
          startX = event.offsetX;
          width = -width;
        }
        if (height < 0) {
          startY = event.offsetY;
          height = -height;
        }

        if (_this._drawMode === DrawMode.rectangleDraw) {
          _this._drawMode = DrawMode.none;
        } else if (_this._drawMode === DrawMode.clearRect) {
          context.clearRect(startX - 1, startY - 1, width + 2, height + 2);
          context.lineWidth = originalLineWidth;
          context.strokeStyle = originalStrokeStyle;
          _this._drawMode = DrawMode.none;
        }
      }
    });
  }

  //   static hotkey_ColorChange(canvas: HTMLCanvasElement) {
  //     const context = canvas.getContext('2d') ?? (() => { throw new Error(); })(); // prettier-ignore
  //     let isEnabled = true
  //
  //     window.addEventListener('keydown', function (event) {
  //       if (!event.ctrlKey && event.altKey && event.shiftKey) {
  //         if (event.ctrlKey && event.altKey && event.shiftKey && event.key !== '`') {
  //         } else {
  //           isEnabled = !isEnabled
  //           $(canvas).css({ pointerEvents: isEnabled ? 'initial' : 'none' })
  //         }
  //       } else {
  //         switch (event.key) {
  //           case '0':
  //             context.strokeStyle = 'rgba(0,0,255,0.5)'
  //             break
  //           case '1':
  //             context.strokeStyle = 'rgba(128,0,0,0.5)'
  //             break
  //           case '2':
  //             context.strokeStyle = 'rgba(0,128,0,0.5)'
  //             break
  //           case '3':
  //             context.strokeStyle = 'rgba(0,0,128,0.5)'
  //             break
  //           case '4':
  //             context.strokeStyle = 'rgba(128,128,0,0.5)'
  //             break
  //           case '5':
  //             context.strokeStyle = 'rgba(255,165,0,0.5)'
  //             break
  //           case '6':
  //             context.strokeStyle = 'rgba(128,0,128,0.5)'
  //             break
  //           case '7':
  //             context.strokeStyle = 'rgba(0,128,128,0.5)'
  //             break
  //           case '8':
  //             context.strokeStyle = 'rgba(128,128,128,0.5)'
  //             break
  //         }
  //       }
  //     })
  //   }
}

// let canvasElement //stores canvas element
// // Event listener for chrome extension messaging
// chrome.runtime.onMessage.addListener(function (message) {
//   const activateExtension = message.exec_activate_Ext
//   if (activateExtension !== undefined) {
//     if (typeof activateExtension !== 'boolean') {
//       throw new TypeError(typeof activateExtension)
//     }
//
//     if (activateExtension) {
//       if (isExtensionEnabled) {
//         isExtensionEnabled = false
//         canvasElement = CanvasHelper.init()
//         CanvasHelper.init_FreehandDraw(canvasElement)
//         CanvasHelper.hotkey_ColorChange(canvasElement)
//       } else {
//         $(canvasElement).css({ display: 'initial' })
//       }
//     } else {
//       $(canvasElement).css({ display: 'none' })
//     }
//   }
// })
//
// let isExtensionEnabled = true //Flag to track if the extension is enabled or not.

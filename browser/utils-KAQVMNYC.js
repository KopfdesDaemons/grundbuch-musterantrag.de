import {
  __commonJS
} from "./chunk-S6JHBFO7.js";

// node_modules/pizzip/utils/es6/index.js
var require_es6 = __commonJS({
  "node_modules/pizzip/utils/es6/index.js"(exports, module) {
    "use strict";
    var PizZipUtils = {};
    PizZipUtils._getBinaryFromXHR = function(xhr) {
      return xhr.response || xhr.responseText;
    };
    function createStandardXHR() {
      try {
        return new window.XMLHttpRequest();
      } catch (e) {
      }
    }
    function createActiveXHR() {
      try {
        return new window.ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {
      }
    }
    var createXHR = window.ActiveXObject ? (
      /* Microsoft failed to properly
      * implement the XMLHttpRequest in IE7 (can't request local files),
      * so we use the ActiveXObject when it is available
      * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
      * we need a fallback.
      */
      function() {
        return createStandardXHR() || createActiveXHR();
      }
    ) : (
      // For all other browsers, use the standard XMLHttpRequest object
      createStandardXHR
    );
    PizZipUtils.getBinaryContent = function(path, callback) {
      try {
        const xhr = createXHR();
        xhr.open("GET", path, true);
        if ("responseType" in xhr) {
          xhr.responseType = "arraybuffer";
        }
        if (xhr.overrideMimeType) {
          xhr.overrideMimeType("text/plain; charset=x-user-defined");
        }
        xhr.onreadystatechange = function(evt) {
          let file, err;
          if (xhr.readyState === 4) {
            if (xhr.status === 200 || xhr.status === 0) {
              file = null;
              err = null;
              try {
                file = PizZipUtils._getBinaryFromXHR(xhr);
              } catch (e) {
                err = new Error(e);
              }
              callback(err, file);
            } else {
              callback(
                new Error(
                  "Ajax error for " + path + " : " + this.status + " " + this.statusText
                ),
                null
              );
            }
          }
        };
        xhr.send();
      } catch (e) {
        callback(new Error(e), null);
      }
    };
    module.exports = PizZipUtils;
  }
});

// node_modules/pizzip/utils/index.js
var require_utils = __commonJS({
  "node_modules/pizzip/utils/index.js"(exports, module) {
    module.exports = require_es6();
  }
});
export default require_utils();
//# sourceMappingURL=utils-KAQVMNYC.js.map

// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      function localRequire(x) {
        return newRequire(localRequire.resolve(x));
      }

      localRequire.resolve = function (x) {
        return modules[name][1][x] || x;
      };

      var module = cache[name] = new newRequire.Module;
      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;
  }

  function Module() {
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({3:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// ip 定位目前采用的是腾讯的定位服务api,请在key后面更换自己的key
const SERVER_URL = '//apis.map.qq.com/ws/location/v1/ip?key=WTWBZ-ODOCK-MLJJ4-A2OUS-BVSJJ-LXBNS';
const hereIp = (successFnc, failFnc) => {
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", SERVER_URL, true);
  xmlhttp.send();
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      let res = JSON.parse(xmlhttp.responseText);
      if (res.status === 0) {
        successFnc(Object.assign({}, res.result.location));
      } else {
        failFnc('fail-api-res');
      }
    } else {
      failFnc('fail-api-res');
    }
  };
};

exports.default = hereIp;
},{}],2:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ip = require("../ip");

var _ip2 = _interopRequireDefault(_ip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const hereH5 = (config, successFnc, failFnc) => {
  if ('geolocation' in navigator) {
    let geo_options = {};
    if (config.highSwitch) {
      geo_options.enableHighAccuracy = config.highSwitch;
    }
    if (config.timeout) {
      geo_options.timeout = config.timeout;
    }
    if (config.max) {
      geo_options.maximumAge = config.max;
    }
    if (config.watch) {
      const geolocationId = navigator.geolocation.watchPosition(res => {
        let result = {
          lng: res.coords.longitude,
          lat: res.coords.latitude
        };
        successFnc(result);
      }, err => {
        console.error(err);
        failFnc("h5-fail");
        // do again 
        (0, _ip2.default)(successFnc, failFnc);
      }, geo_options);
      window['GEO-LOCATION-ID'] = geolocationId;
    } else {
      navigator.geolocation.getCurrentPosition(res => {
        let result = {
          lng: res.coords.longitude,
          lat: res.coords.latitude
        };
        successFnc(result);
      }, err => {
        console.error(err);
        failFnc("h5-fail");
        // do again 
        (0, _ip2.default)(successFnc, failFnc);
      }, geo_options);
    }
  } else {
    return null;
  }
};
exports.default = hereH5;
},{"../ip":3}],1:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _h = require("./h5");

var _h2 = _interopRequireDefault(_h);

var _ip = require("./ip");

var _ip2 = _interopRequireDefault(_ip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const here = function () {
  let successFnc = null,
      failFnc = null,
      config = {};
  if (typeof arguments[0] === 'function') {
    successFnc = arguments[0];
    if (typeof arguments[1] === 'function') {
      failFnc = arguments[1];
    }
  } else {
    config = arguments[0];
    if (typeof arguments[1] === 'function') {
      successFnc = arguments[1];
      if (typeof arguments[2] === 'function') {
        failFnc = arguments[2];
      }
    }
  }
  (0, _h2.default)(config, successFnc, failFnc);
  return {
    clear: () => {
      console.log(window['GEO-LOCATION-ID']);
      navigator.geolocation.clearWatch(window['GEO-LOCATION-ID']);
    }
  };
};

window.here = here;
exports.default = here;
},{"./h5":2,"./ip":3}],0:[function(require,module,exports) {
var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module() {
  OldModule.call(this);
  this.hot = {
    accept: function (fn) {
      this._acceptCallback = fn || function () {};
    },
    dispose: function (fn) {
      this._disposeCallback = fn;
    }
  };
}

module.bundle.Module = Module;

if (!module.bundle.parent) {
  var ws = new WebSocket('ws://localhost:52279/');
  ws.onmessage = function(event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.require, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.require, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      window.location.reload();
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
    }

    if (data.type === 'error') {
      console.error(`[parcel] 🚨 ${data.error.message}\n${data.error.stack}`);
    }
  };
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || (Array.isArray(dep) && dep[dep.length - 1] === id)) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  if (cached && cached.hot._disposeCallback) {
    cached.hot._disposeCallback();
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallback) {
    cached.hot._acceptCallback();
    return true;
  }

  return getParents(global.require, id).some(function (id) {
    return hmrAccept(global.require, id)
  });
}
},{}]},{},[0,1])
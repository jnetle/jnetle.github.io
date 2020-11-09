// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
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

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"src/css/style.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"src/components/Game.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Game = void 0;

function Game(gamePk, headline, blurb, imageCut, isActive) {
  var styles = {
    width: imageCut.width,
    height: imageCut.height,
    background: "url(" + imageCut.src + ")",
    backgroundSize: "cover"
  };
  var activeClassName = isActive ? "active-focus" : "";
  return "<div id=\"gamePk-" + gamePk + "\" class=\"game " + activeClassName + "\">\n            " + renderHeadline() + "\n            " + renderButton() + "\n            " + renderBlurb() + "\n          </div>";

  function renderButton() {
    return "<div class=\"game-thumbnail\"  style=\"background-image:url(" + imageCut.src + ")\"></div>";
  }

  function renderHeadline() {
    return "<div class=\"game-headline\">" + headline + "</div>";
  }

  function renderBlurb() {
    return "<div class=\"game-blurb\">" + blurb + "</div>";
  }
}

exports.Game = Game;
},{}],"src/services/getGames.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGames = void 0;

function getGames(date) {
  return __awaiter(this, void 0, void 0, function () {
    var response, jsonResponse, exception_1;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 3,, 4]);

          return [4
          /*yield*/
          , fetch("https://statsapi.mlb.com/api/v1/schedule?hydrate=game(content(editorial(recap))),decisions&date=" + date + "&sportId=1")];

        case 1:
          response = _a.sent();
          return [4
          /*yield*/
          , response.json()];

        case 2:
          jsonResponse = _a.sent();
          return [2
          /*return*/
          , jsonResponse];

        case 3:
          exception_1 = _a.sent();
          console.log("ERROR - getGames()", exception_1);
          return [3
          /*break*/
          , 4];

        case 4:
          return [2
          /*return*/
          ];
      }
    });
  });
}

exports.getGames = getGames;
},{}],"src/utilities/findImageCutBySize.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findImageCutBySize = void 0;

function findImageCutBySize(images, height, width) {
  return images.find(function (i) {
    return i.height === height && i.width === width;
  });
}

exports.findImageCutBySize = findImageCutBySize;
},{}],"src/index.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("./css/style.css");

var Game_1 = require("./components/Game");

var getGames_1 = require("./services/getGames");

var findImageCutBySize_1 = require("./utilities/findImageCutBySize");

var games = [];
var currentGamePk;
var date = "2020-09-10";
document.addEventListener("DOMContentLoaded", function () {
  return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;

    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          return [4
          /*yield*/
          , loadPage()];

        case 1:
          _c.sent();

          renderActiveGame();
          (_a = document.getElementById("next")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function (evt) {
            return __awaiter(void 0, void 0, void 0, function () {
              var newDate;
              return __generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    newDate = new Date(date);
                    newDate.setDate(newDate.getDate() + 1);
                    date = newDate.toISOString().split("T")[0];
                    return [4
                    /*yield*/
                    , loadPage()];

                  case 1:
                    _a.sent();

                    renderActiveGame();
                    return [2
                    /*return*/
                    ];
                }
              });
            });
          });
          (_b = document.getElementById("prev")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", function (evt) {
            return __awaiter(void 0, void 0, void 0, function () {
              var newDate;
              return __generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    newDate = new Date(date);
                    newDate.setDate(newDate.getDate() - 1);
                    date = newDate.toISOString().split("T")[0];
                    return [4
                    /*yield*/
                    , loadPage()];

                  case 1:
                    _a.sent();

                    renderActiveGame();
                    return [2
                    /*return*/
                    ];
                }
              });
            });
          });
          return [2
          /*return*/
          ];
      }
    });
  });
});
window.addEventListener("keydown", function (evt) {
  var currentIndex = games.findIndex(function (g) {
    return currentGamePk === g.gamePk;
  });
  var nextIndex = currentIndex;

  switch (evt.key) {
    case "Left":
    case "ArrowLeft":
      if (currentIndex > 0) {
        nextIndex--;
      }

      break;

    case "Right":
    case "ArrowRight":
      if (currentIndex < games.length - 1) {
        nextIndex++;
      }

      break;

    default:
      return;
  }

  currentGamePk = games[nextIndex].gamePk;
  renderActiveGame();
  evt.preventDefault();
});

function loadPage() {
  var _a;

  return __awaiter(this, void 0, void 0, function () {
    var filmstripContainer, response, firstDate, header, uiGames;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          currentGamePk = 0;
          filmstripContainer = document.getElementsByClassName("filmstrip-container")[0];
          filmstripContainer.classList.add("pre-animation");
          return [4
          /*yield*/
          , getGames_1.getGames(date)];

        case 1:
          response = _b.sent();

          if (!response) {
            filmstripContainer.innerHTML = "Error with page";
            return [2
            /*return*/
            ];
          }

          firstDate = response.dates[0];
          games = (_a = firstDate === null || firstDate === void 0 ? void 0 : firstDate.games) === null || _a === void 0 ? void 0 : _a.filter(function (g, i) {
            return g.gamePk && g.content.editorial;
          });
          header = document.getElementById("h1-date");

          if (header) {
            header.innerHTML = "Game Day - " + new Date(date).toLocaleDateString();
          }

          if (!games) {
            filmstripContainer.innerHTML = "No games available";
            return [2
            /*return*/
            ];
          }

          uiGames = games.map(function (g, i) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;

            if (!currentGamePk) {
              var isFirstGame = i === 0;

              if (isFirstGame) {
                currentGamePk = g.gamePk;
              }
            }

            var imageCuts = (_e = (_d = (_c = (_b = (_a = g.content.editorial) === null || _a === void 0 ? void 0 : _a.recap) === null || _b === void 0 ? void 0 : _b.mlb) === null || _c === void 0 ? void 0 : _c.image) === null || _d === void 0 ? void 0 : _d.cuts) !== null && _e !== void 0 ? _e : [];
            var imageCut = findImageCutBySize_1.findImageCutBySize(imageCuts, 270, 480);
            var headline = (_g = (_f = g.content.editorial) === null || _f === void 0 ? void 0 : _f.recap.mlb.seoTitle) !== null && _g !== void 0 ? _g : "";
            var blurb = (_j = (_h = g.content.editorial) === null || _h === void 0 ? void 0 : _h.recap.mlb.blurb) !== null && _j !== void 0 ? _j : "";

            if (imageCut) {
              var isActive = g.gamePk === currentGamePk;
              var game = Game_1.Game(g.gamePk, headline, blurb, imageCut, isActive);
              return game;
            }

            return null;
          });
          filmstripContainer.innerHTML = "<div class=\"filmstrip\">" + uiGames.join("") + "</div>";
          filmstripContainer.classList.remove("pre-animation");
          document.querySelectorAll(".game-thumbnail").forEach(function (e) {
            e.addEventListener("click", function (evt) {
              var gameId = evt.target.parentElement.getAttribute("id");
              currentGamePk = parseInt(gameId.replace("gamePk-", ""));
              renderActiveGame();
            });
          });
          return [2
          /*return*/
          ];
      }
    });
  });
}

function renderActiveGame() {
  document.querySelectorAll(".game").forEach(function (g) {
    if (g.id === "gamePk-" + currentGamePk) {
      g.classList.add("active-focus");
      setTimeout(function () {
        g.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest"
        });
      }, 500);
    } else {
      g.classList.remove("active-focus");
    }
  });
}
},{"./css/style.css":"src/css/style.css","./components/Game":"src/components/Game.ts","./services/getGames":"src/services/getGames.ts","./utilities/findImageCutBySize":"src/utilities/findImageCutBySize.ts"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "57896" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
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

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
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

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.ts"], null)
//# sourceMappingURL=src.f10117fe.js.map
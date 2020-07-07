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
})({"src/Board.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeadZone = exports.Board = exports.Cell = void 0;

var Cell =
/** @class */
function () {
  function Cell(position, piece) {
    this.position = position;
    this.piece = piece;
    this.isActive = false; //선택된 셀에 관하여 속성이 있어야한다. 

    this._el = document.createElement('DIV'); //셀이 실제로 엘레멘트로서 그려져야 하므로 만들고, 내부에서만 쓸 수 있게 하고, 외부에서  오버라이딩 할 수 없게.

    this._el.classList.add('cell');
  }

  Cell.prototype.put = function (piece) {
    this.piece = piece; // Q : 이것은 말을  밀어넣는 행위 근데 this.piece는 왜 여기서 선언햇을까..  A : 아 컨스트럭터에서 접근제한자와 형 선언을 해버리면 할당이 자동으로 된다는것. 그러면  put은 이미 생성된 this.piece가 있기 때문에 그렇구나. 
  };

  Cell.prototype.getPiece = function () {
    return this.piece;
  };

  Cell.prototype.active = function () {
    this.isActive = true;
  };

  Cell.prototype.deactive = function () {
    this.isActive = false;
  };

  Cell.prototype.render = function () {
    if (this.isActive) {
      //상태에 따라 클래스 붙여주고.
      this._el.classList.add('active');
    } else {
      this._el.classList.remove('active');
    } // 말이 있으면 그려주자. 


    this._el.innerHTML = this.piece ? this.piece.render() : '';
  };

  return Cell;
}();

exports.Cell = Cell;

var Board =
/** @class */
function () {
  /*ES6의 위크맵을 이용 왜 보드에 들고있냐면, 우리가 필요한것은 셀 정보가 아니라  piece의 엘리먼트라서?! 맵의 장점 => 키를 객체로 줄수있잖아여 키는 htmlel이됨
  제네릭으로 만드는 이유는?
  위크맵이기 때문에 htmlel이 사라지면 cell도 빠이빠이
  */
  function Board(upperPlayer, lowerPlayer) {
    this.cells = []; //기본적으로 빈 배열을 갖고, cells란 아이는 Cell이라는 클래스로 이루어진 배열일 것이다.

    this._el = document.createElement('DIV');
    this.map = new WeakMap();
    this._el.className = 'board'; // Q: 여기는 왜 클래스 네임으로 쓴걸까? 애드안하고? 그냥 단순 방식을 여러개 보여주려는거였나.

    var _loop_1 = function _loop_1(row) {
      //단순 DOM row 그리기
      var rowEl = document.createElement('DIV');
      rowEl.className = 'row'; // Q : 여기도 왜 classList.add가 아니지. 여기도 마찬가지?

      this_1._el.appendChild(rowEl);

      var _loop_2 = function _loop_2(col) {
        //지금 cell의 좌표와 일치하는 정보를 가진 piece를 찾아서 넣어줌 
        var piece = upperPlayer.getPieces().find(function (_a) {
          var currentPosition = _a.currentPosition;
          return currentPosition.col === col && currentPosition.row === row;
        }) || lowerPlayer.getPieces().find(function (_a) {
          var currentPosition = _a.currentPosition;
          return currentPosition.col === col && currentPosition.row === row;
        });
        var cell = new Cell({
          row: row,
          col: col
        }, piece); //cell로 인스턴스를 생성한다. row와 col을 담아줌으로서 좌표정보를 전달하고, 새 cell이므로 일단 null을 넣는다(piece 없음) => 이후 piece 넣는다.

        this_1.map.set(cell._el, cell); //만들어 둔 위크맵에 셋팅을 해준다. 

        this_1.cells.push(cell); //셀들의 집합에 정보를 넣고.

        rowEl.appendChild(cell._el); //row의 DOM안에 끼워넣는다. 그런데 cell._el을 넣는거니까. cell._el은 밖에서 접근이 가능한가보지?! 
      }; //데이터를 가지고 있는 cell을 DOM으로 그리기


      for (var col = 0; col < 3; col++) {
        _loop_2(col);
      }
    };

    var this_1 = this;

    for (var row = 0; row < 4; row++) {
      _loop_1(row);
    }
  }

  Board.prototype.render = function () {
    this.cells.forEach(function (v) {
      return v.render();
    }); //cell들의 render를 호출해본다. 그래야 그리니까. 
  };

  return Board;
}();

exports.Board = Board;

var DeadZone =
/** @class */
function () {
  function DeadZone(type) {
    this.type = type;
    this.cells = [];
    this.deadzoneEl = document.getElementById(this.type + "_deadzone").querySelector('.card-body');

    for (var col = 0; col < 4; col++) {
      var cell = new Cell({
        col: col,
        row: 0
      }, null); //여기서의 cell은 데드존의 1칸을 의미한다. piece가 들어있지 않기 때문에  null을 주며, 로우는 1개뿐이라 0을 넣어준다. 

      this.cells.push(cell);
      this.deadzoneEl.appendChild(cell._el);
    }
  }

  DeadZone.prototype.put = function (piece) {
    var emptyCell = this.cells.find(function (v) {
      return v.getPiece() === null;
    }); //cells집합에서 getPiece했을 때 null것을 찾아(제일 앞의꺼)

    emptyCell.put(piece); //거기에 죽은 말을 넣어주고,  

    emptyCell.render(); //그리고 셀에 피스를 그려준다. 
  };

  DeadZone.prototype.render = function () {
    this.cells.forEach(function (v) {
      return v.render();
    }); //그리고 셀을 렌더링한다. 
  };

  return DeadZone;
}();

exports.DeadZone = DeadZone;
},{}],"src/images/lion.png":[function(require,module,exports) {
module.exports = "/lion.0a55027b.png";
},{}],"src/images/chicken.png":[function(require,module,exports) {
module.exports = "/chicken.3d0d4a2d.png";
},{}],"src/images/griff.png":[function(require,module,exports) {
module.exports = "/griff.78de84a7.png";
},{}],"src/images/elophant.png":[function(require,module,exports) {
module.exports = "/elophant.66e48f21.png";
},{}],"src/Piece.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Chick = exports.Griff = exports.Elephant = exports.Lion = exports.MoveResult = void 0;

var Player_1 = require("./Player"); //parcel이 처리해줌 하지만 모듈로 인식을 하려면 타입데피니션 필요 - 최상위에 global.d.ts 에 설정


var lion_png_1 = __importDefault(require("./images/lion.png"));

var chicken_png_1 = __importDefault(require("./images/chicken.png"));

var griff_png_1 = __importDefault(require("./images/griff.png"));

var elophant_png_1 = __importDefault(require("./images/elophant.png"));

var MoveResult =
/** @class */
function () {
  function MoveResult(killedPiece) {
    this.killedPiece = killedPiece;
  }

  MoveResult.prototype.getKilled = function () {
    return this.killedPiece;
  };

  return MoveResult;
}();

exports.MoveResult = MoveResult;

var DefaultPiece =
/** @class */
function () {
  /*추상 클래스(abstract class)는 하나 이상의 추상 메소드를 포함하며 일반 메소드도 포함할 수 있다.
  추상 메소드는 내용이 없이 메소드 이름과 타입만이 선언된 메소드를 말하며 선언할 때 abstract 키워드를 사용한다.
  추상 클래스를 정의할 때는 abstract 키워드를 사용하며, 직접 인스턴스를 생성할 수 없고 상속만을 위해 사용된다.
  추상 클래스를 상속한 클래스는 추상 클래스의 추상 메소드를 반드시 구현하여야 한다.
  인터페이스는 모든 메소드가 추상 메소드이지만 추상 클래스는 하나 이상의 추상 메소드와 일반 메소드를 포함할 수 있다.
  */
  function DefaultPiece(ownerType, currentPosition) {
    this.ownerType = ownerType;
    this.currentPosition = currentPosition;
  }

  DefaultPiece.prototype.move = function (from, to) {
    if (!this.canMove(to.position)) {
      //이동가능 한 셀인지 확인 후에 일단... !
      throw new Error('can not move!');
    }

    var moveResult = new MoveResult(to.getPiece() != null ? to.getPiece() : null); //일단 moveResult를 생성해서 가려는 cell의 자리에 피스가 있는지 확인하고, 있으면 먹어야하니까 던져준다.

    to.put(this); //가려는 셀의 자리에 말을 넣어주고.

    from.put(null); //원래 있던 셀의 자리에 말을 비워준다.

    this.currentPosition = to.position; //현재 피스의 위치를 가려는 셀의 포지션으로 수정해주고.

    return moveResult; //결과를리턴해준다.
  };

  return DefaultPiece;
}(); //이제 말들 클래스의 상속을 통한 정의를 시작한다. - 추상클래스의 구현을 시전한다.


var Lion =
/** @class */
function (_super) {
  __extends(Lion, _super);

  function Lion() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Lion.prototype.canMove = function (pos) {
    var canMove = pos.row === this.currentPosition.row + 1 && pos.col === this.currentPosition.col || pos.row === this.currentPosition.row - 1 && pos.col === this.currentPosition.col || pos.col === this.currentPosition.col + 1 && pos.row === this.currentPosition.row || pos.col === this.currentPosition.col - 1 && pos.row === this.currentPosition.row || pos.row === this.currentPosition.row + 1 && pos.col === this.currentPosition.col + 1 || pos.row === this.currentPosition.row + 1 && pos.col === this.currentPosition.col - 1 || pos.row === this.currentPosition.row - 1 && pos.col === this.currentPosition.col + 1 || pos.row === this.currentPosition.row - 1 && pos.col === this.currentPosition.col - 1;
    return canMove;
  };

  Lion.prototype.render = function () {
    return "<img class=\"piece " + this.ownerType + "\" src=\"" + lion_png_1.default + "\" width=\"90%\" height=\"90%\"/>";
  };

  return Lion;
}(DefaultPiece);

exports.Lion = Lion;

var Elephant =
/** @class */
function (_super) {
  __extends(Elephant, _super);

  function Elephant() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Elephant.prototype.canMove = function (pos) {
    return pos.row === this.currentPosition.row + 1 && pos.col === this.currentPosition.col + 1 || pos.row === this.currentPosition.row + 1 && pos.col === this.currentPosition.col - 1 || pos.row === this.currentPosition.row - 1 && pos.col === this.currentPosition.col + 1 || pos.row === this.currentPosition.row - 1 && pos.col === this.currentPosition.col - 1;
  };

  Elephant.prototype.render = function () {
    return "<img class=\"piece " + this.ownerType + "\" src=\"" + elophant_png_1.default + "\" width=\"90%\" height=\"90%\"/>";
  };

  return Elephant;
}(DefaultPiece);

exports.Elephant = Elephant;

var Griff =
/** @class */
function (_super) {
  __extends(Griff, _super);

  function Griff() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Griff.prototype.canMove = function (pos) {
    return pos.row === this.currentPosition.row + 1 && pos.col === this.currentPosition.col || pos.row === this.currentPosition.row - 1 && pos.col === this.currentPosition.col || pos.col === this.currentPosition.col + 1 && pos.row === this.currentPosition.row || pos.col === this.currentPosition.col - 1 && pos.row === this.currentPosition.row;
  };

  Griff.prototype.render = function () {
    return "<img class=\"piece " + this.ownerType + "\" src=\"" + griff_png_1.default + "\" width=\"90%\" height=\"90%\"/>";
  };

  return Griff;
}(DefaultPiece);

exports.Griff = Griff;

var Chick =
/** @class */
function (_super) {
  __extends(Chick, _super);

  function Chick() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Chick.prototype.canMove = function (pos) {
    return this.currentPosition.row + (this.ownerType == Player_1.PlayerType.UPPER ? +1 : -1) === pos.row;
  };

  Chick.prototype.render = function () {
    return "<img class=\"piece " + this.ownerType + "\" src=\"" + chicken_png_1.default + "\" width=\"90%\" height=\"90%\"/>";
  };

  return Chick;
}(DefaultPiece);

exports.Chick = Chick;
},{"./Player":"src/Player.ts","./images/lion.png":"src/images/lion.png","./images/chicken.png":"src/images/chicken.png","./images/griff.png":"src/images/griff.png","./images/elophant.png":"src/images/elophant.png"}],"src/Player.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Player = exports.PlayerType = void 0;

var Piece_1 = require("./Piece");

var PlayerType;

(function (PlayerType) {
  PlayerType["UPPER"] = "UPPER";
  PlayerType["LOWER"] = "LOWER";
})(PlayerType = exports.PlayerType || (exports.PlayerType = {}));

var Player =
/** @class */
function () {
  function Player(type) {
    this.type = type;

    if (type === PlayerType.UPPER) {
      //각 플레이어의 장기말 셋팅
      this.pieces = [new Piece_1.Griff(PlayerType.UPPER, {
        row: 0,
        col: 0
      }), new Piece_1.Lion(PlayerType.UPPER, {
        row: 0,
        col: 1
      }), new Piece_1.Elephant(PlayerType.UPPER, {
        row: 0,
        col: 2
      }), new Piece_1.Chick(PlayerType.UPPER, {
        row: 1,
        col: 1
      })];
    } else {
      this.pieces = [new Piece_1.Elephant(PlayerType.LOWER, {
        row: 3,
        col: 0
      }), new Piece_1.Lion(PlayerType.LOWER, {
        row: 3,
        col: 1
      }), new Piece_1.Griff(PlayerType.LOWER, {
        row: 3,
        col: 2
      }), new Piece_1.Chick(PlayerType.LOWER, {
        row: 2,
        col: 1
      })];
    }
  }

  Player.prototype.getPieces = function () {
    return this.pieces;
  };

  return Player;
}();

exports.Player = Player;
},{"./Piece":"src/Piece.ts"}],"src/Game.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Game = void 0;

var Board_1 = require("./Board");

var Player_1 = require("./Player");

var Piece_1 = require("./Piece");

var Game =
/** @class */
function () {
  function Game() {
    var _this = this; //Typescript는 readonly 키워드를 사용할 수 있다. readonly가 선언된 클래스 프로퍼티는 선언 시 또는 생성자 내부에서만 값을 할당할 수 있다. 그 외의 경우에는 값을 할당할 수 없고 오직 읽기만 가능한 상태가 된다. 이를 이용하여 상수의 선언에 사용한다.


    this.upperDeadZone = new Board_1.DeadZone('upper'); //deadzone을 구성한다. Q : 근데 왜 컨스트럭터에서 구성하지 않았지? 'ㅅ')? 아 리드온리 쓰려고 그런거였지 참

    this.lowerDeadZone = new Board_1.DeadZone('lower');
    this.upperPlayer = new Player_1.Player(Player_1.PlayerType.UPPER); //사용자를 생성한다. Q : 여기선 왜 enum을 사용해서 보냈을까? 

    this.lowerPlayer = new Player_1.Player(Player_1.PlayerType.LOWER);
    this.board = new Board_1.Board(this.upperPlayer, this.lowerPlayer); //선언한 것을 수정할 수 없도록 readonly 키워드 사용 

    this.turn = 0; //현재 턴

    this.currentPlayer = this.upperPlayer; //현재 플레이어 Q: 이 코드 빠져있었다

    this.gameInfoEl = document.querySelector('.alert'); //게임정보    

    this.state = 'STARTED'; //enum으로 처리가능하지만 이렇게도 가능 
    //const board = new Board()

    var boardContainer = document.querySelector('.board-container');
    boardContainer.firstChild.remove();
    boardContainer.appendChild(this.board._el); //board가 들어갈 자리에 el을 넣는다. 

    this.board.render();
    this.renderInfo(); //인포가 바뀔때 마다 렌더되어야하는데? 아 초기에 컨스트럭터 상에서 렌더하고, 턴 바뀔때마다 렌더 해주는구나.
    //event 바인딩

    this.board._el.addEventListener('click', function (e) {
      if (_this.state === 'ENDED') {
        return false;
      }

      if (e.target instanceof HTMLElement) {
        //type guard처리 이벤트 위임을 통해 확인.
        var cellEl = void 0; //우리는 pieceType 자체가 필요해 셀 엘리멘트가 아니라. 

        if (e.target.classList.contains('cell')) {
          cellEl = e.target;
        } else if (e.target.classList.contains('piece')) {
          cellEl = e.target.parentElement;
        } else {
          return false;
        }

        var cell = _this.board.map.get(cellEl); //map객체라 cellEl을 가져올수 있다.


        if (_this.isCurrentUserPiece(cell)) {
          //지금 내 턴의 말이냐를 확인
          _this.select(cell); //그럼 내 말을 선택해줘야함


          return false;
        }

        if (_this.selectedCell) {
          _this.move(cell);

          _this.changeTurn();
        }
      }
    });
  }

  Game.prototype.isCurrentUserPiece = function (cell) {
    return cell !== null && cell.getPiece() !== null && cell.getPiece().ownerType === this.currentPlayer.type;
  };

  Game.prototype.select = function (cell) {
    if (cell.getPiece() === null) {
      //장기 말이 없는 셀이면. 리턴.
      return;
    }

    if (cell.getPiece().ownerType !== this.currentPlayer.type) return; //이제 또 선택하는게 내 말인지 아닌지를 확인해야함 근데 Q: 이미 isCurrentUserPiece 에서 내 말인지 아닌지 확인햇는데 왜 또확인해? 

    if (this.selectedCell) {
      // 현재 선택된 셀이 있으면. 
      this.selectedCell.deactive(); // 선택된걸 선택 못하게 해주고. 

      this.selectedCell.render();
    } //지금 선택된걸 바꿔준다. 


    this.selectedCell = cell; // 현재 선택된 셀을 할당한 후 액티브, 렌더

    cell.active();
    cell.render();
  };

  Game.prototype.move = function (cell) {
    this.selectedCell.deactive();
    var killed = this.selectedCell.getPiece().move(this.selectedCell, cell).getKilled();
    this.selectedCell = cell;

    if (killed) {
      if (killed.ownerType === Player_1.PlayerType.UPPER) {
        this.lowerDeadZone.put(killed);
      } else {
        this.upperDeadZone.put(killed);
      }

      if (killed instanceof Piece_1.Lion) {
        this.state = 'ENDED';
      }
    }
  };

  Game.prototype.renderInfo = function (extraMessage) {
    this.gameInfoEl.innerHTML = this.turn + "\uD134 " + this.currentPlayer.type + " \uCC28\uB840 " + (extraMessage ? '| ' + extraMessage : '');
  };

  Game.prototype.changeTurn = function () {
    this.selectedCell.deactive();
    this.selectedCell = null;

    if (this.state === 'ENDED') {
      //사자 잡히면 끝나는거니까 일단.
      this.renderInfo('END!');
    } else {
      this.turn += 1;
      this.currentPlayer = this.currentPlayer === this.lowerPlayer ? this.upperPlayer : this.lowerPlayer;
      this.renderInfo();
    }

    this.board.render(); //매 턴이 달라질때마다 보드를 그려주는거양
  };

  return Game;
}();

exports.Game = Game;
},{"./Board":"src/Board.ts","./Player":"src/Player.ts","./Piece":"src/Piece.ts"}],"node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
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
},{"./bundle-url":"node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"node_modules/bootstrap/dist/css/bootstrap.css":[function(require,module,exports) {

        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"src/styles/style.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"src/index.ts":[function(require,module,exports) {
"use strict";
/** entry file 작성요령
 *  제일 커다란 객체가 되는 클래스를 하나 만든다. 그리고 인스턴스를 생성한다.
 *  필요한 환경 관련 파일을 임포트한다.
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Game_1 = require("./Game");

require("bootstrap/dist/css/bootstrap");

require("./styles/style");

new Game_1.Game();
},{"./Game":"src/Game.ts","bootstrap/dist/css/bootstrap":"node_modules/bootstrap/dist/css/bootstrap.css","./styles/style":"src/styles/style.css"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "55323" + '/');

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
//# sourceMappingURL=/src.f10117fe.js.map
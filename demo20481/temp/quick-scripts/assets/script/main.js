(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/main.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '7f252HpQsBHib03NO/PkRbb', 'main', __filename);
// script/main.js

'use strict';

var COLOR = require('color');
var Emitter = require('mEmitter');
var arrBlock = [];
cc.Class({
    extends: cc.Component,

    properties: {
        card: {
            default: null,
            type: cc.Prefab
        },
        _arrBlocks: [],

        _canPress: false
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.canPress = false;
        Emitter.instance = new Emitter();
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.handleKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.handleKeyUp, this);
    },
    handleKeyUp: function handleKeyUp(evt) {
        switch (evt.keyCode) {
            case cc.macro.KEY.up:
            case cc.macro.KEY.down:
            case cc.macro.KEY.left:
            case cc.macro.KEY.right:
                this.randomNumber();
                this._canPress = false;
                break;
            default:
                break;
        }
    },
    handleKeyDown: function handleKeyDown(evt) {
        if (this._canPress) return;
        this._canPress = true;
        switch (evt.keyCode) {
            case cc.macro.KEY.up:
                this.moveUp();
                break;
            case cc.macro.KEY.down:
                this.moveDown();
                break;
            case cc.macro.KEY.left:
                this.moveLeft();
                break;
            case cc.macro.KEY.right:
                this.moveRight();
                break;
            default:
                break;
        }
    },
    moveUp: function moveUp() {
        for (var col = 0; col < 4; col++) {
            var flatArrCard = [0, 0, 0, 0];
            for (var row = 0; row < 4; row++) {
                flatArrCard[row] = this._arrBlocks[row][col];
            }
            this.handle(flatArrCard);
        }
    },
    moveDown: function moveDown() {
        for (var col = 0; col < 4; col++) {
            var flatArrCard = [0, 0, 0, 0];
            for (var row = 0; row < 4; row++) {
                flatArrCard[row] = this._arrBlocks[row][col];
            }

            this.handle(flatArrCard.reverse());
        }
    },
    moveLeft: function moveLeft() {
        for (var row = 0; row < 4; row++) {
            var flatArrCard = [0, 0, 0, 0];
            for (var col = 0; col < 4; col++) {
                flatArrCard[col] = this._arrBlocks[row][col];
            }

            this.handle(flatArrCard);
        }
    },
    moveRight: function moveRight() {
        for (var row = 0; row < 4; row++) {
            var flatArrCard = [0, 0, 0, 0];
            for (var col = 0; col < 4; col++) {
                flatArrCard[col] = this._arrBlocks[row][col];
            }

            this.handle(flatArrCard.reverse());
        }
    },
    handle: function handle(arrCard) {
        //[0,2,2,0],[2,0,2,0],[4,0,0,0]
        // ở vị trí 0 nó bằng 0=> thì thay đổi giá trị(2 thằng) , active(2 thằng).
        // ở vị trí 0 nó khác 0 và nó bằng thằng card đó => valueCard * 2 , active(2 thằng), chuyền thằng i =0
        // ở vị trí 0 nó khác 0 và nó khác thằng card đó=> thì nos thay đổi vị trí của thằng trước nó.
        //////// ko ở vị trí 0
        // nếu j = 0  => continue
        // j =i => => nhân đôi j lên => active lại 2 thằng gán lại giá trị cho i =0,
        // j khác i => lấy thằng trước nó và thay đổi giá trị 
        cc.log(arrCard);
        for (var i = 1; i < arrCard.length; i++) {
            if (arrCard[i].active == false) {
                continue;
            }
            var checkCompare = false;
            for (var j = i - 1; j >= 0; j--) {
                if (checkCompare == true) {
                    j = -1;
                    break;
                }
                if (j == 0) {
                    if (arrCard[j].active == false) {
                        arrCard[j].children[0].getComponent('cc.Label').string = arrCard[i].children[0].getComponent('cc.Label').string;
                        arrCard[i].children[0].getComponent('cc.Label').string = "0";
                        arrCard[i].active = false;
                        arrCard[j].active = true;
                        checkCompare = true;
                        break;
                    }
                    //else if value j == value i => value j * 2 , value i = 0 , active j = true , active i = fasle
                    else if (arrCard[j].children[0].getComponent('cc.Label').string == arrCard[i].children[0].getComponent('cc.Label').string) {
                            arrCard[j].children[0].getComponent('cc.Label').string = Number(arrCard[j].children[0].getComponent('cc.Label').string) * 2 + "";
                            arrCard[i].children[0].getComponent('cc.Label').string = "0";
                            arrCard[j].active = true;
                            arrCard[i].active = false;
                            checkCompare = true;
                            break;
                        }
                        //else if value j != value i => value j+1 = value i , value i = 0 , active j-1 = true , active i = false; 
                        else if (arrCard[j].children[0].getComponent('cc.Label').string != arrCard[i].children[0].getComponent('cc.Label').string) {
                                var reValue = j + 1;
                                checkCompare = true;
                                if (reValue == i) {
                                    break;
                                } else {
                                    arrCard[reValue].children[0].getComponent('cc.Label').string = arrCard[i].children[0].getComponent('cc.Label').string;
                                    arrCard[i].children[0].getComponent('cc.Label').string = "0";
                                    arrCard[reValue].active = true;
                                    arrCard[i].active = false;
                                    break;
                                }
                            }
                }
                //value j active = false => continue
                if (arrCard[j].active == false) {
                    cc.log("continue");
                    continue;
                }
                // value j == value i => value j*2 && active j = true , active i = false , gán i = 0
                this.blabla(arrCard[j], arrCard[i], checkCompare);
                break;
                // value j != value i => value j +1 = value i , value i =0 , active j +1 = true , active i = false
                if (arrCard[j].children[0].getComponent('cc.Label').string != arrCard[i].children[0].getComponent('cc.Label').string) {
                    checkCompare = true;
                    var _reValue = j + 1;
                    // nếu value trước là chính nó thì continue
                    if (_reValue == i) {
                        break;
                    }
                    arrCard[_reValue].children[0].getComponent('cc.Label').string = arrCard[i].children[0].getComponent('cc.Label').string;
                    arrCard[i].children[0].getComponent('cc.Label').string = "0";
                    arrCard[_reValue].active = true;
                    arrCard[i].active = false;
                    break;
                }
            }
        }
        // cc.log(arrCard)
    },
    blabla: function blabla(b1, b2, checkCompare) {
        if (b1.children[0].getComponent('cc.Label').string == b2.children[0].getComponent('cc.Label').string) {
            b1.children[0].getComponent('cc.Label').string = Number(b1.children[0].getComponent('cc.Label').string) * 2 + "";
            cc.log(b1.children[0].getComponent('cc.Label').string);
            b1.active = true;
            b2.children[0].getComponent('cc.Label').string = "0";
            b2.active = false;
            checkCompare = true;
            cc.log(b2, b1);
            // if(j == 1){
            //     j = -1;
            // }
        }
    },
    getString: function getString(row, col) {
        return this._arrBlocks[row][col].children[0].getComponent('cc.Label').string;
    },
    start: function start() {
        this.render();
        this.randomNumber();
    },
    init: function init() {},
    render: function render() {

        for (var col = 0; col < 4; col++) {
            var arrRow = [];
            for (var row = 0; row < 4; row++) {
                var x = -226.227 + row * 150;
                var y = 225.631 - col * 150;
                var newCard = cc.instantiate(this.card);
                newCard.parent = this.node;
                newCard.x = x;
                newCard.y = y;
                newCard.color = COLOR[0];

                newCard.active = false;
                arrRow.push(newCard);
            }
            this._arrBlocks.push(arrRow);
        }
    },
    randomNumber: function randomNumber() {
        var flatArray = this._arrBlocks.flat(Infinity);
        var arrNone = flatArray.filter(function (value) {
            return value.active == false;
        });
        var index = Math.floor(Math.random() * arrNone.length);
        arrNone[index].children[0].getComponent('cc.Label').string = 2;
        arrNone[index].active = true;
        cc.log(this._arrBlocks);
    },
    createItem: function createItem(x, y) {
        var card = cc.instantiate(this.card);
        card.parent = this.node;
        card.x = x;
        card.y = y;
    }
}

// update (dt) {},
);

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=main.js.map
        
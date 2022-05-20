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
        this.randomNumber();
    },
    moveDown: function moveDown() {
        for (var col = 0; col < 4; col++) {
            var flatArrCard = [0, 0, 0, 0];
            for (var row = 0; row < 4; row++) {
                flatArrCard[row] = this._arrBlocks[row][col];
            }
            this.handle(flatArrCard.reverse());
        }
        this.randomNumber();
    },
    moveLeft: function moveLeft() {
        for (var row = 0; row < 4; row++) {
            var flatArrCard = [0, 0, 0, 0];
            for (var col = 0; col < 4; col++) {
                flatArrCard[col] = this._arrBlocks[row][col];
            }
            this.handle(flatArrCard);
        }
        this.randomNumber();
    },
    moveRight: function moveRight() {
        for (var row = 0; row < 4; row++) {
            var flatArrCard = [0, 0, 0, 0];
            for (var col = 0; col < 4; col++) {
                flatArrCard[col] = this._arrBlocks[row][col];
            }

            this.handle(flatArrCard.reverse());
        }
        this.randomNumber();
    },
    handle: function handle(arrCard) {
        for (var i = 1; i < arrCard.length; i++) {
            if (arrCard[i].active == false) {
                continue;
            }
            var checkCompare = false;
            var objAnim = { selfCard: null, otherCard: null, callBack: null };
            for (var j = i - 1; j >= 0; j--) {
                if (checkCompare == true) {
                    j = -1;
                    break;
                }
                checkCompare = this.changeValueCards(arrCard, i, j, objAnim);
                var cloneObjAnim = Object.assign(objAnim);
                this.handleMove(cloneObjAnim.selfCard, cloneObjAnim.otherCard, cloneObjAnim.callBack);
            }
        }
    },
    changeValueCards: function changeValueCards(arrCard, i, j, objAnim) {
        if (arrCard[j].active == false) {
            if (j == 0) {
                var callBack = function callBack(selfCard, otherCard) {
                    otherCard.children[0].getComponent('cc.Label').string = selfCard.children[0].getComponent('cc.Label').string;
                    selfCard.children[0].getComponent('cc.Label').string = "0";
                    selfCard.active = true;
                    otherCard.active = true;
                };
                objAnim.selfCard = arrCard[i];
                objAnim.otherCard = arrCard[j];
                objAnim.callBack = callBack;
                return true;
            }
        } else {
            if (arrCard[j].children[0].getComponent('cc.Label').string == arrCard[i].children[0].getComponent('cc.Label').string) {
                var _callBack = function _callBack(selfCard, otherCard) {
                    otherCard.children[0].getComponent('cc.Label').string = Number(otherCard.children[0].getComponent('cc.Label').string) * 2 + "";
                    selfCard.children[0].getComponent('cc.Label').string = "0";
                    otherCard.active = true;
                    selfCard.active = true;
                };
                objAnim.selfCard = arrCard[i];
                objAnim.otherCard = arrCard[j];
                objAnim.callBack = _callBack;
                return true;
            } else if (arrCard[j].children[0].getComponent('cc.Label').string != arrCard[i].children[0].getComponent('cc.Label').string) {
                var reValue = j + 1;
                if (reValue != i) {
                    var _callBack2 = function _callBack2(selfCard, otherCard) {
                        otherCard.children[0].getComponent('cc.Label').string = selfCard.children[0].getComponent('cc.Label').string;
                        selfCard.children[0].getComponent('cc.Label').string = "0";
                        otherCard.active = true;
                        selfCard.active = true;
                    };
                    objAnim.selfCard = arrCard[i];
                    objAnim.otherCard = arrCard[reValue];
                    objAnim.callBack = _callBack2;
                }
                return true;
            }
        }
    },
    handleMove: function handleMove(selfCard, otherCard, callBack) {
        if (selfCard != null && otherCard != null) {
            var x = otherCard.x;
            var y = otherCard.y;
            cc.tween(selfCard).to(0.1, { x: x, y: y }).call(function () {
                return callBack(selfCard, otherCard);
            }).to(0.1, { x: selfCard.getComponent("card")._xOld, y: selfCard.getComponent("card")._yOld }).start();
            // let action1 = cc.moveTo(0.5, cc.v2(x, y));
            // let action2 = cc.callFunc(() => { callBack(selfCard, otherCard) });
            // let action3 = cc.moveTo(0.5, cc.v2(selfCard.getComponent("card")._xOld, selfCard.getComponent("card")._yOld));
            // let action = cc.sequence(action1, action2, action3);
            // selfCard.runAction(action)
        }
    },
    getString: function getString(arrCard, index) {
        return arrCard[index].children[0].getComponent('cc.Label');
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
        
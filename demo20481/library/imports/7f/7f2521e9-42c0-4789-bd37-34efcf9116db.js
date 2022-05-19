"use strict";
cc._RF.push(module, '7f252HpQsBHib03NO/PkRbb', 'main');
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

        var _loop = function _loop(i) {
            if (arrCard[i].active == false) {
                return 'continue';
            }
            var checkCompare = false;
            var objEmit = { selfCard: null, otherCard: null, callback: null };

            var _loop2 = function _loop2(_j) {
                if (checkCompare == true) {
                    _j = -1;
                    return 'continue';
                }
                if (_j == 0) {
                    if (arrCard[_j].active == false) {
                        var callBack = function callBack() {
                            arrCard[_j].children[0].getComponent('cc.Label').string = arrCard[i].children[0].getComponent('cc.Label').string;
                            arrCard[i].children[0].getComponent('cc.Label').string = "0";
                            arrCard[i].active = false;
                            arrCard[_j].active = true;
                            checkCompare = true;
                        };
                        objEmit.otherCard = arrCard[_j];
                        objEmit.callback = callBack;
                        return 'continue';
                    }
                    //else if value j == value i => value j * 2 , value i = 0 , active j = true , active i = fasle
                    else if (arrCard[_j].children[0].getComponent('cc.Label').string == arrCard[i].children[0].getComponent('cc.Label').string) {
                            var _callBack = function _callBack() {
                                arrCard[_j].children[0].getComponent('cc.Label').string = Number(arrCard[_j].children[0].getComponent('cc.Label').string) * 2 + "";
                                arrCard[i].children[0].getComponent('cc.Label').string = "0";
                                arrCard[_j].active = true;
                                arrCard[i].active = false;
                                checkCompare = true;
                            };
                            objEmit.otherCard = arrCard[_j];
                            objEmit.callback = _callBack;

                            return 'continue';
                        }
                        //else if value j != value i => value j+1 = value i , value i = 0 , active j-1 = true , active i = false; 
                        else if (arrCard[_j].children[0].getComponent('cc.Label').string != arrCard[i].children[0].getComponent('cc.Label').string) {
                                var reValue = _j + 1;
                                checkCompare = true;
                                if (reValue == i) {
                                    return 'continue';
                                } else {
                                    var _callBack2 = function _callBack2() {
                                        arrCard[reValue].children[0].getComponent('cc.Label').string = arrCard[i].children[0].getComponent('cc.Label').string;
                                        arrCard[i].children[0].getComponent('cc.Label').string = "0";
                                        arrCard[reValue].active = true;
                                        arrCard[i].active = false;
                                    };
                                    objEmit.otherCard = arrCard[reValue];
                                    objEmit.callback = _callBack2;
                                    return 'continue';
                                }
                            }
                }
                //value j active = false => continue
                if (arrCard[_j].active == false) {
                    cc.log("continue");
                    return 'continue';
                }
                // value j == value i => value j*2 && active j = true , active i = false , gán i = 0
                if (arrCard[_j].children[0].getComponent('cc.Label').string == arrCard[i].children[0].getComponent('cc.Label').string) {
                    var _callBack3 = function _callBack3() {
                        arrCard[_j].children[0].getComponent('cc.Label').string = Number(arrCard[_j].children[0].getComponent('cc.Label').string) * 2 + "";
                        cc.log(arrCard[_j].children[0].getComponent('cc.Label').string);
                        arrCard[_j].active = true;
                        arrCard[i].children[0].getComponent('cc.Label').string = "0";
                        arrCard[i].active = false;
                        checkCompare = true;
                        cc.log(arrCard[i], arrCard[_j]);
                    };
                    objEmit.otherCard = arrCard[_j];
                    objEmit.callback = _callBack3;

                    // if(j == 1){
                    //     j = -1;
                    // }
                    return 'continue';
                }
                // value j != value i => value j +1 = value i , value i =0 , active j +1 = true , active i = false
                if (arrCard[_j].children[0].getComponent('cc.Label').string != arrCard[i].children[0].getComponent('cc.Label').string) {
                    checkCompare = true;
                    var _reValue = _j + 1;
                    // nếu value trước là chính nó thì continue
                    if (_reValue == i) {
                        return 'continue';
                    }
                    var _callBack4 = function _callBack4() {
                        arrCard[_reValue].children[0].getComponent('cc.Label').string = arrCard[i].children[0].getComponent('cc.Label').string;
                        arrCard[i].children[0].getComponent('cc.Label').string = "0";
                        arrCard[_reValue].active = true;
                        arrCard[i].active = false;
                    };
                    objEmit.otherCard = arrCard[_reValue];
                    objEmit.callback = _callBack4;
                    return 'continue';
                }
                j = _j;
            };

            for (var j = i - 1; j >= 0; j--) {
                var _ret2 = _loop2(j);

                if (_ret2 === 'continue') continue;
            }
            Emitter.instance.emit("handleMove", arrCard[i], objEmit.otherCard, objEmit.callback);
        };

        for (var i = 1; i < arrCard.length; i++) {
            var _ret = _loop(i);

            if (_ret === 'continue') continue;
        }
        // cc.log(arrCard)
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
    }
}
// update (dt) {},
);

cc._RF.pop();
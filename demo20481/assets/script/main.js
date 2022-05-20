
const COLOR = require('color');
const Emitter = require('mEmitter');
let arrBlock = [];
cc.Class({
    extends: cc.Component,

    properties: {
        card: {
            default: null,
            type: cc.Prefab
        },
        _arrBlocks: [],

        _canPress: false,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.canPress = false;
        Emitter.instance = new Emitter();
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.handleKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.handleKeyUp, this);
    },

    handleKeyUp(evt) {
        switch (evt.keyCode) {
            case cc.macro.KEY.up:
            case cc.macro.KEY.down:
            case cc.macro.KEY.left:
            case cc.macro.KEY.right:
                this._canPress = false;
                break;
            default: break;
        }
    },
    handleKeyDown(evt) {
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
            default: break;
        }
    },

    moveUp() {
        for (let col = 0; col < 4; col++) {
            let flatArrCard = [0, 0, 0, 0];
            for (let row = 0; row < 4; row++) {
                flatArrCard[row] = this._arrBlocks[row][col];
            }
            this.handle(flatArrCard)
        }
        this.randomNumber();
    },
    moveDown() {
        for (let col = 0; col < 4; col++) {
            let flatArrCard = [0, 0, 0, 0];
            for (let row = 0; row < 4; row++) {
                flatArrCard[row] = this._arrBlocks[row][col];
            }
            this.handle(flatArrCard.reverse())
        }
        this.randomNumber();
    },

    moveLeft() {
        for (let row = 0; row < 4; row++) {
            let flatArrCard = [0, 0, 0, 0];
            for (let col = 0; col < 4; col++) {
                flatArrCard[col] = this._arrBlocks[row][col];
            }
            this.handle(flatArrCard)
        }
        this.randomNumber();
    },

    moveRight() {
        for (let row = 0; row < 4; row++) {
            let flatArrCard = [0, 0, 0, 0];
            for (let col = 0; col < 4; col++) {
                flatArrCard[col] = this._arrBlocks[row][col];
            }

            this.handle(flatArrCard.reverse())
        }
        this.randomNumber();
    },

    handle(arrCard) {
        for (let i = 1; i < arrCard.length; i++) {
            if (arrCard[i].active == false) {
                continue;
            }
            let checkCompare = false;
            let objAnim = { selfCard: null, otherCard: null, callBack: null }
            for (let j = i - 1; j >= 0; j--) {
                if (checkCompare == true) {
                    j = -1;
                    break;
                }
                checkCompare = this.changeValueCards(arrCard, i, j, objAnim);
                let cloneObjAnim = Object.assign(objAnim);
                this.handleMove(cloneObjAnim.selfCard, cloneObjAnim.otherCard, cloneObjAnim.callBack);
            }
        }
    },

    changeValueCards(arrCard, i, j, objAnim) {
        if (arrCard[j].active == false) {
            if (j == 0) {
                let callBack = function (selfCard, otherCard) {
                    otherCard.children[0].getComponent('cc.Label').string = selfCard.children[0].getComponent('cc.Label').string;
                    selfCard.children[0].getComponent('cc.Label').string = "0";
                    selfCard.active = true;
                    otherCard.active = true;
                }
                objAnim.selfCard = arrCard[i];
                objAnim.otherCard = arrCard[j];
                objAnim.callBack = callBack;
                return true;
            }
        }
        else {
            if (arrCard[j].children[0].getComponent('cc.Label').string == arrCard[i].children[0].getComponent('cc.Label').string) {
                let callBack = function (selfCard, otherCard) {
                    otherCard.children[0].getComponent('cc.Label').string = Number(otherCard.children[0].getComponent('cc.Label').string) * 2 + "";
                    selfCard.children[0].getComponent('cc.Label').string = "0";
                    otherCard.active = true;
                    selfCard.active = true;
                }
                objAnim.selfCard = arrCard[i];
                objAnim.otherCard = arrCard[j];
                objAnim.callBack = callBack;
                return true;
            }
            else if (arrCard[j].children[0].getComponent('cc.Label').string != arrCard[i].children[0].getComponent('cc.Label').string) {
                let reValue = j + 1;
                if (reValue != i) {
                    let callBack = function (selfCard, otherCard) {
                        otherCard.children[0].getComponent('cc.Label').string = selfCard.children[0].getComponent('cc.Label').string;
                        selfCard.children[0].getComponent('cc.Label').string = "0";
                        otherCard.active = true;
                        selfCard.active = true;
                    }
                    objAnim.selfCard = arrCard[i];
                    objAnim.otherCard = arrCard[reValue];
                    objAnim.callBack = callBack;
                }
                return true;
            }
        }
    },

    handleMove(selfCard, otherCard, callBack) {
        if (selfCard != null && otherCard != null) {
            let x = otherCard.x;
            let y = otherCard.y;
            cc.tween(selfCard)
                    .to(0.1, { x: x, y: y })
                    .call(()=>callBack(selfCard,otherCard))
                    .to(0.1, { x: selfCard.getComponent("card")._xOld, y: selfCard.getComponent("card")._yOld })
                    .start()
            // let action1 = cc.moveTo(0.5, cc.v2(x, y));
            // let action2 = cc.callFunc(() => { callBack(selfCard, otherCard) });
            // let action3 = cc.moveTo(0.5, cc.v2(selfCard.getComponent("card")._xOld, selfCard.getComponent("card")._yOld));
            // let action = cc.sequence(action1, action2, action3);
            // selfCard.runAction(action)
        }
    },

    getString(arrCard, index) {
        return arrCard[index].children[0].getComponent('cc.Label');
    },

    start() {
        this.render();
        this.randomNumber()
    },
    init() {
    },

    render() {

        for (let col = 0; col < 4; col++) {
            let arrRow = [];
            for (let row = 0; row < 4; row++) {
                let x = -226.227 + row * 150;
                let y = 225.631 - col * 150;
                let newCard = cc.instantiate(this.card);
                newCard.parent = this.node
                newCard.x = x;
                newCard.y = y;
                newCard.color = COLOR[0];

                newCard.active = false
                arrRow.push(newCard);
            }
            this._arrBlocks.push(arrRow)
        }
    },

    randomNumber() {
        let flatArray = this._arrBlocks.flat(Infinity)
        let arrNone = flatArray.filter((value) => {
            return value.active == false;
        })
        let index = Math.floor(Math.random() * arrNone.length);
        arrNone[index].children[0].getComponent('cc.Label').string = 2;
        arrNone[index].active = true;
        cc.log(this._arrBlocks);
    },
    // update (dt) {},
});
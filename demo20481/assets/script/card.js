const Emitter = require('mEmitter');
let COLOR = require("color");

cc.Class({
    extends: cc.Component,

    properties: {
        lblCard: {
            default: null,
            type: cc.Label,
        },
        _handleMoveUp: null,
        _handleMoveDown: null,
        _handleMoveLeft: null,
        _handleMoveRight: null,
        _handleDoneRandom: null,
        _action: null,
        animMove: null,
        _xOld: null,
        _yOld: null,
    },

    onLoad() {
        this._handleMoveUp = this.handleMoveUp.bind(this);
        this._handleMoveDown = this.handleMoveDown.bind(this);
        this._handleMoveLeft = this.handleMoveLeft.bind(this);
        this._handleMoveRight = this.handleMoveRight.bind(this);
        this._handleDoneRandom = this.handleDoneRandom.bind(this);

        Emitter.instance.registerEvent("moveUp", this._handleMoveUp);
        Emitter.instance.registerEvent("moveDown", this._handleMoveDown);
        Emitter.instance.registerEvent("moveLeft", this._handleMoveLeft);
        Emitter.instance.registerEvent("moveRight", this._handleMoveRight);
        // Emitter.instance.registerEvent("doneRandom",this._handleDoneRandom);
        //Emitter.instance.registerEvent("move", this.handleMove.bind(this));
        Emitter.instance.registerEvent("moveRight", this.handleMove);
    },

    handleMove(selfCard, ortherCard, callBack) {
        if (this.node == selfCard) {
            let x = ortherCard.x;
            let y = ortherCard.y;
            let handleTween = cc.tween;
            handleTween(selfCard)
                .parallel(
                    handleTween().to(2, { x: x, y: y }),
                    handleTween().call(callBack)
                )
                .to(0, 5, { x: selfCard.getComponent("card")._xOld, y: selfCard.getComponent("card")._yOld })
                .start();
        }
    },

    handleMoveAnim(x, y, callBack) {
        let actionMove = cc.moveTo(1, cc.v2(x, y));
        let actionCB = cc.callFunc(callBack);
        let action = cc.sequence(actionMove, actionCB);
        return action;
    },

    setColorNumber(number) {
        if (number == 0) {
            this.lblCard.node.active = false;
            this.node.color = COLOR[0];
        }
        else {
            this.lblCard.string = number;
            this.lblCard.node.active = true;
            switch (number) {
                case 2:
                    this.node.color = COLOR[2];
                    break;
                case 4:
                    this.node.color = COLOR[4];
                    break;
                case 8:
                    this.node.color = COLOR[8];
                    break;
                case 16:
                    this.node.color = COLOR[16];
                    break;
                case 32:
                    this.node.color = COLOR[32];
                    break;
                case 64:
                    this.node.color = COLOR[64];
                    break;
                case 128:
                    this.node.color = COLOR[128];
                    break;
                case 256:
                    this.node.color = COLOR[256];
                    break;
                case 512:
                    this.node.color = COLOR[512];
                    break;
                case 1024:
                    this.node.color = COLOR[1024];
                    break;
                case 2048:
                    this.node.color = COLOR[2048];
                    break;

            }
        }
    },

    handleDoneRandom(objCard) {
        // cc.log(objCard)
        if (objCard.x == this.node.x && objCard.y == this.node.y) {
            this.node.opacity = 255;
            this.node.children[0].getComponent('cc.Label').string = 2
            this.node.color = new cc.color(235, 224, 213, 255);
            cc.log(objCard)
        }
    },

    move(x, y) {
        // this._action =cc.moveBy(0,cc.v2(x,y));
        // this.node.runAction(this._action);  
    },

    handleMoveUp() {
        this.move(0, 150);
    },

    handleMoveDown() {
        this.move(0, -150);
    },

    handleMoveLeft() {
        this.move(-150, 0);
    },

    handleMoveRight() {
        this.move(150, 0)
    },

    animMerge() {

    },

    start() {
        if (this._xOld == null && this._yOld == null) {
            this._xOld = this.node.x;
            this._yOld = this.node.y;
        }
    },
    
    update (dt) {
        if(this.lblCard.string == "0"){
            this.node.active = false
        }
    },
});

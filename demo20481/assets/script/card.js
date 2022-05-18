const Emitter = require('mEmitter');
let COLOR = require("color");

cc.Class({
    extends: cc.Component,

    properties: {
        lblCard:{
            default: null,
            type:cc.Label,
        } ,
        _handleMoveUp: null,
        _handleMoveDown: null,
        _handleMoveLeft: null,
        _handleMoveRight: null,
        _handleDoneRandom: null,
        _action: null,
    },

    onLoad () {
        this._handleMoveUp = this.handleMoveUp.bind(this);
        this._handleMoveDown = this.handleMoveDown.bind(this);
        this._handleMoveLeft = this.handleMoveLeft.bind(this);
        this._handleMoveRight = this.handleMoveRight.bind(this);
        this._handleDoneRandom = this.handleDoneRandom.bind(this);

        Emitter.instance.registerEvent("moveUp",this._handleMoveUp);
        Emitter.instance.registerEvent("moveDown",this._handleMoveDown);
        Emitter.instance.registerEvent("moveLeft",this._handleMoveLeft);
        Emitter.instance.registerEvent("moveRight",this._handleMoveRight);
       // Emitter.instance.registerEvent("doneRandom",this._handleDoneRandom);
    },
    setColorNumber(number){
        if(number == 0 ) {
            this.lblCard.node.active = false;
            this.node.color = COLOR[0];
        }
        else{
            this.lblCard.string = number;
            this.lblCard.node.active = true;
            switch(number){
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

    handleDoneRandom(objCard){
       // cc.log(objCard)
        if(objCard.x == this.node.x && objCard.y == this.node.y){
            this.node.opacity = 255;
            this.node.children[0].getComponent('cc.Label').string =2
            this.node.color = new cc.color(235,224,213,255);
            cc.log(objCard)
        }
    },

    move(x,y){
        // this._action =cc.moveBy(0,cc.v2(x,y));
        // this.node.runAction(this._action);  
    },

    handleMoveUp(){
        this.move(0,150);
    },

    handleMoveDown(){
        this.move(0,-150);
    },

    handleMoveLeft(){
        this.move(-150,0);
    },

    handleMoveRight(){
        this.move(150,0)
    },

    animMerge(){

    },

    start () {
    },

    // update (dt) {},
});

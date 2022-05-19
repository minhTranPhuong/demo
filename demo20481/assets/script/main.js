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
                this.randomNumber();
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
    },
    moveDown() {
        for (let col = 0; col < 4; col++) {
            let flatArrCard = [0, 0, 0, 0];
            for (let row = 0; row < 4; row++) {
                flatArrCard[row] = this._arrBlocks[row][col];
            }

            this.handle(flatArrCard.reverse())
        }
    },

    moveLeft() {
        for (let row = 0; row < 4; row++) {
            let flatArrCard = [0, 0, 0, 0];
            for (let col = 0; col < 4; col++) {
                flatArrCard[col] = this._arrBlocks[row][col];
            }

            this.handle(flatArrCard)
        }
    },


    moveRight() {
        for (let row = 0; row < 4; row++) {
            let flatArrCard = [0, 0, 0, 0];
            for (let col = 0; col < 4; col++) {
                flatArrCard[col] = this._arrBlocks[row][col];
            }

            this.handle(flatArrCard.reverse())
        }
    },

    handle(arrCard) {//[0,2,2,0],[2,0,2,0],[4,0,0,0]
        // ở vị trí 0 nó bằng 0=> thì thay đổi giá trị(2 thằng) , active(2 thằng).
        // ở vị trí 0 nó khác 0 và nó bằng thằng card đó => valueCard * 2 , active(2 thằng), chuyền thằng i =0
        // ở vị trí 0 nó khác 0 và nó khác thằng card đó=> thì nos thay đổi vị trí của thằng trước nó.
        //////// ko ở vị trí 0
        // nếu j = 0  => continue
        // j =i => => nhân đôi j lên => active lại 2 thằng gán lại giá trị cho i =0,
        // j khác i => lấy thằng trước nó và thay đổi giá trị 


        // chỉ có 3 trường hợp:
        cc.log(arrCard);
        for (let i = 1; i < arrCard.length; i++) {
            if (arrCard[i].active == false) {
                continue;
            }
            let checkCompare = false;
            let objEmit = { selfCard: null, otherCard: null, callback: null };
            for (let j = i - 1; j >= 0; j--) {
                if (checkCompare == true) {
                    j = -1;
                    continue;
                }
                if (j == 0) {
                    if (arrCard[j].active == false) {
                        let callBack = function () {
                            arrCard[j].children[0].getComponent('cc.Label').string = arrCard[i].children[0].getComponent('cc.Label').string;
                            arrCard[i].children[0].getComponent('cc.Label').string = "0";
                            arrCard[i].active = false;
                            arrCard[j].active = true;
                            checkCompare = true;
                        }
                        objEmit.otherCard = arrCard[j];
                        objEmit.callback = callBack
                        continue;
                    }
                    //else if value j == value i => value j * 2 , value i = 0 , active j = true , active i = fasle
                    else if (arrCard[j].children[0].getComponent('cc.Label').string == arrCard[i].children[0].getComponent('cc.Label').string) {
                        let callBack = function () {
                            arrCard[j].children[0].getComponent('cc.Label').string = Number(arrCard[j].children[0].getComponent('cc.Label').string) * 2 + "";
                            arrCard[i].children[0].getComponent('cc.Label').string = "0";
                            arrCard[j].active = true;
                            arrCard[i].active = false;
                            checkCompare = true;
                        }
                        objEmit.otherCard = arrCard[j];
                        objEmit.callback = callBack

                        continue;
                    }
                    //else if value j != value i => value j+1 = value i , value i = 0 , active j-1 = true , active i = false; 
                    else if (arrCard[j].children[0].getComponent('cc.Label').string != arrCard[i].children[0].getComponent('cc.Label').string) {
                        let reValue = j + 1;
                        checkCompare = true;
                        if (reValue == i) {
                            continue;
                        }
                        else {
                            let callBack = function () {
                                arrCard[reValue].children[0].getComponent('cc.Label').string = arrCard[i].children[0].getComponent('cc.Label').string;
                                arrCard[i].children[0].getComponent('cc.Label').string = "0";
                                arrCard[reValue].active = true;
                                arrCard[i].active = false;
                            }
                            objEmit.otherCard = arrCard[reValue];
                            objEmit.callback = callBack;
                            continue;
                        }
                    }
                }
                //value j active = false => continue
                if (arrCard[j].active == false) {
                    cc.log("continue")
                    continue;
                }
                // value j == value i => value j*2 && active j = true , active i = false , gán i = 0
                if (arrCard[j].children[0].getComponent('cc.Label').string == arrCard[i].children[0].getComponent('cc.Label').string) {
                    let callBack = function () {
                        arrCard[j].children[0].getComponent('cc.Label').string = Number(arrCard[j].children[0].getComponent('cc.Label').string) * 2 + "";
                        cc.log(arrCard[j].children[0].getComponent('cc.Label').string)
                        arrCard[j].active = true;
                        arrCard[i].children[0].getComponent('cc.Label').string = "0";
                        arrCard[i].active = false;
                        checkCompare = true;
                        cc.log(arrCard[i], arrCard[j])
                    }
                    objEmit.otherCard = arrCard[j];
                    objEmit.callback = callBack;

                    // if(j == 1){
                    //     j = -1;
                    // }
                    continue;
                }
                // value j != value i => value j +1 = value i , value i =0 , active j +1 = true , active i = false
                if (arrCard[j].children[0].getComponent('cc.Label').string != arrCard[i].children[0].getComponent('cc.Label').string) {
                    checkCompare = true;
                    let reValue = j + 1;
                    // nếu value trước là chính nó thì continue
                    if (reValue == i) {
                        continue;
                    }
                    let callBack = function () {
                        arrCard[reValue].children[0].getComponent('cc.Label').string = arrCard[i].children[0].getComponent('cc.Label').string;
                        arrCard[i].children[0].getComponent('cc.Label').string = "0";
                        arrCard[reValue].active = true;
                        arrCard[i].active = false;
                    }
                    objEmit.otherCard = arrCard[reValue];
                    objEmit.callback = callBack;
                    continue;
                }
            }
            Emitter.instance.emit("handleMove", arrCard[i], objEmit.otherCard , objEmit.callback)
        }
        // cc.log(arrCard)
    },

    getString(row, col) {
        return this._arrBlocks[row][col].children[0].getComponent('cc.Label').string;
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
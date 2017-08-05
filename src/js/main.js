/**
 * Created by Administrator on 2017/7/26.
 */
function createNumber() {//创建一个新的数字并且放入data中
    if (hasSpace()){
        var number=Math.random()>0.5?4:2
        var site=findSpace(number);
        var x=site.x;
        var y=site.y;
        var ele=$('<div></div>',{
            class:'cell'+' cell-'+x+'-'+y,
        }).text(number).appendTo($('.cell-container'));
        showNumber(ele,number,x, y);
    }else{
        return false
    }
}
function showNumber(ele,number,x,y) {
    ele.css({
        'width':0,
        'height':0,
        'color':setColor(number),
        'left':getLeft(x)+width/2,
        'top':getTop(y)+height/2,
        'backgroundColor':getNumberBackgroundColor(number),
    }).animate({
        'width':width,
        'height':height,
        'left':getLeft(x),
        'top':getTop(y),
    },200)
}
function toZero() {
    score=0;
    $('.score-content').text(0);
    $('.addAnimation').text('');
    for (var i=0;i<4;i++){
        data[i]=[];
        mergeArray[i]=[];
        for(var j=0;j<4;j++){
            data[i][j]=0;
            mergeArray[i][j]=false;
        }
    }
}
function updateMerge() {
    for (var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            mergeArray[i][j]=false;
        }
    }
}
function updateContainer() {
    for (var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            if (data[i][j]===0){
                $('.cell-'+j+'-'+i).remove();
            }else{
                $('.cell-'+j+'-'+i).css({
                    'width':width,
                    'height':height,
                    'left':getLeft(j),
                    'top':getTop(i),
                    'backgroundColor':getNumberBackgroundColor(data[i][j]),
                    'color':setColor(data[i][j]),
                }).text(data[i][j]);
            }
        }
    }
}
function init() {
    calculateWidth();
    readStorage();
    toZero();
    updateContainer();
    createNumber();
    createNumber();
}
$(document).ready(function () {
    init();
    $('#btn').on('click',function () {
        init()
    });
    $('#restart').on('click',function () {
        $('.gameOver-modal').css({
            'display':'none'
        })
        init();
    })
    $(document).on('keydown',function (event) {
        if (event.keyCode==37){
            event.preventDefault();
            if (canMoveLeft()){
                moveLeft();
                setTimeout(function () {
                    updateContainer();
                },mergeDelay);
                setTimeout(function () {
                    createNumber();
                },createTime);
            }
            gameOver();
        }else if (event.keyCode==38){
            event.preventDefault();
            if (canMoveTop()){
                moveTop();
                setTimeout(function () {
                    updateContainer();
                },mergeDelay);
                setTimeout(function () {
                    createNumber();
                },createTime);
            }
            gameOver();
        }
        else if (event.keyCode==39){
            event.preventDefault();
            if (canMoveRight()){
                moveRight();
                setTimeout(function () {
                    updateContainer();
                },mergeDelay);
                setTimeout(function () {
                    createNumber();
                },createTime);
            }
            gameOver();
        }
        else if (event.keyCode==40){
            event.preventDefault();
            if (canMoveBottom()){
                moveBottom();
                setTimeout(function () {
                    updateContainer();
                },mergeDelay);
                setTimeout(function () {
                    createNumber();
                },createTime);
            }
            gameOver();
        }

    })
    document.addEventListener('touchstart',function (event) {
        touchstartX=event.touches[0].pageX;
        touchstartY=event.touches[0].pageY;
    })
    document.addEventListener('touchend',function (event) {
        touchendX=event.changedTouches[0].pageX;
        touchendY=event.changedTouches[0].pageY;
        var offsetX=touchendX-touchstartX;
        var offsetY=touchendY-touchstartY;
        if (Math.abs(offsetX)>Math.abs(offsetY)){
            //水平方向
            if (offsetX>ignoreValue){
                if (canMoveRight()){
                    moveRight();
                    setTimeout(function () {
                        updateContainer();
                    },mergeDelay);
                    setTimeout(function () {
                        createNumber();
                    },createTime);
                }
                gameOver();
            }else if (offsetX<-ignoreValue){
                if (canMoveLeft()){
                    moveLeft();
                    setTimeout(function () {
                        updateContainer();
                    },mergeDelay);
                    setTimeout(function () {
                        createNumber();
                    },createTime);
                }
                gameOver();
            }
        }else{
            //垂直方向
            if (offsetY>ignoreValue){
                if (canMoveBottom()){
                    moveBottom();
                    setTimeout(function () {
                        updateContainer();
                    },mergeDelay);
                    setTimeout(function () {
                        createNumber();
                    },createTime);
                }
                gameOver();
            }else if (offsetY<-ignoreValue){
                if (canMoveTop()){
                    moveTop();
                    setTimeout(function () {
                        updateContainer();
                    },mergeDelay);
                    setTimeout(function () {
                        createNumber();
                    },createTime);
                }
                gameOver();
            }
        }
    })
})
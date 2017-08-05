/**
 * Created by Administrator on 2017/7/26.
 */
var data=new Array();
var width=106.25;
var height=106.5;
var gap=15;
var mergeDelay=350;
var moveTime=200;
var createTime=400;
var mergeArray=new Array();
var score=0;
var touchstartX=0;
var touchstartY=0;
var touchendX=0;
var touchendY=0;
var ignoreValue=30;
function hasSpace() {
    for (var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            if (data[i][j]==0){
                return true
            }
        }
    }
    return false
}
function findSpace(number) {//随机找到二维数组中的空白位置
    var x;
    var y;
    do {
        x=parseInt(Math.floor(Math.random()*4));
        y=parseInt(Math.floor(Math.random()*4));
    }
    while (data[x][y]!=0)
    data[x][y]=number;
    return {y:x, x:y}
}

function getLeft(x) {
    return width*x+gap*(x+1)
}
function getTop(y) {
    return height*y+gap*(y+1)
}
function setColor(number) {
    if (number>4){
        return '#fff'
    }else{
        return '#776e65'
    }
}
function getNumberBackgroundColor( number ){
    switch( number ){
        case 2:return "#eee4da";break;
        case 4:return "#ede0c8";break;
        case 8:return "#f2b179";break;
        case 16:return "#f59563";break;
        case 32:return "#f67c5f";break;
        case 64:return "#f65e3b";break;
        case 128:return "#edcf72";break;
        case 256:return "#edcc61";break;
        case 512:return "#9c0";break;
        case 1024:return "#33b5e5";break;
        case 2048:return "#09c";break;
        case 4096:return "#a6c";break;
        case 8192:return "#93c";break;
    }

    return "black";
}
function horizontalNoBlock(row,col,target) {
    if (col == target){
        return true
    }else if (col>target){
        for(col=col-1;col>target;col--){
            if (data[row][col]!=0){
                return false
            }
        }
    }else if (target>col){
        for(target=target-1;target>col;target--){
            if (data[row][target]!=0){
                return false
            }
        }
    }
    return true
}
function verticalNoBlock(col,row,target) {
    if (row == target){
        return true
    }else if (row>target){
        for(row=row-1;row>target;row--){
            if (data[row][col]!=0){
                return false
            }
        }
    }else if (target>row){
        for(target=target-1;target>row;target--){
            if (data[target][col]!=0){
                return false
            }
        }
    }
    return true
}
function canMoveLeft() {
    for (var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            if (data[i][j]!==0){
                for(var k=0;k<j;k++) {
                    if (data[i][k] === 0&&horizontalNoBlock(i,j,k)) {
                        return true
                    }else if (data[i][k] === data[i][j]&&horizontalNoBlock(i,j,k)){
                        return true
                    }
                }
            }
        }
    }
    return false
}
function canMoveRight() {
    for (var i=0;i<4;i++){
        for (var j=2;j>=0;j--) {
            if (data[i][j]!==0){
                for(var k=3;k>j;k--) {
                    if (data[i][k] === 0&&horizontalNoBlock(i,j,k)) {
                        return true
                    }else if (data[i][k] === data[i][j]&&horizontalNoBlock(i,j,k)){
                        return true
                    }
                }
            }
        }
    }
    return false
}
function moveAnimate(startX, startY, endX, endY) {
    $('.cell-'+startY+'-'+startX).finish();
    $('.cell-'+startY+'-'+startX).animate({
        'left':getLeft(endY),
        'top':getTop(endX),
    },moveTime,function () {
        if ($('.cell-'+endY+'-'+endX).length>1){
            $('.cell-'+endY+'-'+endX)[0].remove();
        }
    }).attr({
        class:'cell cell-'+endY+'-'+endX
    });
}
function moveLeft() {
    for (var i=0;i<4;i++) {
        for (var j=1;j<4;j++) {
            if (data[i][j]!=0) {
                for (var k=0;k<j;k++){
                    if (data[i][k]==0&&horizontalNoBlock(i, j, k)){
                        data[i][k]=data[i][j];
                        data[i][j]=0;
                        moveAnimate(i, j, i, k,false)
                        break
                    }else if (data[i][k]==data[i][j]&&horizontalNoBlock(i, j, k)&& !mergeArray[i][k]){
                        data[i][k]+=data[i][j];
                        data[i][j]=0;
                        moveAnimate(i, j, i, k,true);
                        mergeArray[i][k]=true
                        updateScore(data[i][k]);
                        break
                    }
                }
            }
        }
    }
    updateMerge();
}
function canMoveTop() {
    for (var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            if (data[j][i]!==0){
                for(var k=0;k<j;k++) {
                    if (data[k][i] === 0&&verticalNoBlock(i,j,k)) {
                        return true
                    }else if (data[j][i] === data[k][i]&&verticalNoBlock(i,j,k)){
                        return true
                    }
                }
            }
        }
    }
    return false
}
function moveTop() {
    for (var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            if (data[j][i]!==0){
                for(var k=0;k<j;k++) {
                    if (data[k][i] === 0&&verticalNoBlock(i,j,k)) {
                        data[k][i]=data[j][i];
                        data[j][i]=0;
                        moveAnimate(j, i, k, i,false)
                        break
                    }else if (data[k][i] === data[j][i]&&verticalNoBlock(i,j,k)&& !mergeArray[k][i]){
                        data[k][i]+=data[j][i];
                        data[j][i]=0;
                        moveAnimate(j, i, k, i,true);
                        mergeArray[k][i]=true;
                        updateScore(data[k][i]);
                        break
                    }
                }
            }
        }
    }
    updateMerge();
}
function moveRight() {
    for (var i=0;i<4;i++) {
        for (var j=2;j>=0;j--) {
            if (data[i][j]!=0) {
                for (var k=3;k>j;k--){
                    if (data[i][k]==0&&horizontalNoBlock(i, j, k)){
                        data[i][k]=data[i][j];
                        data[i][j]=0;
                        moveAnimate(i, j, i, k)
                        break
                    }else if (data[i][k]==data[i][j]&&horizontalNoBlock(i, j, k)&& !mergeArray[i][k]){
                        data[i][k]+=data[i][j];
                        data[i][j]=0;
                        moveAnimate(i, j, i, k);
                        mergeArray[i][k]=true;
                        updateScore(data[i][k]);
                        break
                    }
                }
            }
        }
    }
    updateMerge();
}
function canMoveBottom() {
    for (var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            if (data[j][i]!==0){
                for(var k=3;k>j;k--) {
                    if (data[k][i] === 0&&verticalNoBlock(i,j,k)) {
                        return true
                    }else if (data[j][i] === data[k][i]&&verticalNoBlock(i,j,k)){
                        return true
                    }
                }
            }
        }
    }
    return false
}
function moveBottom() {
    for (var i=0;i<4;i++){
        for(var j=3;j>=0;j--){
            if (data[j][i]!==0){
                for(var k=3;k>j;k--) {
                    if (data[k][i] === 0&&verticalNoBlock(i,j,k)) {
                        data[k][i]=data[j][i];
                        data[j][i]=0;
                        moveAnimate(j, i, k, i,false)
                        break
                    }else if (data[k][i] === data[j][i]&&verticalNoBlock(i,j,k)&& !mergeArray[k][i]){
                        data[k][i]+=data[j][i];
                        data[j][i]=0;
                        moveAnimate(j, i, k, i,true);
                        mergeArray[k][i]=true;
                        updateScore(data[k][i]);
                        break
                    }
                }
            }
        }
    }
    updateMerge();
}
function updateScore(value) {
    score+=value;
    $('.score-content').text(score);
    updateAnimate(value);
}
function updateAnimate(value) {
    $('.addAnimation').stop(true,true);
    $('.addAnimation').text('+'+value).css({
        'position':'absolute',
        'top':'25px',
        'right':'22px',
        'fontSize':'25px',
        'lineHeight':'25px',
        'fontWeight':'bold',
        'opacity':'1',
        'color':'rgba(119, 110, 101, 0.9)',
    }).animate({
        'top':'-30px',
        'opacity':0
    },600)

}
function gameOver() {
    if (!canMoveBottom()&&!canMoveTop()&&!canMoveLeft()&&!canMoveRight()){
        $('.gameOver-modal').css({
            'display':'block'
        })
        if (score>Number($('.best').text())){
            localStorage.setItem('score',score);
            $('.best').text(score);
        }
    }
}
function readStorage() {
    if (localStorage.score){
        $('.best').text(localStorage.score);
    }
}
function calculateWidth() {
    if (innerWidth<520){
        gap = 10;
        width=57.5;
        height=57.5;
    }
}


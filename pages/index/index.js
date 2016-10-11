//index.js
//获取应用实例
var app = getApp()
Page({
    data: {
        input: '',
        first: '0',
        second: '0',
        operateSymbol: '',
        result: 0
    },
    //展示输入
    showInput: function () {
        var that = this;
        var firstNum = that.data.first;
        var secondNum = that.data.second;
        var operationSymbol = that.data.operateSymbol;
        var finalInput = '';
        finalInput += firstNum;
        finalInput += operationSymbol === '' ? '' : (' ' + operationSymbol + ' ');
        finalInput += secondNum === '0' ? '' : secondNum;
        that.setData({
            input: finalInput
        });
    }, 
    //按下数字键
    tapNumber: function (event) {
        var that = this;
        var content = event.target.dataset.content;
        var firstNum = that.data.first;
        var secondNum = that.data.second;
        var operationSymbol = that.data.operateSymbol;
        //如果是0
        if (content === '0') {
            //存在运算符，针对第二个数
            if (operationSymbol && operationSymbol.length > 0) {
                if (secondNum === '0') {
                    return;
                }
                this.setData({
                    second: secondNum + content
                });
            } else {
                if (firstNum === '0') {
                  return;
                }
                that.setData({
                    first: firstNum + content
                });
            }
        }
        //如果是小数点
        if(content == '.'){
            //存在运算符，针对第二个数
            if (operationSymbol && operationSymbol.length > 0) {
                if (secondNum.indexOf('.') >= 0) {
                    return;
                } else {
                    that.setData({
                        second: secondNum + content
                    });
                }
            } else {
                //不存在操作运算符，针对第一个数
                if (firstNum.indexOf('.') >= 0) {
                    return;
                } else {
                    that.setData({
                        first: firstNum + content
                    });
                }
            }
        }
        //如果是数字
        if (/[1-9]/.test(content)) {
            if (operationSymbol && operationSymbol.length > 0) {
                that.setData({
                    second: (secondNum === '0' ? '' : secondNum) + content
                });
            } else {
                that.setData({
                    first: (firstNum === '0' ? '' : firstNum) + content
                });
            }
        }
        that.showInput();
    },
    //按下运算符
    tapOperateSymbol: function (event) {
        var that = this;
        var content = event.target.dataset.content;
        //如果是+-×÷操作运算符
        if (content == '÷' || content == '×' || content == '+' || content == '-') {
            that.setData({
                operateSymbol: content
            });
            that.showInput();
        } else {
            //如果是=操作符，则计算结果
            var firstNum = that.data.first;
            var secondNum = that.data.second;
            var operationSymbol = that.data.operateSymbol;
            var firstNumber = parseFloat(firstNum);
            var secondNumber = parseFloat(secondNum);
            that.calculate(firstNumber, secondNumber, operationSymbol);
        }
    },
    //计算结果
    calculate: function (first, second, operationSymbol) {
        var that = this;
        //是否计算的flag，参与计算后则置为false
        var flag = true;
        if (operationSymbol === '÷') {
            flag = false;
            if (second === 0) {
                that.setData({
                    result: '不是数字'
                });
                return;
            }
            var tempResult = first / second + '';
            if (tempResult.indexOf('\.') >= 0) {
                var length = tempResult.split('\.')[1].length;
                if (length > 6) {
                    tempResult = new Number(tempResult).toFixed(6);
                }
            }
            that.setData({
                result: tempResult
            });
        }
        if (operationSymbol === '×') {
            flag = false;

            var tempResult = first * second + '';
            if (tempResult.indexOf('\.') >= 0) {
                var length = tempResult.split('\.')[1].length;
                if (length > 6) {
                    tempResult = new Number(tempResult).toFixed(6);
                    //去掉小数点后多余的0
                    var integer = (tempResult + '').split('\.')[0];
                    var decimal = (tempResult + '').split('\.')[1];
                    decimal = that.removeZero(decimal);
                    tempResult = integer + '.' + decimal;
                }
            }
            that.setData({
                result: tempResult
            });
        }
        if (operationSymbol === '+') {
            flag = false;
            that.setData({
                result: first + second
            });
        }
        if (operationSymbol === '-') {
            flag = false;
            that.setData({
                result: first - second
            });
        }
        //没有运算符的情况下，按下=等号键，默认为第一个数本身
        if(operationSymbol === '') {
            that.setData({
                result: first
            });
        }
        //计算完之后，判断flag是否为true，如果为true则表明为进行计算，则不需要重置操作
        if (!flag) {
            that.setData({
                first: '0',
                second: '0',
                operateSymbol: '',
            });
        }
    },
    //清空
    clear: function () {
        var that = this;
        that.setData({
            input: '',
            first: '0',
            second: '0',
            operateSymbol: '',
            result: 0
        });
    },
    //删除上一个输入的字符
    removeLast: function () {
        var that = this;
        var firstNum = that.data.first;
        var secondNum = that.data.second;
        var operationSymbol = that.data.operateSymbol;
        
        if (secondNum && secondNum !== '0') {
            secondNum = secondNum.substring(0, secondNum.length - 1);
            that.setData({
                second: secondNum
            }); 
            that.showInput();
            return;
        }
        if (operationSymbol !== '') {
            operationSymbol = '';
            that.setData({
                operateSymbol: operationSymbol
            }); 
            that.showInput();
            return;
        }
        if (firstNum && firstNum !== '0') {
            firstNum = firstNum.substring(0, firstNum.length - 1);
            that.setData({
                first: firstNum
            });
            that.showInput();
            return;
        }
    },
    //正负数的切换
    positiveOrNegative: function () {
        var that = this;
        var firstNum = that.data.first;
        var secondNum = that.data.second;
        var operationSymbol = that.data.operateSymbol;
        var temp = '';
        //如果有操作符，则表示改变的是第二个数的正负
        if (operationSymbol && operationSymbol !== '') {
            //包含负号，则变为正数
            if (secondNum.indexOf('-') >= 0) {
                temp = secondNum.substring(1, secondNum.length);
            } else {
                //不包含负号，则变为负数
                temp = '-' + (secondNum === '0' ? '' : secondNum);
            }
            that.setData({
                second: temp
            });
        } else {
            //如果没有操作符，则表示改变的是第一个数的正负
            //包含负号，则变为正数
            if (firstNum.indexOf('-') >= 0) {
                temp = firstNum.substring(1, firstNum.length);
            } else {
                //不包含负号，则变为负数
                temp = '-' + (firstNum === '0' ? '' : firstNum);
            }
            that.setData({
                first: temp
            });
        }
        that.showInput();
    },
    removeZero: function (decimal) {
        var index = 0;
        for (var i = decimal.length - 1; i >=0; i--) {
            if(decimal.charAt(i) === '0') {
                ++index;
            } else {
                break;
            }
        }
        decimal = decimal.substring(0, decimal.length - index);
        return decimal;
    }
})

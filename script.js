
const OPERATORS = ["+", "-", "*", "/", "%"];
const EXPRESSION_SYMBOLS = [".", "(" , ")"];
var wasResolved = false;
var regExp = {
    lastNumber: /[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/g,
    fraction: /\.[0-9]*/gm
};

function calcButtonClick(newValue) {
    expression = document.querySelector(".calculator__display");

    switch (newValue) {
        case "%":
            dividend = regExp.lastNumber.exec(expression.value) || 0;
            fraction = dividend.toString().match(regExp.fraction);
            dividend = dividend[0]/100;
            // На всякий случай форматируем число, чтобы исправить
            // проблему с представлением числа 0.99/100 = 0.0098(9)
            if (fraction && fraction[0].length>1) {
                signZeroes = fraction[0].replace(".", "").length;
                dividend = dividend.toFixed(signZeroes + 2);
            }
            expression.value = expression.value.replace(regExp.lastNumber, dividend);
        break;

        // Удалем всю строчку
        case "Backspace":
        case "CE":
            expression.value = "";
            expression.placeholder = "0";
        break;

        // Если ничего в строке нет, то ставим "0." иначе просто добавляем точку
        case ".":
            lastChar = expression.value.slice(-1);
            lastNumber = expression.value.toString().match(regExp.lastNumber);
            if (lastChar != newValue) {
                if (expression.value == "") expression.value+= "0.";
            }
            if (lastNumber && !lastNumber[0].includes(".")) expression.value+=newValue;
        break;

        // Добавляем оператор или заменяем его на новый
        case "+":
        case "-":
        case "*":
        case "/":
            lastChar = expression.value.slice(-1);
            if (OPERATORS.includes(lastChar)) {
                expression.value = expression.value.replace(/.$/, newValue)
            }
            else {
                expression.value+=newValue;
            }
        break;

        // Не даем добавть много нулей подряд в пустую строку
        case "0":
            expression.value += expression.value != "" ? newValue : "";
        break;

        // Добавляем остальные числа [1-9]. Если уже решили пример,
        // то начинается новый, иначе продолжаем набор.
        default:
            if(wasResolved) expression.value = newValue;
            else expression.value += newValue;
    }
    wasResolved = false;
}

function resolveExpression () {
    display = document.querySelector(".calculator__display");
    if (display.value) {
        // Отловим ошибку, если пользователь случайно/нарочно
        // ввел что-то неправильное вроде "(((((2)" или поделил на 0
        try {
            answer = math.eval(display.value);
            if (answer === Infinity) throw new UserException("Ошибка в выражении");
            else display.value = Number.parseFloat(answer.toFixed(10));
            wasResolved = true;
        }
        catch {
            display.value = "";
            display.placeholder = "Ошибка в выражении"
        }
    }
}


document.addEventListener("keydown", (btn) => {
    if (OPERATORS.includes(btn.key)
        || EXPRESSION_SYMBOLS.includes(btn.key)
        || btn.key == "Backspace"
        || (!Number.isNaN(parseInt(btn.key)) && btn.key.length == 1)){
        calcButtonClick(btn.key);
    }
    else {
        if (btn.keyCode == 13) resolveExpression();
    }
})
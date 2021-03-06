$("form").on('submit', function () {
    return false
})

$("#inputString").keypress(function (event) {
    return (event.charCode >= 48 && event.charCode <= 57) || (event.charCode == 46 && !this.value.includes("."))
})

$("#resultString").keypress(function () {
    return false
})
$("#resultString").on('click', function () {
    this.select()
})
$(document).on('keydown', function (event) {
    if (event.ctrlKey) {
        return
    }

    let key = event.key.toLowerCase()

    if (!$('#inputString').is(':focus') && (!isNaN(key) || (key === "." && !$('#inputString').val().includes(".")))) {
        return $('#inputString').val($('#inputString').val() + key)
    }

    if (key === "enter") key = "="
    else if (key === "escape") key = "c"

    $(document).find("button").each(function () {
        if (this.textContent.toLowerCase().startsWith(key)) {
            this.click()
            this.classList.toggle("pressed")
            setTimeout(() => {
                this.classList.toggle("pressed")
            }, 100);
            return false
        }
    })

})
$("#input").on('click', 'button', function () {
    addInput(this.textContent)
});

/**
 * 
 * @param {String} key 
 */
function addInput(key) {
    switch (key.toLowerCase()) {
        case "+":
        case "-":
            operate(key);
            break;
        case "=":
            calculate();
            break;
        case "clear":
            $("#inputString").val("")
            $("#calcString").val("")
            $("#calcString").removeAttr("list")
            $("#resultString").val("")
            break;
        default:
            console.log(key)
            break;
    }
}

function operate(operator) {
    const value = parseFloat($("#inputString").val()).toString();
    if (!value || isNaN(value)) {
        return
    } else {
        let list = $("#calcString").attr("list")
        if (!list) {
            list = [operator === "-" ? operator + value : value]
        } else {
            list = $("#calcString").attr("list").split(",")
            list.push(operator, value)
        }
        $("#calcString").attr("list", list)
        $("#calcString").val(list.join(""))
        $("#inputString").val("")
        $("#resultString").val("")
    }
}

function calculate() {
    const list = $("#calcString").attr("list") ? $("#calcString").attr("list").split(",") : []
    $("#inputString").val("")
    $("#calcString").val("")
    $("#calcString").removeAttr("list")
    $("#resultString").val(calcArray(list))
}

function calcArray(array) {
    let index;
    if (array.length <= 1) {
        return parseFloat(array[0])
    } else if (array.includes('*') || array.includes('/')) {
        const firstIndex = array.indexOf("*")
        const secondIndex = array.indexOf("/")
        index = firstIndex < secondIndex ? firstIndex < 0 ? secondIndex : firstIndex : secondIndex < 0 ? firstIndex : secondIndex
    } else if (array.includes('+') || array.includes('-')) {
        const firstIndex = array.indexOf("+")
        const secondIndex = array.indexOf("-")
        index = firstIndex < secondIndex ? firstIndex < 0 ? secondIndex : firstIndex : secondIndex < 0 ? firstIndex : secondIndex
    }
    const operatorArray = {
        "*": (a, b) => {
            return a * b
        },
        "/": (a, b) => {
            return a / b
        },
        "+": (a, b) => {
            return a + b
        },
        "-": (a, b) => {
            return a - b
        },
    }
    const operator = array[index]
    const number = operatorArray[operator](parseFloat(array[index - 1]), parseFloat(array[index + 1]))
    array.splice(index - 1, 3, number)
    return calcArray(array)
}
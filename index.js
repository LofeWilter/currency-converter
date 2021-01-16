let firstCurrency = document.querySelector('#firstCurrency');
let secondCurrency = document.querySelector('#secondCurrency');
let firstCurencyValue = document.querySelector('#firstNumber');
let secondCurrencyValue = document.querySelector('#secondNumber');
let dynamicDropdownListOfCurrencies = document.querySelectorAll('.dropdown-content');
let twoCurrencies = document.querySelectorAll('.currencies');
let curs = [];

let state = {
    oldFirstCur: '',
    oldSecCur: '',
    firstCur: '',
    secCur: '',
    ratio: 0
}

fetch('https://free.currconv.com/api/v7/currencies?apiKey=f87b0c5a51eb45630250')
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        curs = Object.values(data.results).map(item => {
            return item
        })
        curs.forEach(item => {
            dynamicDropdownListOfCurrencies[0].innerHTML += `<a class="firCurrency" name=${item.id} >
            ${item.id} - ${item.currencyName}</a>`;
            dynamicDropdownListOfCurrencies[1].innerHTML += `<a class="secCurrency"  name=${item.id} >
            ${item.id} - ${item.currencyName}</a>`;
        })
    }); // geeting all currencies and render them to drop down 


document.addEventListener('click', (e) => {
    if (e.target.className == 'firCurrency') {
        firstCurrency.value = e.target.getAttribute('name');
        state.oldFirstCur = state.firstCur;
        state.firstCur = e.target.getAttribute('name');
        checkValues()
    }              // adding currency from dropdown to input onclick 
    else if (e.target.className == 'secCurrency') {
        secondCurrency.value = e.target.getAttribute('name');
        state.oldSecCur = state.secCur;
        state.secCur = e.target.getAttribute('name');
        checkValues()
    }
})


document.addEventListener('input', (e) => {
    if (e.target.className == 'currencies') {
        for (let i = 0; i < 2; i++) {
            if (e.target == twoCurrencies[i]) {
                dynamicDropdownListOfCurrencies[i].innerHTML = '';
                curs.forEach(item => {
                    if (item.id.indexOf(e.target.value.toUpperCase()) >= 0 && i == 0) {
                        dynamicDropdownListOfCurrencies[i].innerHTML += `<a class="firCurrency" name=${item.id}>${item.id} - ${item.currencyName}</a>`
                    }
                    else if (item.id.indexOf(e.target.value.toUpperCase()) >= 0 && i == 1) {
                        dynamicDropdownListOfCurrencies[i].innerHTML += `<a class="secCurrency" name=${item.id}>${item.id} - ${item.currencyName}</a>`
                    }
                })
            }
        }
    }   //     searching currencies and fetching dropdown items
})

document.addEventListener('input', e => {
    if (e.target.className == 'kekw123') {
        if (state.oldFirstCur === state.firstCur && state.oldSecCur === state.secCur) {
            checkValues(e.target.name, state.ratio)
        } else {
            checkValues(e.target.name, state.ratio)
        }
    }
})      /// addding values to state


function checkValues(param, oldRatio = false) {
    if (curs.some((item) => item.id === state.firstCur) && curs.some((item) => item.id === state.secCur)) {
        if (!oldRatio) {
            fetch(`https://free.currconv.com/api/v7/convert?apiKey=f87b0c5a51eb45630250&q=${state.firstCur}_${state.secCur}&compact=y`)
                .then((response) => {
                    return response.json();
                })
                .then(data => {
                    state.ratio = data[`${state.firstCur}_${state.secCur}`].val
                    secondCurrencyValue.value = (firstCurencyValue.value * state.ratio).toFixed(2);
                    render(firstCurencyValue.value, secondCurrencyValue.value);
                });
        }
        if (param == 1) {
            secondCurrencyValue.value = (firstCurencyValue.value * state.ratio).toFixed(2);
            render(firstCurencyValue.value, secondCurrencyValue.value);
        }
        else if (param == 2) {
            firstCurencyValue.value = (secondCurrencyValue.value / state.ratio).toFixed(2);
            render(firstCurencyValue.value, secondCurrencyValue.value);
        }
    }
}

function render(value1, value2) {
    document.querySelector('#firstNumInfo').innerHTML = value1;
    document.querySelector('#firstCurrencyInfo').innerHTML = state.firstCur + ' equals';
    document.querySelector('#secondNumInfo').innerHTML = value2;
    document.querySelector('#secondCurrencyInfo').innerHTML = state.secCur;
}




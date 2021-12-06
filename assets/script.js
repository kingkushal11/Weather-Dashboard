function showList() {
    list.innerHTML = '';
    for (let city of cities) {
        list.innerHTML += '<li onclick="search.value= \'' + city + '\'; searchcity()" class="cities">' + city + '</li>'
    }
}

// enable / disable search button
function validate() {
    if (search.value.trim().length) {
        btnEl.classList.remove('disabled')
        btnEl.classList.add('enabled')
        return true
    }
    else {
        btnEl.classList.remove('enabled')
        btnEl.classList.add('disabled')
        return false
    }
}

function searchcity() {
    error.innerHTML = ''
    results.style.display = 'none'
    if (btnEl.classList.contains('disabled')) {
        search.focus()
        return false
    }
    const searchval = search.value


    const links = 'https://api.openweathermap.org/data/2.5/weather?q=' + searchval + '&appid=' + apikey
    fetch(links).then(function (res) {
        return res.json()
    }).then(function (data) {
        if (data.cod == 200) {
            const link = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + data.coord.lat + '&lon=' + data.coord.lon + '&appid=' + apikey
            fetch(link).then(function (res) {
                return res.json()
            }).then(function (info) {
                console.log(info)
                // display <city> (<date>) <icon>
                current.querySelector('h2').innerHTML = search.value + ' (' + new Date(info.current.dt * 1000).toLocaleDateString("en-US") + ') ' + '<img class="icon" src="http://openweathermap.org/img/wn/' + info.current.weather[0].icon + '@2x.png">'
                // display details
                details.innerHTML = '<span>Temp: ' + info.current.temp + '°F</span><br>' +
                    '<span>Wind: ' + info.current['wind_speed'] + ' MPH</span><br>' +
                    '<span>Humidity: ' + info.current.humidity + ' %</span><br>' +
                    '<span>UV Index: <div id="uvi">' + info.current.uvi + '</div></span>'

                // 5-Day Forecast
                cards.innerHTML = ''
                for (let i = 1; i < Math.min(6, info.daily.length); i++) {
                    cards.innerHTML += '<div class="day"><h3>' + new Date(info.daily[i].dt * 1000).toLocaleDateString("en-US") + '</h3>' +
                        '<img class="icon" src="http://openweathermap.org/img/wn/' + info.daily[i].weather[0].icon + '@2x.png"><br>' +
                        '<span>Temp: ' + ((info.daily[i].temp.max + info.daily[i].temp.min) / 2).toFixed(2) + '°F</span><br>' +
                        '<span>Wind: ' + info.daily[i]['wind_speed'] + ' MPH</span><br>' +
                        '<span>Humidity: ' + info.daily[i].humidity + ' %</span><br>' +
                        '</div>'
                }

                results.style.display = 'block'
                if (cities.indexOf(search.value) == -1) {
                    cities.unshift(search.value)

                    if (cities.length > 10) {
                        cities.pop()
                    }

                    localStorage.cities = JSON.stringify(cities)
                    showList()
                }
            })
        }
        else {
            error.innerHTML = 'Sorry, we can\'t find a weather for <b>' + searchval + '</b>'
            search.focus()
            searchbtn.classList.remove('enabled')
            searchbtn.classList.add('disabled')
        }
    })
}
// variables
const apikey = '82ccbfcc5db7584829b51304b0040048'
const btnEl = document.querySelector('#searchbtn')
const search = document.querySelector('#search')
const error = document.querySelector('#error')
const list = document.querySelector('#list')
const current = document.querySelector('#current')
const details = document.querySelector('#details')
const fiveDays = document.querySelector('#fiveDays')
const cards = document.querySelector('#cards')
// event listeners
btnEl.addEventListener('click', searchcity)
search.addEventListener('input', validate)

// if ENTER key is pressed
search.addEventListener('keyup', function (event) {
    if (event.keyCode === 13 && validate()) {
        searchcity()
    }
})

// localStorage
let cities = [];
if (typeof localStorage.cities !== 'undefined') {
    cities = JSON.parse(localStorage.cities)
    showList()
}


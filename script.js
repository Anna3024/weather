const container = document.getElementById('forecast');
const btnWeather = document.getElementById('openWeather');
const cityID = 625144;

class WeatherWidget {
    constructor() {
        this.location = document.getElementById('location');
        this.temp = document.getElementById('temp');
        this.feel = document.getElementById('feel');
        this.descr = document.getElementById('descr');
        this.image = document.getElementById('image');
        this.wind = document.getElementById('wind');
        this.btnHide = document.getElementById('hide');
        this.waitImg = container.querySelector('#wait');
        this.events();
    }

    getWeather() {
        let apiUrl = "https://api.openweathermap.org/data/2.5/",
        apiKey = "e7020360eda2213f9134bfe61c28bdc2", //ваш apikey с сервиса
        apiQuery = apiUrl+"/weather?id=" + cityID + "&units=metric&lang=ru&appid="+apiKey;

        fetch(apiQuery)
        .then(response => response.json())
        .then(data => this.showWeather(data))
        .catch(error => console.error("Ошибка получение погоды. Причина: " + error));
    }

    getWeather3Days() {
        let apiUrl = "https://api.openweathermap.org/data/2.5/",
        apiKey = "e7020360eda2213f9134bfe61c28bdc2", //ваш apikey с сервиса
        apiQuery = apiUrl+"forecast?id=" + cityID + "&units=metric&lang=ru&appid="+apiKey;

        fetch(apiQuery)
        .then(response => response.json())
        .then(data => this.showWeather3days(data))
        .catch(error => console.error("Ошибка получение погоды. Причина: " + error));
    }

    showWeather(data) {
        container.style.right = "20px";
        this.location.innerText = "Погода в " + data.name + "e:";
        this.temp.innerText = Math.round(data.main.temp) + ' \u2103';
        this.feel.innerText = "Ощущается как "+ Math.round(data.main.feels_like) + ' \u2103';
        this.descr.innerText = data.weather[0].description;
        this.image.style.background = `url(http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png) center center no-repeat`;
        this.image.style.backgroundSize = "140%";
        this.wind.innerText = "Ветер " + this.windDirection(data.wind.deg) + data.wind.speed + " м/с";
    }

    showWeather3days(data) {
        this.btnHide.classList.remove('closed');
        this.waitImg.classList.add('closed');
        let dateForecastArr = container.querySelectorAll('.date');
        let imageForecastArr = container.querySelectorAll('.image');
        let tempForecastArr = container.querySelectorAll('.temp');
        let descrForecastArr = container.querySelectorAll('.descr');

        let now = new Date();
        let n=0; //номер в массиве для 12 часов следующего дня
        
        for (n; n<data.list.length; n++) {
            if (now.getDate()!=data.list[n].dt_txt.substr(8,2) && data.list[n].dt_txt.substr(11,2)==12) {
                break;
            }
        }
        for (let i=0; i<dateForecastArr.length; i++) {
            dateForecastArr[i].innerText = data.list[n].dt_txt.substr(0,10).split('-').reverse().join('-');
            imageForecastArr[i].style.background = `url(http://openweathermap.org/img/wn/${data.list[n].weather[0].icon}@2x.png) center center no-repeat`;
            imageForecastArr[i].style.backgroundSize = "140%";
            tempForecastArr[i].innerText = Math.round(data.list[n].main.temp) + ' \u2103';
            descrForecastArr[i].innerText = data.list[n].weather[0].description;
            n+=24/3; //через день с интервалом в 3 часа;
        }
        container.style.height = 540 + "px";
    }

    events() {
        btnWeather.addEventListener('click',(e) => {
            container.style.right = "20px";
            this.getWeather();
            btnWeather.classList.add('closed');
        })

        const close = container.querySelector(".modal__close");

        close.addEventListener('click', (e)=> {
            container.style.right = "-270px";
            let timerID = setTimeout(()=>{
                btnWeather.classList.remove('closed')
            },1000);
        })

        const moreWeather = container.querySelector('#moreWeather');
        
        moreWeather.addEventListener('click', (e) => {
            moreWeather.classList.add('closed');
            this.waitImg.classList.remove('closed');
            this.getWeather3Days();
        })

        this.btnHide.addEventListener('click', (e) => {
            this.btnHide.classList.add('closed');
            container.style.height = 230 + "px";
            moreWeather.classList.remove('closed');
        })

    }

    windDirection(degWind) {
        switch (Math.round(degWind/45)*45) {
            case 0:
            case 360: 
                return "северный ";
            case 45: 
                return "северо-восточный ";
            case 90: 
                return "восточный ";
            case 135: 
                return "юго-восточный ";
            case 180: 
                return "южный ";
            case 225: 
                return "юго-западный ";
            case 270: 
                return "западный ";
            case 315: 
                return "северо-западный ";
        }
    }
}

new WeatherWidget().getWeather();


    

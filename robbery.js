'use strict';

//Constants
const MINUTES_IN_DAY = 24 * 60;
const MINUTES_IN_WEEK = 7 * MINUTES_IN_DAY ;


/**
 * Сделано задание на звездочку
 * Реализовано оба метода и tryLater
 */
exports.isStar = true;

/**
 * @param {Object} schedule – Расписание Банды
 * @param {Number} duration - Время на ограбление в минутах
 * @param {Object} workingHours – Время работы банка
 * @param {String} workingHours.from – Время открытия, например, "10:00+5"
 * @param {String} workingHours.to – Время закрытия, например, "18:00+5"
 * @returns {Object}
 */
exports.getAppropriateMoment = function (schedule, duration, workingHours) {
    //console.info(schedule, duration, workingHours);

    /* Проходим по ключам объекта
    *  Для каждого ключа получаем значение
    *  Преобразуем значение в массив 0 и 1
    *  Складываем через логическое И с тем, что записано в массиве "Неделя"
    */

    const weekBinaryArray = getWeekBinaryArray(schedule);
    const weekBinaryArrayBank = objToBinaryArrayBankWeek(workingHours);

    return {
          /**
         * Найдено ли время
         * @returns {Boolean}
         */
        exists: function () {
            let searchBooleanResult = searchDuration(weekBinaryArray, weekBinaryArrayBank, duration);

            return searchBooleanResult !== -1
        },

        /**
         * Возвращает отформатированную строку с часами для ограбления
         * Например,
         *   "Начинаем в %HH:%MM (%DD)" -> "Начинаем в 14:59 (СР)"
         * @param {String} template
         * @returns {String}
         */
        format: function (template) {
            let searchResultTime = searchDurationTime(weekBinaryArray, weekBinaryArrayBank, duration);
            console.info()

           // const timeString = template.replace('%HH', );



            return template;
        },

        /**
         * Попробовать найти часы для ограбления позже [*]
         * @star
         * @returns {Boolean}
         */
        tryLater: function () {
            return false;
        }
    };
};

function getWeekBinaryArray(schedule, bankWorkingHours){
    let values = Object.keys(schedule).map(function(key) {
        return schedule[key];
    });

    let weekSchedule = [];
    weekSchedule=fillArr(weekSchedule, MINUTES_IN_WEEK, 1);

    values.forEach(function(item) {
        let personWeekScheduleArray = [];
        personWeekScheduleArray=fillArr(personWeekScheduleArray, MINUTES_IN_WEEK, 0);

        item.forEach(function (elem) {
            const binaryArray = objToBinaryArray(elem);
            personWeekScheduleArray = sumBinaryArrays(binaryArray, personWeekScheduleArray);
        });
        weekSchedule = multiplyBinaryArrays(personWeekScheduleArray, weekSchedule);
    });

        return weekSchedule;
}

function fillArr(arr, length, num) {
    for (let i = 0; i < length; i++) {
        arr.push(num);
    }

    return arr;
}


function objToBinaryArray(obj) {
    let numberFrom = robDateToNumber(obj.from);
    let numberTo = robDateToNumber(obj.to);
    let arr = [];
    arr = fillArr(arr, MINUTES_IN_WEEK, 0);

    for (let i = numberFrom; i < numberTo; i++) {
        arr[i] = 1;
    }

    return arr;
}

function robDateToNumber(robDate) {
    const dateArray = robDate.split(' ');
    const day = dateArray[0];
    const time = dateArray[1].split('+')[0];
    const timeZone = dateArray[1].split('+')[1];

    console.info('day: ' + day + ', time: ' + time + ', timeZone: ' + timeZone);

    return dayToMinutes(day) + timeToMinutes(time, timeZone);
}

function dayToMinutes(day) {
    const days = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

    return days.indexOf(day) * MINUTES_IN_DAY;
}

function timeToMinutes(time, timeZone) {
    const hh = Number(time.split(':')[0]);
    const mm = Number(time.split(':')[1]);
    const hhInTimeZone = hh - Number(timeZone);

    return hhInTimeZone * 60 + mm;
}

function sumBinaryArrays(arr1, arr2) {
    let sumArr = [];
    for (let i = 0; i < MINUTES_IN_WEEK; i++) {
        sumArr.push(arr1[i] || arr2[i]);
    }

    return sumArr;
}

function multiplyBinaryArrays(arr1, arr2) {
    let resultArr = [];
    for (let i = 0; i < MINUTES_IN_WEEK; i++) {
        resultArr.push(arr1[i] && arr2[i]);
    }

    return resultArr;
}

function searchDuration(weekBinaryArrSchedule, weekBinaryArrBank, duration) {
    let searchArr = multiplyBinaryArrays(weekBinaryArrSchedule, weekBinaryArrBank);
    let counter = 0;
    for (let i = 0; i < searchArr.length; i++) {

        if (searchArr[i] === 0) {
            counter++;
            if (counter === duration) {
                return i - duration + 1;
            }
        }
        else {
            counter = 0;
        }
    }
    return -1;
}

function objToBinaryArrayBankWeek(obj) {
    let numberFrom = stringTimeToNumberBankDay(obj.from);
    let numberTo = stringTimeToNumberBankDay(obj.to);
    let BinaryArrayBankWeek = [];
    BinaryArrayBankWeek = fillArr(BinaryArrayBankWeek, MINUTES_IN_WEEK, 1);
    for (let i = 1; i < 8; i++) {
        for (let y = numberFrom * i; y < numberTo * i; y++) {
            BinaryArrayBankWeek[y-1] = 0;
        }
    }

    return BinaryArrayBankWeek;
}

function stringTimeToNumberBankDay(stringTime) {
    const timeStringArray = stringTime.split(':');
    const timeHH = Number(timeStringArray[0]);
    const timeMM = Number(timeStringArray[1].split('+')[0]);
    const timeZone = Number(timeStringArray[1].split('+')[1]);

    return timeHH-timeZone * 60 + timeMM;

}

function searchDurationTime (weekBinaryArray, weekBinaryArrayBank, duration) {
    let value = searchDuration(weekBinaryArray, weekBinaryArrayBank, duration);
    console.info(value);
}

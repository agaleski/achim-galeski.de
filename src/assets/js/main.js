/*
 * Custom JavaScript with functions for this project.
 */

const translations = {
    'en': {
        'years':  [ ' Year ', ' Years ' ],
        'months': [ ' Month', ' Months' ],
        'today':  'today'
    },
    'de': {
        'years':  [ 'Jahr ', ' Jahre ' ],
        'months': [ 'Monat', ' Monate' ],
        'today':  'heute'
    }
}

/**
 * Takes given start and end date-strings and calculates the time difference in
 * year(s) and month(s).
 *
 * @param start
 * @param end
 * @param showDates
 * @param lang
 *
 * @returns {string}
 */
const getTimeDifference = (start, end = null, showDates = false, lang = 'en') => {
    const startDate = new Date(start),
        endDate   = end ? new Date(end) : new Date();
    let years   = 0,
        months  = 0,
        result  = ''
    ;

    /* Get the amount of years between the years of the 2 dates. */
    years = endDate.getFullYear() - startDate.getFullYear();
    /* Detract 1 year in case startDate month & endDate month are not 12 months apart. */
    years = endDate.getMonth() < startDate.getMonth() ? years - 1 : years;
    /* Get the amount of months between the months of the 2 dates. */
    months = endDate.getMonth() - startDate.getMonth();
    /*
     * In case months is negative due to something like 2 (February) - 6 (June),
     * add the full year (12 months) in between and detract the difference found.
     */
    months = months < 0 ? 12 + months : months;
    /* Add another full month, in case the end date is after half of the month. */
    months = endDate.getDate() > 14 ? months + 1 : months;
    /* If after all of this, months is bigger than 12, add another year. */
    years = years + parseInt((months / 12).toString().substring(0,1));
    /* Get now the remaining months after dividing by 12. */
    months = (months + 12 * years) % 12;
    /* Now build the result string. */
    if (showDates) {
        result += startDate.toLocaleDateString() + ' - ';
        result += end ? endDate.toLocaleDateString()  : translations[lang].today;
        result += ' | ';
    }
    result += years > 0 ? years + translations[lang].years[Number(years > 1)] : '';
    result += months > 0 ? months + translations[lang].months[Number(months > 1)] : '';

    return result;
}

/**
 * Iterates through all ".date" class elements, greps date strings from data attributes
 * and sets time-string text content of each element.
 *
 * @returns {void}
 */
const setTimeStrings = () => {
    document.querySelectorAll('.date')
        .forEach((elem) => {
            elem.innerHTML = getTimeDifference(
                elem.getAttribute('data-start'),
                elem.getAttribute('data-end'),
                elem.getAttribute('data-show'),
                document.querySelector('html').getAttribute('lang')
            );
        });
}

let menuLinks = document.querySelectorAll('aside ul a');
let sections  = document.querySelectorAll('main section');

/**
 * Simple ScrollSpy implementation.
 * Uses global, once par page load generated element lists for efficiency.
 */
window.onscroll = () => {
    sections.forEach((section, i) => {
        if (section.getBoundingClientRect().y < window.innerHeight - (screen.height / 10 * 5)) {
            menuLinks.forEach((a) => {
                a.classList.remove('active');
            })
            return menuLinks[i+1].classList.add('active');
        }
    });
}
document.addEventListener("DOMContentLoaded", setTimeStrings);

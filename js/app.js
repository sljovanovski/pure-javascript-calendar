var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var smallDayNames = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
var activeYear;
var activeMonth;


function init() {
    bindMonth(new Date().getFullYear(), new Date().getMonth());
    activeYear = new Date().getFullYear();
    activeMonth = new Date().getMonth();
}

function bindMonth(year, month) {

    /* get days of month */
    var daysOfMonth = countDays(year, month);

    var i = 1;
    var days;

    var rows = [];
    var weeks = document.getElementById("weeks");
    var monthName = document.getElementById("monthName");

    /* fill up the current month and the previous month */
    for (; i <= daysOfMonth; i++) {

        /* set month name and year at the top of the calendar */
        monthName.textContent = monthNames[new Date(year, month).getMonth()] + " " + year;

        if (!days) {
            days = [];
        }

        /* get TODAY from daysOfMonth */
        var currentDate;
        currentDate = new Date(year, month, i);
        var d = new Date();

        /* if current day from weekDays is equel to TODAY - mark as today with CSS class */
        if (currentDate.getTime() === new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()) {
            days.push('<div class="small-1 medium-1 large-1 day today pointer" data-date="' + currentDate + '"  onclick="onDayClick(this)">' + currentDate.getDate() + '</div>');
        } else {
            days.push('<div class="small-1 medium-1 large-1 day pointer" data-date="' + currentDate + '"  onclick="onDayClick(this)">' + currentDate.getDate() + '</div>');
        }

        /* get the days from the previous month */
        if (currentDate.getDay() === 0) {
            if (rows.length === 0) {

                /* calculate remaining Days */
                var remainingDays = 7 - days.length;
                var prevMonth = month - 1;

                /* count the days of the previous month */
                var daysOfLastMonth = countDays(year, prevMonth);

                /* fill up the days from the previous month */
                while (remainingDays > 0) {
                    currentDate = new Date(year, prevMonth, daysOfLastMonth);
                    days.unshift('<div class="small-1 medium-1 large-1 day pointer previous-month" data-date="' + currentDate + '"  onclick="onDayClick(this)">' + currentDate.getDate() + '</div>');
                    daysOfLastMonth--;
                    remainingDays--;
                }
            }

            /* create one week and clean up the days Array */
            rows.push("<li class='week'>" + days.join("") + "</li>");
            days = null;
        }
    }

    /* fill up the days from the next month */
    i = 1;
    while (rows.length < 6) {
        if (!days) {
            days = [];
        }

        do {
            currentDate = new Date(year, month + 1, i);
            days.push('<div class="mall-1 medium-1 large-1 day pointer next-month" data-date="' + currentDate + '"  onclick="onDayClick(this)">' + currentDate.getDate() + '</div>');
            i++;
        } while (currentDate.getDay() !== 0);
        rows.push("<li class='week'>" + days.join("") + "</li>");
        days = [];
    }

    /* set the days header starting from Monday */
    /* put 2 to start from Tuesday, 3 for Wednesday etc... */
    var cDay = 1;
    var weekDays = [];
    while (weekDays.length < 7) {
        weekDays.push(cDay);
        cDay++;
        if (cDay === 7) {
            cDay = 0;
        }
    }

    /* map the weekdays into a div */
    weekDays = weekDays.map(function (day) {
        return "<div class='small-1 medium-1 large-1 day'>" +
            "<span class='show-for-medium-up'>" + dayNames[day] + "</span>" +
            "<span class='show-for-small'>" + smallDayNames[day] + "</span>" +
            "</div>";
    });

    document.getElementById("dayHeader").innerHTML = weekDays.join("");

    weeks.innerHTML = rows.join("");
}

function prevMonth() {
    var d = new Date(activeYear, activeMonth - 1);
    bindMonth(d.getFullYear(), d.getMonth());
    activeYear = d.getFullYear();
    activeMonth = d.getMonth();
}

function nextMonth() {
    var d = new Date(activeYear, activeMonth + 1);
    bindMonth(d.getFullYear(), d.getMonth());
    activeYear = d.getFullYear();
    activeMonth = d.getMonth();
}

/* on day click do something */
function onDayClick(date) {
    alert("Do something here " + date.dataset.date);
}

/* count the days of the month including Leap Year */
function countDays(year, month) {
    var i = 1;
    var currentDate = new Date(year, month, i);
    month = currentDate.getMonth();
    year = currentDate.getFullYear();

    while (currentDate.getMonth() === month) {
        i++;
        currentDate = new Date(year, month, i);
    }

    return i - 1;
}
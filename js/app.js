var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var smallDayNames = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
var activeYear;
var activeMonth;
var events = [];

function init() {
    /* var event = {
     id: 1,
     title: "pero",
     description: "descr",
     date: "Tue Sep 01 2015 00:00:00 GMT+0200 (CEST)"
     };

     var event2 = {
     id: 2,
     title: "bobi",
     description: "descr",
     date: "Tue Sep 01 2015 00:00:00 GMT+0200 (CEST)"
     };

     var event3 = {
     id: 3,
     title: "pero",
     description: "descr",
     date: "Wed Sep 02 2015 00:00:00 GMT+0200 (CEST)"
     };

     events.push(event, event2, event3);*/
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

        var eventsForDay = loadEventsForDay(currentDate);
        var eventLabel = "";
        if (eventsForDay.length > 0) {
            for (var j = 0; j < eventsForDay.length; j++) {
                eventLabel += "<label class='event' " +
                    "data-date='" + eventsForDay[j].date + "' " +
                    "data-descr='" + eventsForDay[j].description + '' + "' " +
                    "data-label='true'" +
                    "id='" + eventsForDay[j].id + "'" +
                    "' onclick='return onDayClick(this)" +
                    "'>" + eventsForDay[j].title + "</label>";
            }
        }

        /* if current day from weekDays is equel to TODAY - mark as today with CSS class */
        if (currentDate.getTime() === new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()) {
            days.push('<div class="small-1 medium-1 large-1 day today" id="' + friendlyUrl(currentDate) + '">' + currentDate.getDate() + " <small data-date='" + currentDate + "' onclick='onDayClick(this)' title='Create new'><span class='small right new-event pointer'>+</span></small>" + eventLabel + '</div>');
        } else {
            days.push('<div class="small-1 medium-1 large-1 day" id="' + friendlyUrl(currentDate) + '">' + currentDate.getDate() + " <small data-date='" + currentDate + "' onclick='onDayClick(this)' title='Create new'><span class='small right new-event pointer'>+</span></small>" + eventLabel + '</div>');
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

                    eventsForDay = loadEventsForDay(currentDate);
                    eventLabel = "";
                    if (eventsForDay.length > 0) {
                        for (var j = 0; j < eventsForDay.length; j++) {
                            eventLabel += "<label class='event' " +
                                "data-date='" + eventsForDay[j].date + "' " +
                                "data-descr='" + eventsForDay[j].description + '' + "' " +
                                "data-label='true'" +
                                "id='" + eventsForDay[j].id + "'" +
                                "' onclick='return onDayClick(this)" +
                                "'>" + eventsForDay[j].title + "</label>";
                        }
                    }

                    days.unshift('<div class="small-1 medium-1 large-1 day  previous-month" id="' + friendlyUrl(currentDate) + '">' + currentDate.getDate() + " <small data-date='" + currentDate + "' onclick='onDayClick(this)' title='Create new'><span class='small right new-event pointer'>+</span></small>" + eventLabel + '</div>');
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
            eventsForDay = loadEventsForDay(currentDate);
            eventLabel = "";
            if (eventsForDay.length > 0) {
                for (var j = 0; j < eventsForDay.length; j++) {
                    eventLabel += "<label class='event' " +
                        "data-date='" + eventsForDay[j].date + "' " +
                        "data-descr='" + eventsForDay[j].description + '' + "' " +
                        "data-label='true'" +
                        "id='" + eventsForDay[j].id + "'" +
                        "' onclick='return onDayClick(this)" +
                        "'>" + eventsForDay[j].title + "</label>";
                }
            }
            days.push('<div class="mall-1 medium-1 large-1 day next-month" id="' + friendlyUrl(currentDate) + '">' + currentDate.getDate() + " <small data-date='" + currentDate + "' onclick='onDayClick(this)' title='Create new'><span class='small right new-event pointer'>+</span></small>" + eventLabel + '</div>');
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
function onDayClick(selectedDate) {
    var date = new Date(selectedDate.dataset.date);
    var day = dayNames[date.getDay()];
    document.getElementById("titleDay").textContent = day + " " + date.toLocaleDateString();
    var popup = $('#popup').popup();
    document.getElementById("btnSave").dataset.date = selectedDate.dataset.date;
    if (selectedDate.dataset.label) {
        document.getElementById("btnSave").dataset.label = selectedDate.dataset.label;
        document.getElementById("btnSave").dataset.eventid = selectedDate.id;
    }
    fillPopup(selectedDate);
    popup.open();
}

function closePopup() {
    var popup = $('#popup').popup();
    clearPopup();
    popup.close();
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

function onFocus(input) {
    input.className = "edit-label-focus";
}

function onFocusOut(input) {
    input.className = "edit-label";
}

function resizeTextArea() {
    var text = document.getElementById("editArea");
    text.style.height = 'auto';
    text.style.height = text.scrollHeight + 'px';
}

function clearPopup() {
    document.getElementById("editText").value = "";
    document.getElementById("editArea").value = "";
    var elm = document.getElementById("btnSave");
    delete elm.dataset.date;
    if (elm.dataset.label) {
        delete elm.dataset.label;
        delete elm.dataset.eventid;
    }
}

function fillPopup(selectedDate) {
    if (selectedDate.dataset.label) {
        document.getElementById("editText").value = selectedDate.textContent;
        document.getElementById("editArea").value = selectedDate.dataset.descr;
    } else {
        document.getElementById("editText").value = "";
        document.getElementById("editArea").value = "";
    }
}

function addEvent(selectedDate) {
    var title = document.getElementById("editText").value;
    var description = document.getElementById("editArea").value;
    var date = new Date(selectedDate.dataset.date);

    if (selectedDate.dataset.label) {
        for (var i = 0; i < events.length; i++) {
            if (events[i].id === Number(selectedDate.dataset.eventid)) {
                document.getElementById(selectedDate.dataset.eventid).textContent = title;
                document.getElementById(selectedDate.dataset.eventid).dataset.descr = description;
                events[i].title = title;
                debugger;
                events[i].description = description;
                break;
            }
        }
    } else {
        var event = {
            id: Number(events.length) + 1,
            title: title,
            description: description,
            date: date
        };
        events.push(event);
        for (var i = 0; i < events.length; i++) {
            if (events[i].date === event.date) {
                document.getElementById(friendlyUrl(event.date)).innerHTML += "<label class='event' " +
                    "data-date='" + event.date + "' " +
                    "data-descr='" + event.description + '' + "' " +
                    "data-label='true'" +
                    "id='" + event.id + "'" +
                    "' onclick='return onDayClick(this)" +
                    "'>" + event.title + "</label>";
            }
        }
    }
    closePopup();
}

function loadEventsForDay(day) {
    var eventsForDay = [];
    for (var i = 0; i < events.length; i++) {
        if (events[i].date.toString() === day.toString()) {
            eventsForDay.push(events[i]);
        }
    }
    return eventsForDay;
}

function onEventClick(event) {
    var date = new Date(event.dataset.date);
    var day = dayNames[date.getDay()];
    document.getElementById("titleDay").textContent = day + " " + date.toLocaleDateString();
    document.getElementById("editText").value = event.value;
    document.getElementById("editArea").value = event.dataset.descr;
    var popup = $('#popup').popup();
    popup.open();
}

function friendlyUrl(text) {
    return text.toString().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "-").replace(/^-+|-+$/g, '');
}
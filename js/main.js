var personalMode = 0;
var jQueryLoad = 0;
var newsCycle = 1;
var smallWeather = 0;
var darkMode = 0;
var rainToday = 0;
var tempWeather;
var globHours = 0;
var newsTimeout1;
var newsTimeout2;
var dontEnable = false;
setTimeout(function(){
    if(jQueryLoad == 0)
    {
        startTime();
        initialize();
    }

},2000);

function pushBulletSetup()
{
    PushBullet.APIKey = "v1Qnaiw2UD65C8QBlHtI9hAartFy7uia29ujyAL2eWFQy";
    //var res = PushBullet.devices();
    //console.log("pushing!");
    PushBullet.push('link', null, 'johnmlee101@gmail.com', {title: "Reddit Link", url: news[newsCycle].data.url, body: "Your MirrorMirror Link"}, function(err, res) {
        if(err) {
            throw err;
        } else {
            //console.log(res);
        }
    });

    $("#body").append("<p id='pb' class='error'>Sent via pushbullet!</p>");

    setTimeout(function() {
        $("#pb").remove();
    }, 300);
}

function updateNews(){

    var url = 'http://www.reddit.com/r/upliftingnews.json?jsonp=jsonCallback&limit=50';
    $.ajax({
       type: 'GET',
       url: url,
       timeout: 2000,
       jsonpCallback: 'jsonCallback',
       contentType: "application/json",
       dataType: 'jsonp',
       success: function(json) {
        //console.log(json);
        news = json.data.children;
    },
    error: function(e) {
       console.log(e.message);
   }
});
}
setTimeout(function(){
    initialize();
    startTime();
    getNews();


    //getCalendar("");
},100);
setTimeout(function(){
    //getNews();
    // setTimeout(function(){
        if(news == '')
        {
            updateNews();
            setTimeout(function(){
                startNews();
            },2000);
        }
        else
        {
            startNews();
        }
        faceListener();
    // },1000)
},1000)

function startTime(){
    var time = new Date();
    var hours = time.getHours();
    globHours = hours;
    var minute = time.getMinutes();
    var seconds = time.getSeconds();
    var day = time.getDate();
    var dayName = time.getDay();
    var month = time.getMonth();
    if (hours == 0)
    {
        hours = 12;
    }
    if (minute < 10)
    {
        minute = "0" + minute;
    }
    if (seconds < 10)
    {
        seconds = "0" + seconds;
    }


    if(dayName == 0)
    {
        dayName = "Sun"
    }
    else if (dayName == 1)
    {
        dayName = "Mon"
    }
    else if (dayName == 2)
    {
        dayName = "Tue"
    }
    else if (dayName == 3)
    {
        dayName = "Wed"
    }
    else if (dayName == 4)
    {
        dayName = "Thu"
    }
    else if (dayName == 5)
    {
        dayName = "Fri"
    }
    else if(dayName == 6)
    {
        dayName = "Sat";
    }

    if(month == 0)
    {
        month = "Jan";
    }
    else if (month == 1)
    {
        month = "Feb";
    }
    else if (month == 2)
    {
        month = "Mar";
    }
    else if (month == 3)
    {
        month = "Apr";
    }
    else if (month == 4)
    {
        month = "May";
    }
    else if (month == 5)
    {
        month = "Jun";
    }
    else if (month == 6)
    {
        month = "Jul";
    }
    else if (month == 7)
    {
        month = "Aug";
    }
    else if (month == 8)
    {
        month = "Sept";
    }
    else if (month == 9)
    {
        month = "Oct";
    }
    else if (month == 10)
    {
        month = "Nov";
    }
    else if (month == 11)
    {
        month = "Dec";
    }
    $("#title").html(hours + ":" + minute + ":" + seconds);
    $("#date").html(dayName + " <b>" + day + " </b>" + month);
    jQueryLoad = 1;
    setTimeout(function(){
        startTime();
    },1000);
}
var news = '';
function getNews(){
    var url = 'http://www.reddit.com/r/upliftingnews.json?jsonp=jsonCallback&limit=50';
    $.ajax({
       type: 'GET',
       url: url,
       timeout: 2000,
       jsonpCallback: 'jsonCallback',
       contentType: "application/json",
       dataType: 'jsonp',
       success: function(json) {
        //console.log(json);
        news = json.data.children;
        //startNews();
    },
    error: function(e) {
       console.log(e.message);
   }
});
    setTimeout(function(){
        getNews();
    },(1000*60*30));
}
function startNews(){
    if(newsCycle == news.length)
    {
        newsCycle = 0;
    }
    if(newsCycle == -1)
    {
        newsCycle = news.length - 1;
    }
    if(personalMode == 0)
    {
        $("#message").html(news[newsCycle].data.title);
        $("#message").css("opacity",1);
        newsTimeout1 = setTimeout(function(){
            $("#message").css("opacity",0);
        },9000);
        newsTimeout2 = setTimeout(function(){
            startNews(++newsCycle);
        },10000);
    }

}

function initialize(){
    var url = 'http://api.openweathermap.org/data/2.5/find?q=West_Lafayette&callback=weatherGet';
    $.ajax({
     type: 'GET',
     url: url,
     async: false,
     timeout: 2000,
     jsonpCallback: 'jsonCallback',
     contentType: "application/json",
     dataType: 'jsonp',
     success: function(json) {
        changeWeather(json.list[0]);
        tempWeather = json.list[0];
            //jQueryLoad = 1;
        },
        error: function(e) {
         console.log(e.message);
         //initialize();
     }
 });

    url = 'http://api.openweathermap.org/data/2.5/forecast/daily?q=West_Lafayette&cnt=1&callback=weatherGet';
    $.ajax({
     type: 'GET',
     url: url,
     async: false,
     timeout: 2000,
     jsonpCallback: 'jsonCallback',
     contentType: "application/json",
     dataType: 'jsonp',
     success: function(json) {
        var reg = /Rain/;
        if (reg.exec(json.list[0].weather[0].main) != null)
        {
            rainToday = 1;
        }
        else{
            rainToday = 0;
        }
            //jQueryLoad = 1;
        }
    });


    setTimeout(function(){
        initialize();
    },10000);
}

function changeWeather(json){
    //console.log(json);
    var icon = json.weather[0].icon;
    //icon = "01d"
    var temperature = Math.round((json.main.temp - 273.15)*(9/5)+32);
    var outside = '';
    if (smallWeather == 0)
    {
        outside = json.weather[0].description;
        var splitO = outside.split(' ');
        outside = '';
        for (i = 0; i < splitO.length; i++)
        {
            outside = outside + " " + splitO[i].replace(splitO[i][0], splitO[i][0].toUpperCase())
        }
    }
    $("#temperature").html(temperature + "°F - " + outside);
    getWeatherIcon(icon);
}
function getWeatherIcon(icon) {
    if (icon == "04n" || icon == "04d" || icon == "03n" || icon == "03d" || icon == "50n" || icon == "50d")
    {
        $("#temperature").append("  <img id='weatherIcon' height=50px src='img/cloudy.png'>")
    }
    else if (icon == "02d" || icon == "02n")
    {
        $("#temperature").append("  <img id='weatherIcon' height=50px src='img/slightCloud.png'>")
    }
    else if (icon == "01d" || icon == "01n")
    {
        $("#temperature").append("  <img id='weatherIcon' height=50px src='img/sun.png'>")
    }
    else if (icon == "09n" || icon == "09d" || icon == "10n" || icon == "10d")
    {
        $("#temperature").append("  <img id='weatherIcon' height=50px src='img/rain.png'>")
    }
    else if (icon == "11n" || icon == "11d")
    {
        $("#temperature").append("  <img id='weatherIcon' height=50px src='img/thunder.png'>")
    }
    else if (icon == "13n" || icon == "13d")
    {
        $("#temperature").append("  <img id='weatherIcon' height=50px src='img/snow.png'>")
    }
    else
    {
        $("#temperature").append("  <img id='weatherIcon' height=50px src='img/sun.png'>")
    }

}

function getCalendar(url){
    var userNum;
    // $.get(
    //     'http://www.corsproxy.com/www.google.com/calendar/feeds/johnmlee101%40gmail.com/private-80b8fb2cf3fd34f615edfa06770d2151/basic',
    //     function(response) {
    //         console.log(response);
    //         xmlDoc = response;
    //         $xml = $( xmlDoc );
    //         var title = [];
    //         var content = [];
    //         $title = $xml.find( "title" ).each(function(idx,v){
    //             title.push(v);
    //         });
    //         $content = $xml.find( "content" ).each(function(idx,v){
    //             v = new XMLSerializer().serializeToString(v).split(">")[1].split("&lt;br")[0];
    //             console.log(v)
    //             content.push(v);
    //         });
    //         for (i = 1; i < title.length; i++)
    //         {
    //             $("#calendarHolder").append(title[i]);
    //             $("#calendarHolder").append(" - " );
    //             $("#calendarHolder").append(content[i-1]);
    //             $("#calendarHolder").append("<br>");
    //         }
    //         console.log($title.text());
    //     });
if(url == 0)
{
    userNum = 1;
}
else
{
    userNum = 0;
}
var json = [{
    "events":
    [
    {
        "startTime":"8:00",
        "endTime":"10:15",
        "title":"Working on Code",
        "location":"The Office"
    },
    {
        "startTime":"16:30",
        "endTime":"17:30",
        "title":"Meeting with Matt",
        "location":"Cafe"
    }
    ]
},
{
    "events":
    [
    {
        "startTime":"9:30",
        "endTime":"10:00",
        "title":"Delicious Breakfast",
        "location":"My Belly"
    },
    {
        "startTime":"11:00",
        "endTime":"12:00",
        "title":"Generate Llama DNA",
        "location":"EE 14"
    },
    {
        "startTime":"16:30",
        "endTime":"17:30",
        "title":"Meeting with John",
        "location":"Cafe"
    }
    ]
}];
for(i = 0; i < json[userNum].events.length; i++)
{
    $("#calendarHolder").append("<div class='calendarEvent'>" + json[userNum].events[i].title + " | " + json[userNum].events[i].startTime + " - " + json[userNum].events[i].endTime + " | " + json[userNum].events[i].location +  "<br></div>");
}
//console.log(json)
}

function enablePersonal(name){
    personalMode = 1;
    smallWeather = 1;
    changeWeather(tempWeather);
    checkForRain();
    // var name = "John"
    // $("#message").html("Hello " + name + "...");
    // $("#message").css("opacity",1);
    // setTimeout(function(){
    //     $("#message").css("opacity",0);
    // },2000);
    //setTimeout(function(){
        $("#calendar").animate({ opacity: 1 }, 1000);
        $("#calendar").css("marginTop","0px");
        $("#bus").animate({ opacity: 1 }, 1000);
        $("#bus").css("marginTop","0px");
        $("#title").css("fontSize", "3em");
        $("#date").css("fontSize", "1em");
        if (globHours < 11)
        {
            readme("Good Morning" + name + "! Here is your information.");
        }
        else if (globHours < 17)
        {
            readme("Good Afternoon" + name + "! Here is your information.");
        }
        else
        {
            readme("Good Evening" + name + "! Here is your information.");
        }
        if(rainCheck == 1)
        {
            setTimeout(function(){
                readme("Today has a chance to rain. Bring an umbrella.");
            },5000);
        }
        var stop = '59081';
    var route = '1817';  //INSERT CODE FOR PERSONAL INFO HERE
    var dark = 0;
    if (dark == 1)
    {
        toggleDarkMode();
    }
    if(name == 'nick')
    {
        getCalendar(1);
    }
    else
    {
        getCalendar(0);
    }

    getBusStop(stop, route);
    $("#message").css("opacity",0);
    //},3000);
}
function disablePersonal(){
    personalMode = 0;
    smallWeather = 0;
    changeWeather(tempWeather);
    $("#calendar").css("marginTop","400px");
    $("#calendar").animate({ opacity: 0 }, 1000);
    $("#bus").css("marginTop","400px");
    $("#bus").animate({ opacity: 0 }, 1000);
    $("#title").css("fontSize", "4em");
    $("#date").css("fontSize", "2em");
    $("#rainCheck").css("opacity","0");
    startNews();
    if(darkMode == 1)
    {
        toggleDarkMode();
    }
    setTimeout(function(){
        $("#calendarHolder").empty();
        $("#busTime").empty();
        $("#rainCheck").empty();
    },1000)

}

function getBusStop(stop, route) {
    $("#busTime").append("<br>");
    $.getJSON('http://www.corsproxy.com/citybus.doublemap.com/map/v2/eta?stop=' + stop, function (json) {
        data = json.etas[stop].etas;
        $.each(data, function(i, item) {
            if (data[i].route == route) {
                $("#busTime").append(data[i].avg + " minutes<br>");
            }
        });
    });
    //$("#busTime").append("10 minutes" + "<br>");
    //$("#busTime").append("42 minutes" + "<br>");
}

function toggleDarkMode()
{
    if(darkMode == 0)
    {
        $("body").css("background","#fff");
        $("body").css("color","#000");
        $("img").css("-webkit-filter", "invert(100%)");
        $("img").css("opacity",0);
        $("img").animate({ opacity: 1 }, 1000);
        darkMode = 1;
    }
    else {
        $("body").css("background","#000");
        $("body").css("color","#fff");
        $("img").css("-webkit-filter", "");
        $("img").css("opacity",0);
        $("img").animate({ opacity: 1 }, 1000);
        darkMode = 0;
    }
}

function checkForRain(){
    if (rainToday == 1)
    {
        $("#rainCheck").html("Bring an Umbrella. It will rain today.")
        $("#rainCheck").css("opacity","1");
    }
}

/*
/ This section is for text to voice.
/
/
/
/
/
*/
function html5_audio(){
    var a = document.createElement('audio');
    return !!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''));
}

var play_html5_audio = false;
if(html5_audio()) play_html5_audio = true;

function play_sound(url){
    if(play_html5_audio){
        var snd = new Audio(url);
        snd.load();
        snd.play();
    }else{
        $("#sound").remove();
        var sound = $("<embed id='sound' type='audio/mpeg' />");
        sound.attr('src', url);
        sound.attr('loop', false);
        sound.attr('hidden', true);
        sound.attr('autostart', true);
        $('body').append(sound);
    }
}
function readme(txt){
    play_sound("http://translate.google.com/translate_tts?ie=UTF-8&q="+encodeURIComponent(txt)+"&tl=en&total=1&idx=0prev=input");
}
//----------------------------------------------------------------------


var leapEnable = 1;
var say = true;

setTimeout(function(){
    var controller = Leap.loop({enableGestures: true, background: true}, function(frame){
      if(frame.valid && frame.gestures.length > 0 && leapEnable == 1){
        gesture = frame.gestures[0]
        switch (gesture.type){
          case "circle":
            //console.log("Circle Gesture");
            leapEnable = 0;
            if (personalMode == 0) {
                var swipe;
                console.log(gesture);
                newsCycle++;
                clearTimeout(newsTimeout1);
                clearTimeout(newsTimeout2);
                $("#message").css("opacity",0);
                //swipe = 'r';
                $("#message").animate({
                    left: '-120%'
                },450);
                setTimeout(function(){$("#message").css("left","120%");},500);
                setTimeout(function(){
                    $("#message").animate({
                        left: '5%'
                    },500);
                    startNews();
                },500);
            } else {
                if (say) {
                    say = false
                    console.log("EASTER EGG");
                    readme("What I mean is, you're not a king yet.");
                    setTimeout(function(){
                        readme("But you can become one.");
                    }, 2200);
                    setTimeout(function(){
                        readme("All you have to do is marry a princess.");
                    }, 4200);
                    setTimeout(function(){
                        say = true;
                    }, 8000);
                }
            }
            break;
        case "keyTap":
            //console.log("Key Tap Gesture");
            //console.log(gesture);
            //toggleDarkMode();
            //pushBulletSetup();
            leapEnable = 0;
            break;
            case "screenTap":
            //console.log("Screen Tap Gesture");
            //console.log(gesture);
            if(personalMode == 1)
            {
                clearTimeout(newsTimeout1);
                clearTimeout(newsTimeout2);
                disablePersonal();
                clearInterval(listenTimer);
                setTimeout(function(){
                    faceListener();
                },10000);
                dontEnable = false;
            }
            else if (personalMode == 0 && leapEnable == 1)
            {
                pushBulletSetup();
            }
            leapEnable = 0;
            break;
            case "swipe":
            var swipe;
            //console.log("Swipe Gesture");
            //console.log(gesture);

            clearTimeout(newsTimeout1);
            clearTimeout(newsTimeout2);
            $("#message").css("opacity",0);
            if(gesture.position[0]-gesture.startPosition[0] > 0)
            {
                newsCycle--;
                //swipe = 'r';
                $("#message").animate({
                    left: '120%'
                },450)
                setTimeout(function(){$("#message").css("left","-120%");},500);
            }
            else
            {
                newsCycle++;
                //swipe = 'l';
                $("#message").animate({
                    left: '-120%'
                },450);
                setTimeout(function(){$("#message").css("left","120%");},500);
            }

            setTimeout(function(){
                $("#message").animate({
                    left: '5%'
                },500);
                startNews();
            },500);
            leapEnable = 0;
            break;
        }
        setTimeout(function(){
            leapEnable = 1;
        },1000);
    }

    });
},1000);

// function faceListener()
// {
//     $.get("time.txt",function(data){
//         console.log(data);
//         var now = new Date();
//         now = Math.round(now.getTime() / 1000);
//         if((now - data) < 5)
//         {
//             if(personalMode == 0)
//             {
//                 $.get("face.txt",function(name){

//                     enablePersonal(name);
//                     setTimeout(function(){
//                         //faceListener();
//                         if(personalMode == 1)
//                         {
//                             //disablePersonal();

//                             $.get("time.txt",function(data2){
//                                 var now2 = new Date();
//                                 now2 = Math.round(now2.getTime() / 1000);
//                                     $.get("face.txt",function(name2){

//                                         if (name =! name2 || (now-data)>5)
//                                         {
//                                             disablePersonal();
//                                             faceListener();
//                                         }
//                                         else
//                                         {
//                                             setTimeout(function(){

//                                                 disablePersonal();
//                                                 setTimeout(function(){
//                                                     faceListener();
//                                                 },1000);
//                                             },28000);
//                                         }
//                                     },"text");
//                             },"text");

//                         }
//                         else
//                         {
//                             faceListener();
//                         }
//                     },30*1000);
//                 },"text");
//             }
//         }
//         else
//         {
//             setTimeout(function(){
//                 faceListener();
//             },2000);
//         }
//     },"text");

//         // Display the contents of the file.

// }

function now() {
    return Math.round(new Date().getTime()/1000);
}
var listenTimer;
function faceListener() {

    dontEnable = false;
    listenTimer = setInterval(function(){

        $.get("time.txt", function(time){

            console.log(now() - time);

            if ((now() - time) < 20) {
                $.get("face.txt",function(name){
                    if (!dontEnable) enablePersonal(name);
                    dontEnable = true;
                }, "text");
            } else {
                if (personalMode == 1) {
                    disablePersonal();
                    dontEnable = false;
                }

            }

        }, "text");

    }, 2000);
}


setTimeout(function() {

 $$("body").swipeRight(function() { 
    clearTimeout(newsTimeout1);
    clearTimeout(newsTimeout2);
    $("#message").css("opacity",0);
    newsCycle--;
    //swipe = 'r';
    $("#message").animate({
        left: '120%'
    },450)
    setTimeout(function(){$("#message").css("left","-120%");},500);
    setTimeout(function(){
        $("#message").animate({
            left: '5%'
        },500);
        startNews();
    },500);
  });

 $$("body").swipeLeft(function() { 
    clearTimeout(newsTimeout1);
    clearTimeout(newsTimeout2);
    $("#message").css("opacity",0);
    newsCycle++;
    //swipe = 'l';
    $("#message").animate({
        left: '-120%'
    },450);
    setTimeout(function(){$("#message").css("left","120%");},500);
    setTimeout(function(){
        $("#message").animate({
            left: '5%'
        },500);
        startNews();
    },500);
});
 $$("body").tap(function(){
    alert("push would be made now")
 });

},1000);


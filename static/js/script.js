$(function() {
    // WA COUNTIES
    var counties = new L.GeoJSON.AJAX("static/spatial_data/wa_county_boundaries.geojson",{
        style: function (feature){
            return {
                color: '#000000',
                weight: 1,
                fillOpacity: 0,
            };
        },
        pane: "boundaries",
    });  

    // DNR REGIONS
    var regions = new L.GeoJSON.AJAX("static/spatial_data/wa_dnr_regions.geojson",{
        style: function (feature){
            return {
                color: '#000000',
                weight: 1,
                fillOpacity: 0,
            };
        },
        pane: "boundaries",
    });

    // Map base layers
    var baseLayers = {
        "Terrain": L.esri.basemapLayer("Topographic"),
        "Topographic": L.esri.basemapLayer("USATopo"),
        "Imagery": L.esri.basemapLayer("Imagery")
    };

    // Array of helibase locations
    var markersList = [
        [45.6937848, -122.4164044, 'Camp Bonneville', '', '346'],
        [48.4016864, -122.2438621, 'Big Lake', '', '152'],
        [48.545324, -117.882157, 'Colville', '(63S)', '1888'],
        [45.6193552,-121.1682757, 'Dallesport', '(KDLS)', '247'],
        [47.9670556,-117.4285833, 'Deerpark', '(KDEW)', '2211'],
        [47.0330278,-120.5306944, 'Ellensburg', '(KELN)', '1763'],
        [47.9377183,-124.3959206, 'Forks', '(S18)', '299'],
        [46.9711944,-123.9365556, 'Hoquiam', '(KHQM)', '18'],
        [47.3676417,-120.2045417, 'Malaga', '', '802'],
        [46.9694044,-122.9025447, 'Olympia', '(KOLM)', '208'],
        [48.1201944,-123.4996944, 'Port Angeles', '(KCLM)', '291'],
        [46.7416914,-117.1116192, 'Pullman', '(KPUW)', '2567'],
        [46.5681667,-120.5440556, 'Yakima', '(KYKM)', '1099'],
      ];

    function toTitleCase(str) {
        return str.replace(/(?:^|\s)\w/g, function(match) {
            return match.toUpperCase();
        });
    }

    function degToCompass(num) {
        var val = Math.floor((num / 22.5) + 0.5);
        var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
        return arr[(val % 16)];
      }
    
    // Array of icon overrides if needed  
    var wiToOWM = { "200": "thunderstorm", "201": "thunderstorm", "202": "thunderstorm", "210": "lightning", "211": "lightning", "212": "lightning", "221": "lightning", "230": "thunderstorm", "231": "thunderstorm", "232": "thunderstorm", "300": "sprinkle", "301": "sprinkle", "302": "rain", "310": "rain-mix", "311": "rain", "312": "rain", "313": "showers", "314": "rain", "321": "sprinkle", "500": "sprinkle", "501": "rain", "502": "rain", "503": "rain", "504": "rain", "511": "rain-mix", "520": "showers", "521": "showers", "522": "showers", "531": "storm-showers", "600": "snow", "601": "snow", "602": "sleet", "611": "rain-mix", "612": "rain-mix", "615": "rain-mix", "616": "rain-mix", "620": "rain-mix", "621": "snow", "622": "snow", "701": "showers", "711": "smoke", "721": "day-haze", "731": "dust", "741": "fog", "761": "dust", "762": "dust", "771": "cloudy-gusts", "781": "tornado", "800": "day-sunny", "801": "cloudy-gusts", "802": "cloudy-gusts", "803": "cloudy-gusts", "804": "cloudy", "900": "tornado", "901": "storm-showers", "902": "hurricane", "903": "snowflake-cold", "904": "hot", "905": "windy", "906": "hail", "957": "strong-wind", "day-200": "day-thunderstorm", "day-201": "day-thunderstorm", "day-202": "day-thunderstorm", "day-210": "day-lightning", "day-211": "day-lightning", "day-212": "day-lightning", "day-221": "day-lightning", "day-230": "day-thunderstorm", "day-231": "day-thunderstorm", "day-232": "day-thunderstorm", "day-300": "day-sprinkle", "day-301": "day-sprinkle", "day-302": "day-rain", "day-310": "day-rain", "day-311": "day-rain", "day-312": "day-rain", "day-313": "day-rain", "day-314": "day-rain", "day-321": "day-sprinkle", "day-500": "day-sprinkle", "day-501": "day-rain", "day-502": "day-rain", "day-503": "day-rain", "day-504": "day-rain", "day-511": "day-rain-mix", "day-520": "day-showers", "day-521": "day-showers", "day-522": "day-showers", "day-531": "day-storm-showers", "day-600": "day-snow", "day-601": "day-sleet", "day-602": "day-snow", "day-611": "day-rain-mix", "day-612": "day-rain-mix", "day-615": "day-rain-mix", "day-616": "day-rain-mix", "day-620": "day-rain-mix", "day-621": "day-snow", "day-622": "day-snow", "day-701": "day-showers", "day-711": "smoke", "day-721": "day-haze", "day-731": "dust", "day-741": "day-fog", "day-761": "dust", "day-762": "dust", "day-781": "tornado", "day-800": "day-sunny", "day-801": "day-cloudy-gusts", "day-802": "day-cloudy-gusts", "day-803": "day-cloudy-gusts", "day-804": "day-sunny-overcast", "day-900": "tornado", "day-902": "hurricane", "day-903": "snowflake-cold", "day-904": "hot", "day-906": "day-hail", "day-957": "strong-wind", "night-200": "night-alt-thunderstorm", "night-201": "night-alt-thunderstorm", "night-202": "night-alt-thunderstorm", "night-210": "night-alt-lightning", "night-211": "night-alt-lightning", "night-212": "night-alt-lightning", "night-221": "night-alt-lightning", "night-230": "night-alt-thunderstorm", "night-231": "night-alt-thunderstorm", "night-232": "night-alt-thunderstorm", "night-300": "night-alt-sprinkle", "night-301": "night-alt-sprinkle", "night-302": "night-alt-rain", "night-310": "night-alt-rain", "night-311": "night-alt-rain", "night-312": "night-alt-rain", "night-313": "night-alt-rain", "night-314": "night-alt-rain", "night-321": "night-alt-sprinkle", "night-500": "night-alt-sprinkle", "night-501": "night-alt-rain", "night-502": "night-alt-rain", "night-503": "night-alt-rain", "night-504": "night-alt-rain", "night-511": "night-alt-rain-mix", "night-520": "night-alt-showers", "night-521": "night-alt-showers", "night-522": "night-alt-showers", "night-531": "night-alt-storm-showers", "night-600": "night-alt-snow", "night-601": "night-alt-sleet", "night-602": "night-alt-snow", "night-611": "night-alt-rain-mix", "night-612": "night-alt-rain-mix", "night-615": "night-alt-rain-mix", "night-616": "night-alt-rain-mix", "night-620": "night-alt-rain-mix", "night-621": "night-alt-snow", "night-622": "night-alt-snow", "night-701": "night-alt-showers", "night-711": "smoke", "night-721": "day-haze", "night-731": "dust", "night-741": "night-fog", "night-761": "dust", "night-762": "dust", "night-781": "tornado", "night-800": "night-clear", "night-801": "night-alt-cloudy-gusts", "night-802": "night-alt-cloudy-gusts", "night-803": "night-alt-cloudy-gusts", "night-804": "night-alt-cloudy", "night-900": "tornado", "night-902": "hurricane", "night-903": "snowflake-cold", "night-904": "hot", "night-906": "night-alt-hail", "night-957": "strong-wind" };
    
    const getDayNight = (sunrise, sunset) => {
        const now = Date.now();
        if (now> sunrise && now< sunset) {
          return "day-";
        } else {
          return "night-";
        }
      };

    // Fetches weather data from OpenWeather
    function getWeatherData(lat, lon, name, stn, elev){

        map.spin(true);

        var settings = {
            "url": "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=f84507e41b97f2982944724f01ebee4e&units=imperial&exclude=minutely,hourly",
            "method": "GET",
            "timeout": 0,
          };
    
          $.ajax(settings).done(function (response) {

            time_now = moment()

            //WEATHER ICON
            $('#weather_icon').html("<i class='wi wi-" + wiToOWM[getDayNight(response.current.sunrise*1000, response.current.sunset*1000) + response.current.weather[0].id] + "'></i>")

            // CURRENT WEATHER
            $(".station_name").text(name + ' ' + stn);
            $(".latitude").html(response.lat.toFixed(3) + '&deg;N');
            $(".longitude").html(response.lon.toFixed(3) + '&deg;W');
            $(".elevation").html(elev + 'ft.');
            $('.current_temp').html(Math.round(response.current.temp) + '&deg;F');
            $('.feels_temp').html('Feels like ' + Math.round(response.current.feels_like) + '&deg;F');
            $('.current_cc').html(response.current.clouds + '%');
            $('.current_humidity').html(response.current.humidity + '%');
            if(response.current.visibility === undefined){
                $('.current_vis').html('Unavailable');
            }else{
                $('.current_vis').html(Math.round(response.current.visibility * 0.000621371) + ' mi.');
            }
            $('.current_conditions').html(toTitleCase(response.current.weather[0].description));
            $('.current_wind').html(degToCompass(response.current.wind_deg) + ' ' + Math.round(response.current.wind_speed) + ' MPH')
            $('.current_time').html(moment.unix(response.current.dt).from(time_now));


            // TODAY FORECAST
            $('#day1_date').html(moment.unix(response.daily[0].dt).format("dddd, MMMM Do"));
            $('#day1_weather').html(toTitleCase(response.daily[0].weather[0].description));
            $('#day1_high').html(Math.round(response.daily[0].temp.max) + '&deg;F');
            $('#day1_low').html(Math.round(response.daily[0].temp.min) + '&deg;F');
            $('#day1_rh').html(response.daily[0].humidity + '%');
            $('#day1_ws').html(degToCompass(response.daily[0].wind_deg) + ' ' + Math.round(response.daily[0].wind_speed) + ' MPH')
            $('#day1_cc').html(response.daily[0].clouds + '%');
            $('#day1_ss').html(moment.unix(response.daily[0].sunset).format("HH:mm") + ' ' + 'Local');
           
            // TOMORROW FORECAST
            $('#day2_date').html(moment.unix(response.daily[1].dt).format("dddd, MMMM Do"));
            $('#day2_weather').html(toTitleCase(response.daily[1].weather[0].description));
            $('#day2_high').html(Math.round(response.daily[1].temp.max) + '&deg;F');
            $('#day2_low').html(Math.round(response.daily[1].temp.min) + '&deg;F');
            $('#day2_rh').html(response.daily[1].humidity + '%');
            $('#day2_ws').html(degToCompass(response.daily[1].wind_deg) + ' ' + Math.round(response.daily[1].wind_speed) + ' MPH')
            $('#day2_cc').html(response.daily[1].clouds + '%');
            $('#day2_ss').html(moment.unix(response.daily[1].sunset).format("HH:mm") + ' ' + 'Local');

            // NEXT DAY FORECAST
            $('#day3_date').html(moment.unix(response.daily[2].dt).format("dddd, MMMM Do"));
            $('#day3_weather').html(toTitleCase(response.daily[2].weather[0].description));
            $('#day3_high').html(Math.round(response.daily[2].temp.max) + '&deg;F');
            $('#day3_low').html(Math.round(response.daily[2].temp.min) + '&deg;F');
            $('#day3_rh').html(response.daily[2].humidity + '%');
            $('#day3_ws').html(degToCompass(response.daily[2].wind_deg) + ' ' + Math.round(response.daily[2].wind_speed) + ' MPH')
            $('#day3_cc').html(response.daily[2].clouds + '%');
            $('#day3_ss').html(moment.unix(response.daily[2].sunset).format("HH:mm") + ' ' + 'Local');
            
            map.spin(false);

        });  
    }

    // Home point
    var home = {
        lat: 47.3902606,
        lng: -120.528331,
        zoom: 6
    };

    // Actual map instance
    var map = L.map('mapdiv', {
        center: [home.lat, home.lng],
        zoom: home.zoom,
        minZoom: 6,
        layers: [regions],
        attributionControl: false,
        cursor: false
    });

    // Get initial map bounds for easybutton later
    map_bounds = map.getBounds();

    // Add a basemap to map
    baseLayers.Terrain.addTo(map);

    // Create panes for z-index issues
    map.createPane('boundaries');
    map.createPane('points');

   // Set zoom control to bottom right
   map.zoomControl.setPosition('topright');    

   // Add helibase locations to map
   for (var i = 0; i < markersList.length; i++) {
    marker = new L.marker([markersList[i][0], markersList[i][1]], {
        lat: markersList[i][0],
        lon: markersList[i][1],
        name: markersList[i][2],
        stn: markersList[i][3],
        elev: markersList[i][4],
        icon: L.divIcon({
            html: '<i class="fas fa-square text-dnr-blue"></i>',
            iconSize: [15, 15],
            className: 'myDivIcon'
        }),
        pane: 'points'
    })
        .addTo(map).on('click', function(e){
            getWeatherData(this.options.lat, this.options.lon, this.options.name, this.options.stn, this.options.elev);
        });
        
    }

    // Initial conditions loaded for KOLM
    getWeatherData(markersList[9][0], markersList[9][1], markersList[9][2], markersList[9][3], markersList[9][4]);

    // Add a button for zooming to home view on click
    L.easyButton('fa-home', function (btn, map) {
            map.fitBounds(map_bounds);

    }, 'Zoom to home', {
        position: 'bottomright'
    }).addTo(map);

});
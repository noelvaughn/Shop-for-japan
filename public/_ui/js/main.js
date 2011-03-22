var SL = SL || {};

(function(SL) {

    SL.constants = {
        GMAP_ID: "ABQIAAAAEgyYb53gc7yDlYay6uk30RT2yXp_ZAY8_ufC3CFXhHIE1NvwkxQeJSluYa5Wu6QsEWTJ5MSMy_T9jA"
    }

    SL.map = function() {
        var that = this;
        
        if (Modernizr.geolocation){
            $(".sharingLocationFunctionality").css("display", "block");
            $(".sharingLocationFunctionalityInline").css("display", "inline")
            $("#geoLocationLink").click(function() {
                that.getGeoLocation(that.zoomInOnLocation);
            });
        }

        $("#searchLocation").submit(function(e) {
            e.preventDefault();
            var value = $("#searchLocationField").val();
            that.addressToGeocode(value, that.zoomBasedOnInput);
        });

        this.init()

    }

    SL.map.prototype.init = function() {
        var that = this;
        var options = {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: new google.maps.LatLng(47.604359, -122.329779),
            zoom: 2
        }

        this.map = new google.maps.Map(document.getElementById("map_canvas"), options)
        
        $.getJSON("/map_markers.json", function(data) {
            data.companies.forEach(function(item) {
              that.createMarker(that.convertToLatLong(item.latitude, item.longitude, item));
            })
        })

    }

    SL.map.prototype.getGeoLocation = function(callback) {
        $("#mapSpinner").removeClass("displaynone");
        var that = this;
        navigator.geolocation.getCurrentPosition(function(position) {
            callback.apply(that, [[position.coords.latitude, position.coords.longitude]]);
            $("#mapSpinner").addClass("displaynone");
         });
    }

    SL.map.prototype.zoomBasedOnInput = function(location) {
      var coords = [];
      var counter = 0;
      $.each(location.geometry.location, function(value) {
          if (counter < 2) {
          coords[counter] = location.geometry.location[value]
          }
          counter++
          });
      this.zoomInOnLocation(coords);
    }

    SL.map.prototype.zoomInOnLocation = function(location) {
        this.map.setZoom(11);
        this.map.setCenter(new google.maps.LatLng(location[0], location[1]));
    }

    SL.map.prototype.convertToLatLong = function(lat, long, response) {
      var object = new google.maps.LatLng(lat, long);  
      object.nameOfLocation = response.name;
      object.donation_percent = response.donation_percent;
      object.full_address = response.full_address;
      object.website = response.website;
      return object
    }

    SL.map.prototype.getMarker = function(response) {
        var that = this;
        var marker = new google.maps.Marker({
            map: that.map,
            position: response
        });
        return marker;
    }

    SL.map.prototype.createMarker = function(response) {

        var marker = this.getMarker(response);
        this.createInfoWindows(marker, response);
    }

    SL.map.prototype.marker = function() {
        var marker = this.getMarker(response);
        this.createInfoWindows(marker, response);
    }

    SL.map.prototype.addressToGeocode = function(address, callback, name) {
        var geocoder = new google.maps.Geocoder();
        var that = this;
        geocoder.geocode({'address': address}, function(response) {
            if (name !== "undefined") {
                response[0].nameOfLocation = name;
            }
            callback.apply(that, [response[0]]);
        });
    }

    SL.map.prototype.createInfoWindows = function(marker, response) {
        var that = this;
        var infowindow = new google.maps.InfoWindow({
            content: Mustache.to_html(SL.map.templates.marker, response)
        });

        google.maps.event.addListener(marker, "click", function() {
            infowindow.open(that.map, marker);
        });
    }

    SL.map.templates = {
        marker: "<h2>{{nameOfLocation}}</h2><p>{{full_address}}</p><p>Percent pledged: {{donation_percent}}%</p><a class='block' target='_blank' href='{{website}}'>{{website}}</a>"
    }

    SL.startApplication = (function() {
        window.japanMap = new SL.map();
        $('#searchLocationField').example("Search");
    })();	



})(SL);


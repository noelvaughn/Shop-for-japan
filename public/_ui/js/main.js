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
      object.online = response.online;
      object.retail = response.retail;
      object.comments = response.comments;
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
marker: "<h2>{{nameOfLocation}}</h2><p>{{full_address}}</p><p>Percent pledged: {{donation_percent}}%</p><p>Comments: {{comments}}</p><p>Online store?: {{online}}</p><p>Retail store?: {{retail}}</p><a class='block' target='_blank' href='{{website}}'>{{website}}</a><br /><a target='_blank' href='http://twitter.com/share?url={{website}}&text={{nameOfLocation}} is #shopforjapan'><img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAwNJREFUeNqUVDtTU0EUPnvvhiQgTiIzRjREUSAIWmhj4Th2WjI2+guo1F7HRu2csfMxPgo7Gy1trCj0F8iAgCFCRCE6AiGEm+Q+1u/cvTcPEEd25mT37p79zne+czaCgpFJp08n0pmsp2hPwxBEpaXC7OLS0iR/C/45cig1ePXB0xddmeyQsUdAF1YpzMy9uXV9/PtKMSeP9qVPjd1//OzstbHz5wzt8L9DBDZhjx6+4pmvJh7euS17+o6dFJnsQMYhqoKdBwcVmAhm4x+gJpz6celTZngg0T80KpXnKeW6bhnUOkgDMtBwJ1EcSPMW0ZqjtdoNcBN3heu4wPGkCDa3sBnH2gGlpNTGI4UohSqRbAEUoh1wy9MzB5V8aCIxC5tbALNh+2XzArN0VbsEtteUgoGq+I4Ife4HjuCkhk1LKR/QUY0GoC6T6HJPswh8ZCGbDyVFG5BC4m5dCR9QMySN7gTsGJitdUS26RdBBgchRbFOFAtah0n5DJl2B1Y/aogUpFD3dooftic3fgUIeRSriplZ/sJ+p9ASSIaNYlWBY9HRerVquIxAr38qkgEoZ8JFCHX0u0JqDNGa8j5siiDt1hT50qqtswiry0ziZqgyfGRLUUKNOg3tGVXtKXPbXExopmHafke4Wp4wwg5A02g+CdaIBWcwvnTpQHtVON13v5UfhM+F0Wx8H4IrxAzj+GeImopM2PuSR+VdHjb790bBBn58h3tVQq9GH8qgMDasirWHeQX7zzc8OhMTNIgU2CcsTAmVm4TYhsmPAvpyHzfaBiMqTZMv1HDqYLZ8YEGbmN8iddfW0fmtdwAxhpQTOOsO2ojlikqAmKZhfFtYmF7Pz+aSSUQATS9mkA2zwGwTVkGDrcNWYWtxfMNsrNmHfTm1JIq2lp/JLebmpnwpe1OpgbuPnrzs7s8OWkgKWlMNDHmuw8MWOtWI0gyZaQzPNMrtA+7lrzNf7t28Mb5cLOYa5RsdGbmQOX4i6217Geovf6otMxeYCvn5z1PT0x95448AAwD59iEG5WwOCQAAAABJRU5ErkJggg==' alt='twitter this' />&nbsp; Share this on Twitter</a>"
    }

    SL.startApplication = (function() {
        window.japanMap = new SL.map();
        $('#searchLocationField').example("Search");
    })();	



})(SL);


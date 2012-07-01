// Para obtener una introducción a la plantilla En blanco, consulte la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    WinJS.strictProcessing();
    var map;

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                
            } else {
                
                
            }

            //args.setPromise(WinJS.UI.processAll());
            args.setPromise(WinJS.UI.processAll().then(function () {
                Microsoft.Maps.loadModule('Microsoft.Maps.Map', { callback: initMap });
                centerPosition();
            }));
            var button = document.getElementById("setPosition");
            button.addEventListener("click", buttonClickHandler, false);
        }
    };

    

    function buttonClickHandler(eventInfo) {

        centerPosition();
    }


    //function initialize() {
    //    Microsoft.Maps.loadModule('Microsoft.Maps.Map', { callback: initMap });
    //}
    //document.addEventListener("DOMContentLoaded", initialize, false);

    function initMap() {
        try {
            //document.querySelector('#changeMapType').addEventListener('click', changeMapType, false);
            //document.querySelector('#setLocation').addEventListener('click', centerPosition, false);

            var mapOptions =
            {
                credentials: "AjvpK9GXgOIPEO85JMqePbalHG1CgpQh73gISBXKR2HmKAYzAynw24ButKX2nNSo",
                center: new Microsoft.Maps.Location(50, 50),
                //mapTypeId: Microsoft.Maps.MapTypeId.road,
                mapTypeId: Microsoft.Maps.MapTypeId.aerial,
                showBreadcrumb: false,
                showDashboard:false,
                showMapTypeSelector: false,
                showScalebar: true,
                disableBirdseye: true,
                zoom: 5
            };

            var mapDiv = document.querySelector("#mapdiv");
            mapDiv.addEventListener('click', tapped, false);
            map = new Microsoft.Maps.Map(mapDiv, mapOptions);
            map.setOptions({ height: 400, width: 400 });

        }
        catch (e) {
            var md = new Windows.UI.Popups.MessageDialog(e.message);
            md.showAsync();
        }
    }

    function tapped(location) {
        var mapCenter = map.getCenter();
        var pos = map.tryPixelToLocation(new Microsoft.Maps.Point(location.clientX, location.clientY), Microsoft.Maps.PixelReference.control);
        mapCenter.latitude = pos.latitude;
        mapCenter.longitude = pos.longitude;
        map.setView({ center: mapCenter });

        var pin = new Microsoft.Maps.Pushpin({ latitude: pos.latitude, longitude: pos.longitude }, {
            icon: '/images/star.png',
            anchor: new Microsoft.Maps.Point(8, 8)
        });

        map.entities.clear();
        map.entities.push(pin);
    }

    function centerPosition() {
        var geolocator = new Windows.Devices.Geolocation.Geolocator();
        geolocator.getGeopositionAsync().then(function (loc) {
            var mapCenter = map.getCenter();
            mapCenter.latitude = loc.coordinate.latitude;
            mapCenter.longitude = loc.coordinate.longitude;

            map.setView({ center: mapCenter, zoom: 15 });

            addPushPin(mapCenter);
        });
    }

    function addPushPin(location) {
        map.entities.clear();
        var pushpin = new Microsoft.Maps.Pushpin(location, null);
        map.entities.push(pushpin);
    }

    app.oncheckpoint = function (args) {
        // TODO: Esta aplicación está a punto de suspenderse. Guardar cualquier estado
        // que deba mantenerse a través de las suspensiones aquí. Puede usar el
        // objeto WinJS.Application.sessionState, que se guarda y se restaura
        // automáticamente en las suspensiones. Si debe completar una
        // operación asincrónica antes de suspenderse la aplicación, llame a
        // args.setPromise().
    };

    app.start();

   



})();

// Para obtener una introducción a la plantilla En blanco, consulte la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    WinJS.strictProcessing();
    var map;
    var template = Windows.UI.Notifications.ToastTemplateType.toastText01;

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: Esta aplicación se ha iniciado recientemente. Inicializar
                // la aplicación aquí.
            } else {
                // TODO: Esta aplicación se ha reactivado tras estar suspendida.
                // Restaurar el estado de la aplicación aquí.
            }
            //incidentList = new WinJS.Binding.List();
            //var publicMembers = { ItemList: articlesList };
            //WinJS.Namespace.define("C9Data", publicMembers);


            args.setPromise(WinJS.UI.processAll().then(function () {
                Microsoft.Maps.loadModule('Microsoft.Maps.Map', { callback: initMap });
                centerPosition();
            }));

            var button = document.getElementById("btnPos");
            button.addEventListener("click", buttonClickHandler, false);


            var combo = document.getElementById("mapType");
            combo.addEventListener("change", comboChange, false);
        }
    };

    function comboChange() {
        var type = map.getMapTypeId();
        switch (mapType.value) {
            case 'road':
                type = Microsoft.Maps.MapTypeId.road;
                break;
            case 'birdseye':
                type = Microsoft.Maps.MapTypeId.birdseye;
                break;
            case 'aerial':
                type = Microsoft.Maps.MapTypeId.aerial;
                break;
            default:

                //var toastXml = Windows.UI.Notifications.ToastNotificationManager.getTemplateContent(template);
                //var toastTextElements = toastXml.getElementsByTagName("text");
                //toastTextElements[0].appendChild(toastXml.createTextNode("Hello World!"));

                //toastXml.setAttribute("duration", "long");

                type = Microsoft.Maps.MapTypeId.road;
                break;

        }
        map.setView({ mapTypeId: type });
    }

    function buttonClickHandler(eventInfo) {

        centerPosition();
    }

    //function initialize() {
    //    Microsoft.Maps.loadModule('Microsoft.Maps.Map', { callback: initMap });
    //}
    //document.addEventListener("DOMContentLoaded", initialize, false);

    function initMap() {
        try {

            var mapOptions =
            {
                credentials: "AjvpK9GXgOIPEO85JMqePbalHG1CgpQh73gISBXKR2HmKAYzAynw24ButKX2nNSo",
                center: new Microsoft.Maps.Location(50, 50),
                //mapTypeId: Microsoft.Maps.MapTypeId.road,
                mapTypeId: Microsoft.Maps.MapTypeId.aerial,
                showBreadcrumb: false,
                showDashboard: false,
                showMapTypeSelector: false,
                showScalebar: true,
                disableBirdseye: true,
                enableSearchLogo: false,
                enableClickableLogo: false,
                zoom: 5

            };

            var mapDiv = document.querySelector("#mapdiv");
            mapDiv.addEventListener('click', tapped, false);
            map = new Microsoft.Maps.Map(mapDiv, mapOptions);
            map.setOptions({ height: 350, width: 400 });

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

            document.getElementById("lon").innerText = loc.coordinate.longitude;
            document.getElementById("lat").innerText = loc.coordinate.latitude;
        });
    }

    //function trackloc() {
    //    if (loc == null) loc = window.navigator.geolocation;
    //    if (loc == null) watchId = loc.watchPosition(onPositionChanged, errorCallback);
    //}

    //var loc = null;
    //loc = new Windows.Devices.Geolocation.

    function changeMapType() {
        var type = map.getMapTypeId();
        switch (type) {
            case Microsoft.Maps.MapTypeId.aerial:
                type = Microsoft.Maps.MapTypeId.road;
                break;
            case Microsoft.Maps.MapTypeId.road:
                type = Microsoft.Maps.MapTypeId.birdseye;
                break;
            default:
                type = Microsoft.Maps.MapTypeId.aerial;
                break;
        }
        map.setView({ center: map.getCenter(), mapTypeId: type });
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

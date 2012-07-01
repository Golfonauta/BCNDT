// Para obtener una introducción a la plantilla División, consulte la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkID=232447
(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var nav = WinJS.Navigation;
    WinJS.strictProcessing();

    app.addEventListener("activated", function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: Esta aplicación se ha iniciado recientemente. Inicializar
                // la aplicación aquí.
            } else {
                // TODO: Esta aplicación se ha reactivado tras estar suspendida.
                // Restaurar el estado de la aplicación aquí.
            }

            if (app.sessionState.history) {
                nav.history = app.sessionState.history;
            }
            args.setPromise(WinJS.UI.processAll().then(function () {
                if (nav.location) {
                    nav.history.current.initialPlaceholder = true;
                    return nav.navigate(nav.location, nav.state);
                } else {
                    return nav.navigate(Application.navigator.home);
                }
            }));
        }
    });

    app.oncheckpoint = function (args) {
        // TODO: Esta aplicación está a punto de suspenderse. Guardar cualquier estado
        // that needs to persist across suspensions here. If you need to 
        // complete an asynchronous operation before your application is 
        // suspended, call args.setPromise().
        app.sessionState.history = nav.history;
    };

    app.start();
})();

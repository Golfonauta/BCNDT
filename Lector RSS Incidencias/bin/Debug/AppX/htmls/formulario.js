(function () {
    "use strict";

    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var binding = WinJS.Binding;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;

    ui.Pages.define("/htmls/formulario.html", {

        /// <field type="WinJS.Binding.List" />
        items: null,
        /// <field type="Object" />
        group: null,
        itemSelectionIndex: -1,

        // Esta función comprueba si las columnas de lista y detalles deben mostrarse
        // en páginas independientes en lugar de en paralelo.
        isSingleColumn: function () {
            var viewState = Windows.UI.ViewManagement.ApplicationView.value;
            return (viewState === appViewState.snapped || viewState === appViewState.fullScreenPortrait);
        },

        // Se llama a esta función cuando un usuario navega a esta página. Esta
        // rellena los elementos de la página con los datos de la aplicación.
        ready: function (element, options) {
            var listView = element.querySelector(".itemlist").winControl;

            // Almacene la información sobre el grupo y la selección que se mostrará en
            // esta página.
            this.group = (options && options.groupKey) ? Data.resolveGroupReference(options.groupKey) : Data.groups.getAt(0);
            this.items = Data.getItemsFromGroup(this.group);
            this.itemSelectionIndex = (options && "selectedIndex" in options) ? options.selectedIndex : -1;

            element.querySelector("header[role=banner] .pagetitle").textContent = this.group.title;

            // Configure el elemento ListView.
            listView.itemDataSource = this.items.dataSource;
            listView.itemTemplate = element.querySelector(".itemtemplate");
            listView.onselectionchanged = this.selectionChanged.bind(this);
            listView.layout = new ui.ListLayout();

            this.updateVisibility();
            if (this.isSingleColumn()) {
                if (this.itemSelectionIndex >= 0) {
                    // Para obtener una vista detallada de una sola columna, cargue el artículo.
                    binding.processAll(element.querySelector(".articlesection"), this.items.getAt(this.itemSelectionIndex));
                }
            } else {
                if (nav.canGoBack && nav.history.backStack[nav.history.backStack.length - 1].location === "/pages/split/split.html") {
                    // Limpiar la pila de retroceso para controlar que un usuario ajuste esta página, salga
                    // de ella, elimine el ajuste y, a continuación, vuelva a la página.
                    nav.history.backStack.pop();
                }
                // Si esta página tiene un objeto selectionIndex, haga que dicha selección
                // aparezca en el elemento ListView.
                listView.selection.set(Math.max(this.itemSelectionIndex, 0));
            }
        },

        selectionChanged: function (args) {
            var listView = document.body.querySelector(".itemlist").winControl;
            var details;
            var that = this;
            // De forma predeterminada, la selección se limita a un solo elemento.
            listView.selection.getItems().done(function updateDetails(items) {
                if (items.length > 0) {
                    that.itemSelectionIndex = items[0].index;
                    if (that.isSingleColumn()) {
                        // Si está en estado Snapped o Portrait, navegue a una nueva página que contenga los
                        // detalles del elemento seleccionado.
                        nav.navigate("/htmls/formulario.html", { groupKey: that.group.key, selectedIndex: that.itemSelectionIndex });
                    } else {
                        // Si está en estado Full o Filled, actualice la columna de detalles con nuevos datos.
                        details = document.querySelector(".articlesection");
                        binding.processAll(details, items[0].data);
                        details.scrollTop = 0;
                    }
                }
            });
        },

        unload: function () {
            this.items.dispose();
        },

        // Esta función actualiza el diseño de la página como respuesta a los cambios en viewState.
        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />
            /// <param name="viewState" value="Windows.UI.ViewManagement.ApplicationViewState" />
            /// <param name="lastViewState" value="Windows.UI.ViewManagement.ApplicationViewState" />

            var listView = element.querySelector(".itemlist").winControl;
            var firstVisible = listView.indexOfFirstVisible;
            this.updateVisibility();

            var handler = function (e) {
                listView.removeEventListener("contentanimating", handler, false);
                e.preventDefault();
            }

            if (this.isSingleColumn()) {
                listView.selection.clear();
                if (this.itemSelectionIndex >= 0) {
                    // Si la aplicación se ha ajustado como vista detallada de una sola columna,
                    // agregue la vista de lista de columna única a la pila de retroceso.
                    nav.history.current.state = {
                        groupKey: this.group.key,
                        selectedIndex: this.itemSelectionIndex
                    };
                    nav.history.backStack.push({
                        location: "/htmls/formulario.html",
                        state: { groupKey: this.group.key }
                    });
                    element.querySelector(".articlesection").focus();
                } else {
                    listView.addEventListener("contentanimating", handler, false);
                    listView.indexOfFirstVisible = firstVisible;
                    listView.forceLayout();
                }
            } else {
                // Si la aplicación se ha desajustado como vista de dos columnas, quite toda instancia de
                // splitPage que se haya agregado a la pila de retroceso.
                if (nav.canGoBack && nav.history.backStack[nav.history.backStack.length - 1].location === "/htmls/formulario.html") {
                    nav.history.backStack.pop();
                }
                if (viewState !== lastViewState) {
                    listView.addEventListener("contentanimating", handler, false);
                    listView.indexOfFirstVisible = firstVisible;
                    listView.forceLayout();
                }

                listView.selection.set(this.itemSelectionIndex >= 0 ? this.itemSelectionIndex : Math.max(firstVisible, 0));
            }
        },

        // Esta función alterna la visibilidad de las dos columnas en función del
        // estado de vista y la selección de elemento actuales.
        updateVisibility: function () {
            var oldPrimary = document.querySelector(".primarycolumn");
            if (oldPrimary) {
                utils.removeClass(oldPrimary, "primarycolumn");
            }
            if (this.isSingleColumn()) {
                if (this.itemSelectionIndex >= 0) {
                    utils.addClass(document.querySelector(".articlesection"), "primarycolumn");
                    document.querySelector(".articlesection").focus();
                } else {
                    utils.addClass(document.querySelector(".itemlistsection"), "primarycolumn");
                    document.querySelector(".itemlist").focus();
                }
            } else {
                document.querySelector(".itemlist").focus();
            }
        }
    });
})();

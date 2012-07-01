(function () {
    "use strict";

    var dataArray = [
    { title: "Basic banana", text: "Low-fat frozen yogurt", picture: "images/60banana.png" },
    { title: "Banana blast", text: "Ice cream", picture: "images/60banana.png" },
    { title: "Brilliant banana", text: "Frozen custard", picture: "images/60banana.png" },
    { title: "Orange surprise", text: "Sherbet", picture: "images/60orange.png" },
    { title: "Original orange", text: "Sherbet", picture: "images/60orange.png" },
    { title: "Vanilla", text: "Ice cream", picture: "images/60vanilla.png" },
    { title: "Very vanilla", text: "Frozen custard", picture: "images/60vanilla.png" },
    { title: "Marvelous mint", text: "Gelato", picture: "images/60mint.png" },
     { title: "Brilliant banana", text: "Frozen custard", picture: "images/60banana.png" },
    { title: "Orange surprise", text: "Sherbet", picture: "images/60orange.png" },
    { title: "Original orange", text: "Sherbet", picture: "images/60orange.png" },
    { title: "Vanilla", text: "Ice cream", picture: "images/60vanilla.png" },
    { title: "Very vanilla", text: "Frozen custard", picture: "images/60vanilla.png" },
    { title: "Marvelous mint", text: "Gelato", picture: "images/60mint.png" }, { title: "Brilliant banana", text: "Frozen custard", picture: "images/60banana.png" },
    { title: "Orange surprise", text: "Sherbet", picture: "images/60orange.png" },
    { title: "Original orange", text: "Sherbet", picture: "images/60orange.png" },
    { title: "Vanilla", text: "Ice cream", picture: "images/60vanilla.png" },
    { title: "Very vanilla", text: "Frozen custard", picture: "images/60vanilla.png" },
    { title: "Marvelous mint", text: "Gelato", picture: "images/60mint.png" },
    { title: "Succulent strawberry", text: "Sorbet", picture: "images/60strawberry.png" }
    ];

    var dataList = new WinJS.Binding.List(dataArray);

    // Create a namespace to make the data publicly
    // accessible. 
    var publicMembers =
        {
            itemList: dataList
        };
    WinJS.Namespace.define("DataExample", publicMembers);

})();
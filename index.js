sap.ui.require([
	"sap/m/Shell",
	"sap/m/App",
	"sap/m/Page",
	"sap/ui/core/ComponentContainer"
], function(
	Shell, App, Page, ComponentContainer) {
	"use strict";

	sap.ui.getCore().attachInit(function() {
        sap.ui.getCore().attachInit(function () {
            new sap.m.Shell({
                appWidthLimited: false,
                app: new sap.ui.core.ComponentContainer({
                    height: "100%",
                    name: "sap.ui.comp.sample.valuehelpdialog.singleSelect",
                    settings: {
                        id: "sap.ui.comp.sample.valuehelpdialog.singleSelect"
                    }
                })
            }).placeAt("content");
        });
	});
    });





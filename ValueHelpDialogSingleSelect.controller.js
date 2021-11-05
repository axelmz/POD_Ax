sap.ui.define([
    "sap/m/Button",
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/m/ColumnListItem',
    'sap/m/Label',
    "sap/m/Dialog",
    "sap/m/DialogType",
    "sap/m/MessageBox",
    'sap/m/MessageToast',
    "sap/ui/core/Fragment",
    "sap/m/library",
    "sap/m/Text",
    "sap/m/TextArea",
    "./model/formatter"
], function (Button, Controller, JSONModel, ColumnListItem, Label, Dialog, DialogType, MessageBox, MessageToast, Fragment, mobileLibrary, Text, TextArea, formatter) {
    "use strict";

    return Controller.extend("sap.ui.comp.sample.valuehelpdialog.singleSelect.ValueHelpDialogSingleSelect", {
        formatter: formatter,
        onInit: function () {
            this.showData();
            this._oInput_orders = this.getView().byId("input3");
            this._oInput = this.getView().byId("input");
            this._server = 'http://187.189.27.245:50000';
            this.oColModel = new JSONModel(sap.ui.require.toUrl("sap/ui/comp/sample/valuehelpdialog/singleSelect") + "/columnsOperationModel.json");
            this.oColModel_orders = new JSONModel(sap.ui.require.toUrl("sap/ui/comp/sample/valuehelpdialog/singleSelect") + "/columnsOrdersModel.json");
            this.oTable = this.getView().byId("OrdersList");
        },
        showData: function () {
            var oThis = this;
            setInterval(function () {
                oThis.getStats("capacitacion/Daniel/pco_get_spd_volt");
            }, 3000);
        },

        getStats(path) {
            var uri = "http://187.189.27.245:50000/" + "/XMII/Runner?Transaction=" + path + "&OutputParameter=JsonOutput&Content-Type=text/xml";
            uri = uri.replace(/\s+/g, '');

            var oThis = this;
            $.ajax({
                    type: "GET",
                    dataType: "xml",
                    cache: false,
                    url: uri,
                    data: {}
                })
                .done(function (xmlDOM) {
                    var opElement = xmlDOM.getElementsByTagName("Row")[0].firstChild;

                    if (opElement.firstChild !== null) {
                        var aData = JSON.parse(opElement.firstChild.data);
                        if (aData !== undefined) {
                            if (aData.error !== undefined) {
                                oThis.getOwnerComponent().openHelloDialog(aData.error);
                            } else {
                                //Create the JSON model and set the data 
                                var oModel = new sap.ui.model.json.JSONModel();
                                oModel.setData(aData);

                                // Assign the model object to the SAPUI5 core
                                oThis.getView().setModel(oModel, "STATS");
                            }
                        } else {
                            MessageToast.show("No se han recibido " + "Datos");
                        }
                    } else {
                        MessageToast.show("No se han recibido datos");
                    }

                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    if (console && console.log) {
                        MessageToast.show("La solicitud a fallado: " + textStatus);
                    }
                });
        },

        onValueOperationRequested: function () {
            var Cols = this.oColModel.getData().cols,
                othis = this;

            sap.ui.core.BusyIndicator.show(0);

            var uri = this._server + "/XMII/Runner?Transaction=capacitacion/sel_WORK_CENTER_trx_2&OutputParameter=JsonOutput&Content-Type=text/xml";
            uri = uri.replace(/\s+/g, '');

            this._oInput_orders.setSelectedKey("");

            $.ajax({
                    type: "GET",
                    dataType: "xml",
                    cache: false,
                    url: uri,
                    data: {}
                })
                .done(function (xmlDOM) {
                    console.log(xmlDOM);
                    var opElement = xmlDOM.getElementsByTagName("Row")[0].firstChild;
                    var aData = JSON.parse(opElement.firstChild.data);
                    othis.oProductsModel = new JSONModel(aData);

                    othis._oValueHelpDialog = sap.ui.xmlfragment("sap.ui.comp.sample.valuehelpdialog.singleSelect.ValueHelpDialogSingleSelect", othis);

                    othis._oValueHelpDialog.getTableAsync().then(function (oTable) {
                        oTable.setModel(othis.oProductsModel);
                        oTable.setModel(othis.oColModel, "columns");

                        if (oTable.bindRows) {
                            oTable.bindAggregation("rows", "/ITEMS");
                        }

                        if (oTable.bindItems) {
                            oTable.bindAggregation("items", "/ITEMS", function () {
                                return new ColumnListItem({
                                    cells: aCols.map(function (column) {
                                        return new Label({
                                            text: "{" + column.template + "}"
                                        });
                                    })
                                });
                            });
                        }
                        othis._oValueHelpDialog.update();
                    }.bind(this));
                    sap.ui.core.BusyIndicator.hide();
                    othis.getView().addDependent(othis._oValueHelpDialog);
                    othis._oValueHelpDialog.open();
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    if (console && console.log) {
                        othis.getOwnerComponent().openHelloDialog("La solicitud ha fallado: \u00BFHay conexi\u00F3n con el servidor?");
                    }
                });
        },

        onValueOrdersRequested: function () {
            var IdWorkCenter = this._oInput.getSelectedKey();
            var aCols = this.oColModel_orders.getData().cols,
                othis = this,
                oData = {
                    "Input": IdWorkCenter
                };

            var uri = this._server + "/XMII/Runner?Transaction=capacitacion/Daniel/get_all_orders&OutputParameter=JsonOutput&Content-Type=text/xml";
            uri = uri.replace(/\s+/g, '');

            sap.ui.core.BusyIndicator.show(0);

            $.ajax({
                    type: "GET",
                    dataType: "xml",
                    cache: false,
                    url: uri,
                    data: oData
                })
                .done(function (xmlDOM) {
                    console.log(xmlDOM);
                    var opElement = xmlDOM.getElementsByTagName("Row")[0].firstChild;
                    var aData = JSON.parse(opElement.firstChild.data);
                    othis.oOrdersModel = new JSONModel(aData);

                    othis._oValueHelpDialogOrders = sap.ui.xmlfragment("sap.ui.comp.sample.valuehelpdialog.singleSelect.ValueHelpDialogOrders", othis);

                    othis._oValueHelpDialogOrders.getTableAsync().then(function (oTable) {
                        oTable.setModel(othis.oOrdersModel);
                        oTable.setModel(othis.oColModel_orders, "columns");

                        if (oTable.bindRows) {
                            oTable.bindAggregation("rows", "/ITEMS");
                        }

                        if (oTable.bindItems) {
                            oTable.bindAggregation("items", "/ITEMS", function () {
                                return new ColumnListItem({
                                    cells: aCols.map(function (column) {
                                        return new Label({
                                            text: "{" + column.template + "}"
                                        });
                                    })
                                });
                            });
                        }

                        othis._oValueHelpDialogOrders.update();
                    }.bind(this));
                    sap.ui.core.BusyIndicator.hide();
                    othis.getView().addDependent(othis._oValueHelpDialogOrders);
                    othis._oValueHelpDialogOrders.open();
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    if (console && console.log) {
                        othis.getOwnerComponent().openHelloDialog("La solicitud ha fallado: \u00BFHay conexi\u00F3n con el servidor?");
                    }
                    oTable.setBusy(false);
                });
        },
        onValueHelpOrdersOkPress: function (oEvent) {
            var aTokens = oEvent.getParameter("tokens");
            this._oInput_orders.setSelectedKey(aTokens[0].getKey());
            this._oInput_orders.setValue(aTokens[0].getText());
            this._oValueHelpDialogOrders.close();
        },
        onValueHelpOkPress: function (oEvent) {
            var aTokens = oEvent.getParameter("tokens");
            this._oInput.setSelectedKey(aTokens[0].getKey());
            this._oInput.setValue(aTokens[0].getText());
            this._oValueHelpDialog.close();
            this._oInput_orders.setEnabled(true);
            console.log(this._oInput.getSelectedKey());
            this._oInput.getSelectedKey();


        },
        onValueHelpCancelPress: function (oEvent) {
            this._oValueHelpDialog.close();
        },
        onValueHelpOrdersCancelPress: function (oEvent) {
            this._oValueHelpDialogOrders.close();
        },
        onStartOrder: function () {
            if (this._oInput.getSelectedKey() != "" && this._oInput_orders.getSelectedKey() != "") {
                MessageToast.show("Orden iniciada");
                //----------------------------------------------------------------
                var IdWorkCenter = this._oInput.getSelectedKey();
                this._upd_orders();
                var oData = {
                    "ESTATUS": "1",
                    "WORK_CENTER": IdWorkCenter
                };
                this._base_onloadTable(this.oTable, oData, "capacitacion/Axel/select_orders_tran_04_11", "datos");

                //----------------------------------------------------------------
            } else {
                MessageToast.show("Ambos campos necesitan que tener valores");
            }
        },

        _upd_orders: function () {
            var IdOrders = this._oInput_orders.getSelectedKey();
            var IdWorkCenter = this._oInput.getSelectedKey();
            var aCols = this.oColModel_orders.getData().cols,
                othis = this,
                oData = {
                    "ORDER_ESTATUS": "1",
                    "ID_shopOrder": IdOrders
                };


            //clear table
            var oModel_empty = new JSONModel();
            oModel_empty.setData({});
            this.oTable.setModel(oModel_empty);

            var uri = this._server + "/XMII/Runner?Transaction=capacitacion/Rafael/update_shop_Order_04_nov";
            uri = uri.replace(/\s+/g, '');
            console.log(uri);
            //this.oTable.setBusy(true);

            $.ajax({
                type: "GET",
                dataType: "xml",
                cache: false,
                url: uri,
                data: oData
            })
        },
        _base_onloadTable: function (Table, oData, path, name) {
            var IdOrders = this._oInput_orders.getSelectedKey();
            var IdWorkCenter = this._oInput.getSelectedKey();
            var aCols = this.oColModel_orders.getData().cols,
                othis = this;


            //clear table
            var oModel_empty = new JSONModel();
            oModel_empty.setData({});
            this.oTable.setModel(oModel_empty);

            var uri = this._server + "/XMII/Runner?Transaction=" + path + "&OutputParameter=JsonOutput&Content-Type=text/xml";
            uri = uri.replace(/\s+/g, '');
            console.log(uri);
            this.oTable.setBusy(true);

            $.ajax({
                    type: "GET",
                    dataType: "xml",
                    cache: false,
                    url: uri,
                    data: oData
                })

                .done(function (xmlDOM) {
                    var opElement = xmlDOM.getElementsByTagName("Row")[0].firstChild;
                    var oModel = new sap.ui.model.json.JSONModel();
                    if (opElement.firstChild !== null) {
                        var aData = JSON.parse(opElement.firstChild.data);

                        if (aData.ITEMS.length > 0) {
                            if (aData.error !== undefined) {
                                oThis.getOwnerComponent().openHelloDialog(aData.error);
                            } else {
                                //Create  the JSON model and set the data                                                                                                
                                oModel.setData(aData);
                                //check if exist a header element
                                /*if (stats_bar !== '') {
                                    var oModel_stats = new sap.ui.model.json.JSONModel();
                                    var oSTATS = oThis.byId(stats_bar);

                                    oModel_stats.setData(aData.STATS);
                                    oSTATS.setModel(oModel_stats);
                                }*/
                                if (aData.ITEMS.length > 100)
                                    oModel.setSizeLimit(aData.ITEMS.length);
                                othis.oTable.setModel(oModel);
                            }
                        } else {
                            MessageToast.show("No se han recibido " + name);
                        }
                    } else {
                        MessageToast.show("No se han recibido datos");
                    }

                    othis.oTable.setBusy(false);
                    console.log(aData);

                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    if (console && console.log) {
                        oThis.getOwnerComponent().openHelloDialog("La solicitud ha fallado: \u00BFHay conexi\u00F3n con el servidor?");
                    }
                    this.oTable.setBusy(false);
                });
        }
    });
});
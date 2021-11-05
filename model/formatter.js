sap.ui.define([], function () {
    "use strict";
    return {
        emptyText: function (sStatus) {            
            switch (sStatus) {
                case "---":
                    return "";
                default:
                    return sStatus;
            }
        },
        faltante: function(planeada, producida){
            return planeada - producida;
        },
        componentText: function (sState) {
            switch (sState) {
                case "1":
                    return "Activo";
                case "---":
                    return "Inactivo";
                case "2":
                    return "Terminado";
                default:
                    return "Inactivo";
            }
        },

        orderText: function (sState) {
            switch (sState) {
                case "1":
                    return "Activa";
                case "---":
                    return "Inactiva";
                default:
                    return "Inactiva";
            }
        },

        activateText: function (sState) {
            switch (sState) {
                case "1":
                    return "Trabajando";
                case "0":
                    return "Detenida";
                default:
                    return "Detenida";
            }
        },

        availableState: function (sStateValue) {

            switch (sStateValue) {
                case "1":
                    return 8;
                case "":
                    return 8;
                case "---":
                    return 3;
                case "2":
                    return 5;
                case "Q":
                    return 3;
                case "S":
                    return 5;
                default:
                    return 9;
            }
        },

        availableStateR: function (sStateValue) {

            switch (sStateValue) {
                case "X":
                    return 9;
                case "---":
                    return 8;
                default:
                    return 8;
            }
        },

        lineStop: function (sStateValue) {

            switch (sStateValue) {
                case "1":
                    return 8;
                case "0":
                    return 3;
                default:
                    return 9;
            }
        },

        availableStateSFC: function(sStateValue){
            switch (sStateValue) {
                case "---":
                    return 8;
                case "2":
                    return 5;
                default:
                    return 3;
            }
        },

        inspeccionadoText: function (sState) {
            switch (sState) {
                case "1":
                    return "Inspeccionado";
                case "":
                    return "Inspeccionado";
                case "---":
                    return "Pendiente";
                case "S":
                    return "Bloqueado";
                default:
                    return "Pendiente";
            }
        },

        SFCText: function (sState) {
            switch (sState) {
                case "---":
                    return "Iniciado";
                case "2":
                    return "Terminado";
                default:
                    return "Desconocido";
            }
        },

        retornoText: function (sState) {
            switch (sState) {
                case "X":
                    return "Retorno";
                case "---":
                    return "Terminado";
                default:
                    return "Terminado";
            }
        },

        elementVisible: function (sState) {
            if (sState === "X")
                return true;
            else
                return false;
        }
    };
});
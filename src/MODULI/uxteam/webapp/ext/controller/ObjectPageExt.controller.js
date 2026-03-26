sap.ui.define([
    "sap/ui/core/mvc/ControllerExtension",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/m/MessageToast"
], function (ControllerExtension, OverrideExecution, MessageToast) {
    "use strict";

    // Codice Fiscale computation tables
    var MONTH_CODES = "ABCDEHLMPRST";
    var ODD_CHARS = {
        "0": 1, "1": 0, "2": 5, "3": 7, "4": 9, "5": 13, "6": 15, "7": 17, "8": 19, "9": 21,
        "A": 1, "B": 0, "C": 5, "D": 7, "E": 9, "F": 13, "G": 15, "H": 17, "I": 19, "J": 21,
        "K": 2, "L": 4, "M": 18, "N": 20, "O": 11, "P": 3, "Q": 6, "R": 8, "S": 12, "T": 14,
        "U": 16, "V": 10, "W": 22, "X": 25, "Y": 24, "Z": 23
    };
    var EVEN_CHARS = {
        "0": 0, "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9,
        "A": 0, "B": 1, "C": 2, "D": 3, "E": 4, "F": 5, "G": 6, "H": 7, "I": 8, "J": 9,
        "K": 10, "L": 11, "M": 12, "N": 13, "O": 14, "P": 15, "Q": 16, "R": 17, "S": 18, "T": 19,
        "U": 20, "V": 21, "W": 22, "X": 23, "Y": 24, "Z": 25
    };

    // Common Italian city codes (Codice Catastale) - subset for demo
    var CITY_CODES = {
        "ROMA": "H501", "MILANO": "F205", "NAPOLI": "F839", "TORINO": "L219",
        "PALERMO": "G273", "GENOVA": "D969", "BOLOGNA": "A944", "FIRENZE": "D612",
        "BARI": "A662", "CATANIA": "C351", "VENEZIA": "L736", "VERONA": "L781",
        "MESSINA": "F158", "PADOVA": "G224", "TRIESTE": "L424", "TARANTO": "L049",
        "BRESCIA": "B157", "PARMA": "G337", "PRATO": "G999", "MODENA": "F257",
        "REGGIO CALABRIA": "H224", "REGGIO EMILIA": "H223", "PERUGIA": "G478",
        "LIVORNO": "E625", "RAVENNA": "H199", "CAGLIARI": "B354", "FOGGIA": "D643",
        "RIMINI": "H294", "SALERNO": "H703", "FERRARA": "D548", "SASSARI": "I452",
        "LATINA": "E472", "BERGAMO": "A794", "SIRACUSA": "I754", "PESCARA": "G482",
        "MONZA": "F704", "FORLI": "D704", "VICENZA": "L840", "TERNI": "L117",
        "BOLZANO": "A952", "NOVARA": "F952", "PIACENZA": "G535", "ANCONA": "A271",
        "ANDRIA": "A285", "AREZZO": "A390", "UDINE": "L483", "CESENA": "C573",
        "LECCE": "E506", "PESARO": "G479", "ALESSANDRIA": "A182", "CATANZARO": "C352",
        "PISTOIA": "G713", "BRINDISI": "B180", "COMO": "C933", "POTENZA": "G942",
        "COSENZA": "D086", "CASERTA": "B963", "AVELLINO": "A509", "BENEVENTO": "A783",
        "CAMPOBASSO": "B519", "AOSTA": "A326", "ISERNIA": "E335", "CROTONE": "D122",
        "VIBO VALENTIA": "F537", "LAMEZIA TERME": "M208", "MATERA": "F052",
        "LECCO": "E507", "LODI": "E648", "MANTOVA": "E897", "MASSA": "F023",
        "NUORO": "F979", "ORISTANO": "G113", "PAVIA": "G388", "RIETI": "H282",
        "ROVIGO": "H620", "SAVONA": "I480", "SONDRIO": "I829", "TREVISO": "L407",
        "VARESE": "L682", "VERCELLI": "L750", "VITERBO": "M082"
    };

    function extractConsonants(str) {
        return str.toUpperCase().replace(/[^A-Z]/g, "").replace(/[AEIOU]/g, "");
    }

    function extractVowels(str) {
        return str.toUpperCase().replace(/[^A-Z]/g, "").replace(/[^AEIOU]/g, "");
    }

    function computeSurnameCode(surname) {
        var consonants = extractConsonants(surname);
        var vowels = extractVowels(surname);
        var code = (consonants + vowels + "XXX").substring(0, 3);
        return code;
    }

    function computeNameCode(name) {
        var consonants = extractConsonants(name);
        if (consonants.length >= 4) {
            return consonants[0] + consonants[2] + consonants[3];
        }
        var vowels = extractVowels(name);
        var code = (consonants + vowels + "XXX").substring(0, 3);
        return code;
    }

    function computeDateGenderCode(day, month, year, gender) {
        var yearCode = ("0" + (year % 100)).slice(-2);
        var monthCode = MONTH_CODES[month - 1];
        var dayValue = gender === "F" ? day + 40 : day;
        var dayCode = ("0" + dayValue).slice(-2);
        return yearCode + monthCode + dayCode;
    }

    function computeCheckChar(partialCF) {
        var sum = 0;
        for (var i = 0; i < 15; i++) {
            var c = partialCF[i];
            if (i % 2 === 0) {
                sum += ODD_CHARS[c];
            } else {
                sum += EVEN_CHARS[c];
            }
        }
        return String.fromCharCode(65 + (sum % 26));
    }

    function computeCodiceFiscale(surname, name, day, month, year, gender, birthplace) {
        var surnameCode = computeSurnameCode(surname);
        var nameCode = computeNameCode(name);
        var dateGenderCode = computeDateGenderCode(day, month, year, gender);

        var cityKey = birthplace.toUpperCase().trim();
        var cityCode = CITY_CODES[cityKey];
        if (!cityCode) {
            return null; // City not found
        }

        var partialCF = surnameCode + nameCode + dateGenderCode + cityCode;
        var checkChar = computeCheckChar(partialCF);

        return partialCF + checkChar;
    }

    return ControllerExtension.extend("z.uxteam.uxteam.ext.controller.ObjectPageExt", {
        static: {
            metadata: {
                methods: {
                    onAfterRendering: { "public": true, "final": false, overrideExecution: OverrideExecution.After }
                }
            }
        },

        onAfterRendering: function () {
            // Attach to field changes after the page renders
            this._attachFieldChangeHandler();
        },

        _attachFieldChangeHandler: function () {
            var oView = this.base.getView();
            var that = this;

            // Use a timeout to ensure the binding context is ready
            setTimeout(function () {
                var oBindingContext = oView.getBindingContext();
                if (oBindingContext) {
                    var oModel = oBindingContext.getModel();
                    // Listen for property changes on the binding
                    oBindingContext.getBinding().attachPatchCompleted(function () {
                        that._tryComputeCF(oBindingContext);
                    });
                }
            }, 1000);
        },

        _tryComputeCF: function (oBindingContext) {
            if (!oBindingContext) {
                return;
            }

            var oData = oBindingContext.getObject();
            if (!oData) {
                return;
            }

            var firstname = oData.firstname;
            var lastname = oData.lastname;
            var dateOfBirth = oData.date_of_birth;
            var gender = oData.gender;
            var birthPlace = oData.birth_place;

            // Check all required fields are filled
            if (!firstname || !lastname || !dateOfBirth || !gender || !birthPlace) {
                return;
            }

            // Parse date
            var date;
            if (typeof dateOfBirth === "string") {
                date = new Date(dateOfBirth);
            } else {
                date = dateOfBirth;
            }

            var day = date.getDate();
            var month = date.getMonth() + 1;
            var year = date.getFullYear();

            // Compute CF
            var cf = computeCodiceFiscale(lastname, firstname, day, month, year, gender.toUpperCase(), birthPlace);

            if (cf) {
                // Update the codice_fiscale field
                oBindingContext.setProperty("codice_fiscale", cf);
                MessageToast.show("Codice Fiscale calcolato: " + cf);
            }
        }
    });
});

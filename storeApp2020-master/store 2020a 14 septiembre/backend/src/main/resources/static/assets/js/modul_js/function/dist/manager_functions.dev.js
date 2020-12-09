"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ManagerFunctions = ManagerFunctions;

var _enum_color = require("../enum/enum_color.js");

var _enum_stratey = require("../enum/enum_stratey.js");

var _global = require("./global.js");

var _factoryValidation = require("../factory/factoryValidation.js");

function ManagerFunctions() {
  var API = {};

  API.darkLight = function (classDark) {
    var $selectors = (0, _global.Qa)("[data-dark]");
    var $btn = (0, _global.$)("darkMode");

    var setThemeInitial = function setThemeInitial() {
      if (_global.lS.getItem("theme") === null) {
        _global.lS.setItem("theme", "light");
      } else {
        if (_global.lS.getItem("theme") === "light") {
          $btn.value = "light";
          $selectors.forEach(function (el) {
            return el.classList.remove(classDark);
          });
        } else {
          $btn.value = "dark";
          $selectors.forEach(function (el) {
            return el.classList.add(classDark);
          });
        }
      }
    };

    var changeMode = function changeMode(e) {
      var state = "";
      e.target.value === "light" ? state = "dark" : state = "light";
      $selectors.forEach(function (el) {
        return el.classList.toggle(classDark);
      });
      e.target.value = state;

      _global.lS.setItem("theme", state);
    };

    _global.d.addEventListener("click", function (e) {
      if (e.target.id === "darkMode") {
        changeMode(e);
      }
    });

    setThemeInitial();
  };

  API.weather = function () {
    var key = "00c14c9fa75c8b84d8f1492058ac4369";
    if (key == "") (0, _global.$)("temp").innerHTML = "Remember to add your api key!";

    function weatherBallon(cityID) {
      //fetch('https://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=00c14c9fa75c8b84d8f1492058ac4369')
      //fetch('https://api.openweathermap.org/data/2.5/weather?id=' + cityID+ '&appid=' + key)
      //fetch('https://api.openweathermap.org/data/2.5/weather?q=arroyo de san servan,spain&APPID=00c14c9fa75c8b84d8f1492058ac4369')
      fetch("https://api.openweathermap.org/data/2.5/weather?q=almendralejo,spain&APPID=00c14c9fa75c8b84d8f1492058ac4369").then(function (resp) {
        return resp.json();
      }) // Convert data to json
      .then(function (data) {
        drawWeather(data);
      })["catch"](function () {// catch any errors
      });
    }

    function drawWeather(data) {
      var celcius = Math.round(parseFloat(data.main.temp) - 273.15);
      var fahrenheit = Math.round((parseFloat(data.main.temp) - 273.15) * 1.8 + 32);
      var description = data.weather[0].description;
      (0, _global.$)("description").innerHTML = description;
      (0, _global.$)("temp").innerHTML = celcius + "&deg;";
      (0, _global.$)("location").innerHTML = data.name;

      if (description.indexOf("rain") > 0) {
        (0, _global.$)("myHome").className = "cwbody rainy";
      } else if (description.indexOf("cloud") > 0) {
        (0, _global.$)("myHome").className = "cwbody cloudy";
      } else if (description.indexOf("sunny") > 0) {
        (0, _global.$)("myHome").className = "cwbody sunny";
      } else {
        (0, _global.$)("myHome").className = "cwbody clear";
      }
    }

    weatherBallon(4167865); //weatherBallon(6167865);
  };

  API.scrollTop = function (btn) {
    var $scrollBtn = _global.d.querySelector(btn);

    _global.w.addEventListener("scroll", function (e) {
      var scrollTop = _global.w.pageYOffset || _global.d.documentElement.scrollTop;

      if (scrollTop > 600) {
        $scrollBtn.classList.remove("hidden");
      } else {
        $scrollBtn.classList.add("hidden");
      } // console.log(w.pageXOffset,d.documentElement.scrollTop);

    });

    _global.d.addEventListener("click", function (e) {
      if (e.target.matches(btn)) {
        _global.w.scrollTo({
          behavior: "smooth",
          top: 0
        });
      }
    });
  };

  API.validations = function () {
    _global.d.addEventListener("keyup", function (e) {
      if (e.target.matches("[data-validate]")) {
        e.code == "Enter" || e.code == "Tab" ? eval(_global.sS.getItem("strategy")) : eval(e.target.dataset.validate + "(e)");
      }
    });
  };

  API.phone = function () {
    'use strict';

    var COUNTRYPATTERN = {
      REGEX_FRANCE_FIJO: "^[0-9]{9}$",
      ///^[1-9](\d{2}){4}$
      REGEX_FRANCE_MOVIL: "^[6|7][0-9]{8}$",
      REGEX_SPAIN_FIJO: "^[9][0-9]{8}$",
      REGEX_SPAIN_MOVIL: "^[6|7][0-9]{8}$",
      REGEX_US_FIJO: "^[0-9]{10}$",
      REGEX_US_MOVIL: "^[0-9]{10}$"
    };
    var Prefix = [{
      "default": true,
      "prefijo": "ES",
      "value": "+34",
      "maximo": 9,
      "flag": "es.png",
      "mobile": COUNTRYPATTERN.REGEX_SPAIN_MOVIL,
      "landline": COUNTRYPATTERN.REGEX_SPAIN_FIJO
    }, {
      "prefijo": "FR",
      "value": "+33",
      "maximo": 9,
      "flag": "fr.png",
      "mobile": COUNTRYPATTERN.REGEX_FRANCE_MOVIL,
      "landline": COUNTRYPATTERN.REGEX_FRANCE_FIJO
    }, {
      "prefijo": "US",
      "value": "+1",
      "maximo": 10,
      "flag": "us.png",
      "mobile": COUNTRYPATTERN.REGEX_US_MOVIL,
      "landline": COUNTRYPATTERN.REGEX_US_FIJO
    }];

    function updateChanges(phoneNumber, idCountry, phoneType) {
      eval("sS.setItem('pattern_'+" + phoneNumber + ", Prefix[" + idCountry + "]." + phoneType + ")");

      _global.sS.setItem('numberLength_' + phoneNumber, Prefix[idCountry].maximo);

      (0, _global.$)("phone_" + phoneNumber).setAttribute("maxlength", Prefix[idCountry].maximo);
      (0, _global.$)("phone_" + phoneNumber).setAttribute("minlength", Prefix[idCountry].maximo);
      changeFlag(Prefix[idCountry].flag, (0, _global.$)("phone_" + phoneNumber).id);
    }

    var changeFlag = function changeFlag(flag, myId) {
      (0, _global.$)("litleImg_" + myId).src = "../assets/img/flags/" + flag;
    };

    var changePrefix = function changePrefix(e) {
      var phoneType = e.target.dataset.phonetype;
      var names = e.target.id.split("_");
      var phoneInput = names[1] + "_" + names[2];
      (0, _global.$)(phoneInput).value = "";
      (0, _global.$)(phoneInput).placeholder = "enter new phone";
      (0, _global.$)(phoneInput).style.borderColor = _enum_color.COLOR.ERROR;
      var selectedValue = e.target.options[e.target.selectedIndex].value;

      for (var index in Prefix) {
        if (Prefix[index].value === selectedValue) {
          updateChanges(names[2], index, phoneType);
        }
      }

      ;
    };

    var fillSelectPrefix = function fillSelectPrefix(phone, index) {
      var selectPrefixInternational = (0, _global.$)("select_" + phone.id);

      for (var i in Prefix) {
        selectPrefixInternational.options[selectPrefixInternational.options.length] = new Option(Prefix[i].prefijo, Prefix[i].value, undefined, Prefix[i]["default"]);

        if (Prefix[i]["default"]) {
          updateChanges(index, i, selectPrefixInternational.dataset.phonetype);
        }
      }

      selectPrefixInternational.addEventListener("change", function (e) {
        changePrefix(e);
      });
    };

    var phones = (0, _global.Qa)("input[data-phoneType]"); //console.log(phones);

    phones.forEach(fillSelectPrefix);
  };

  API.dado = function () {
    var dados = ['dado informatica', 'dado harnina', 'dado juntaextremadura'];
    var imagenes = ['assets/img/escudo02.png', 'assets/img/harni01.png', 'assets/img/Escudo_de_Extremadura.png'];
    var clases = ['cara frontal', 'cara trasera', 'cara derecha', 'cara izquierda', 'cara arriba', 'cara abajo'];

    var creaImagen = function creaImagen(imag, a, b, i) {
      var imagen = document.createElement("img");
      imagen.setAttribute('src', imag);
      imagen.className = 'Imagen';
      imagen.id = "cara" + a + "-" + b + "-" + i;
      return imagen;
    };

    var creaCara = function creaCara(dado, a, b, imagen) {
      for (var i = 0; i < clases.length; i++) {
        var cara = document.createElement('div');
        cara.className = clases[i];
        cara.appendChild(creaImagen(imagen, a, b, i));
        dado[b].appendChild(cara);
      }
    };

    for (var i = 0; i < dados.length; i++) {
      var pageDados = document.getElementsByClassName(dados[i]);

      for (var j = 0; j < pageDados.length; j++) {
        creaCara(pageDados, i, j, imagenes[i]);
      }
    }
  }; // IndexedDB


  var browserCompatibility = function browserCompatibility() {
    var myIndexdDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

    if (!myIndexdDB) {
      window.alert("Su navegador no soporta una versión estable de indexedDB. Tal y como las características no serán validas");
    }

    return myIndexdDB;
  };

  API.CreateBBDDpostalCode = function () {
    fetch("/getcpExtremadura").then(function (response) {
      return response.json();
    }).then(function (data) {
      var myIndexdDB = browserCompatibility();
      var db = null;
      var dbNombre = "postalCodeBBDD";
      var request = myIndexdDB.open(dbNombre, 1);

      request.onerror = function (event) {
        alert('Fallo en la apertura: 1 ' + event.target.message);
      };

      request.onupgradeneeded = function (event) {
        db = event.target.result;
        var store = db.createObjectStore("postalCode", {
          keyPath: "idCp",
          autoIncrement: true
        });
        store.createIndex("postalCodeIndex", "postalCode", {
          unique: false
        });

        store.transaction.oncomplete = function (event) {
          var customerObjectStore = db.transaction("postalCode", "readwrite").objectStore("postalCode");

          for (var i in data) {
            //console.log(data[i]);
            customerObjectStore.add(data[i]);
          }

          alert("BBDD cargada");
        };
      };
    });
  };

  API.getCity = function (myCP) {
    return new Promise(function (resolve, reject) {
      var myIndexdDB = browserCompatibility();
      var db = null;
      var dbNombre = "postalCodeBBDD";
      var request = myIndexdDB.open(dbNombre, 1);

      request.onerror = function (e) {
        alert('Fallo en la apertura: ' + e.target.message);
      };

      request.onsuccess = function (e) {
        db = e.target.result;
        var range = IDBKeyRange.only(myCP);
        var transaction = db.transaction(["postalCode"], "readwrite");
        var store = transaction.objectStore("postalCode");
        var index = store.index("postalCodeIndex");

        index.openCursor(range).onsuccess = function (e) {
          var cursor = e.target.result;
          console.log(e.target);

          if (cursor) {
            resolve(cursor.value.municipality);
          } else {
            reject('Wrong error postal code');
          }
        };
      };
    });
  };

  API.submit = function () {
    'use strict';

    var submit = (0, _global.$)("submit");
    return {
      message: function message(content) {
        submit.innerHTML = content;
      },
      off: function off() {
        submit.style.display = "none";
      },
      on: function on() {
        var aviso = true;

        for (var i = 0; i < _global.sS.getItem("lenDataControls"); i++) {
          if ((0, _global.$)(_global.sS.getItem("dataControls" + i)).style.borderColor != _enum_color.COLOR.VALIDRGB) {
            aviso = false;
            break;
          }
        }

        aviso ? (0, _global.$)("div_submit").style.display = "block" : (0, _global.$)("div_submit").style.display = "none";
      }
    };
  };

  API.error = function (params) {
    'use strict';

    var id = "";
    if (params) id = params.nodo.id;
    return {
      message: function message(params) {
        (0, _global.$)("boxerror_" + id).innerHTML = params.mensajeError || params;
      },
      off: function off() {
        (0, _global.$)("boxerror_" + id).classList.add("none");
        (0, _global.$)("boxerror_" + id).style.display = "none";
      },
      on: function on() {
        (0, _global.$)("boxerror_" + id).classList.remove("none");
        (0, _global.$)("boxerror_" + id).style.display = "block";
      }
    };
  };

  API.info = function () {
    'use strict';

    return {
      exist: function exist(params) {
        if ((0, _global.$)("boxinfo_" + params.nodo.id)) {
          return true;
        } else {
          return false;
        }
      },
      message: function message(params) {
        (0, _global.$)("boxinfo_" + params.nodo.id).innerHTML = params.mensajeInfo;
      },
      off: function off(params) {
        (0, _global.$)("boxinfo_" + params.nodo.id).classList.add("none");
      },
      on: function on(params) {
        (0, _global.$)("boxinfo_" + params.nodo.id).classList.remove("none");
      }
    };
  };

  API.dataControl = function () {
    'use strict';

    return {
      get: function get(params) {
        return params.node.value;
      },
      error: function error(params) {
        params.nodo.style.borderColor = _enum_color.COLOR.ERROR;
        params.nodo.style.borderWidth = _enum_color.COLOR.ERRORBORDER;
      },
      valid: function valid(params) {
        params.nodo.style.borderColor = _enum_color.COLOR.VALID;
        params.nodo.style.borderWidth = _enum_color.COLOR.VALIDBORDER;
      }
    };
  };

  API.saveDataControls = function () {
    var dataControlrequired = (0, _global.Qa)("input[data-validate][required]");

    _global.sS.setItem("lenDataControls", dataControlrequired.length);

    for (var i = 0; i < dataControlrequired.length; i++) {
      _global.sS.setItem("dataControls" + i, dataControlrequired[i].id);
    }

    var divDataControls = (0, _global.Qa)("div[data-divcontrol]"); //console.log(divDataControls);

    _global.sS.setItem("lenDiv_DataControls", divDataControls.length);

    for (var _i = 0; _i < divDataControls.length; _i++) {
      _global.sS.setItem("div_DataControls" + _i, divDataControls[_i].id);
    }
  };

  API.getDataControls = function () {
    var dataControl = {};
    var father = "div_dataControl_";

    for (var i = 0; i < _global.sS.getItem("lenDiv_DataControls"); i++) {
      var myInputId = (0, _global.$)(_global.sS.getItem("div_DataControls" + i)).id.slice(father.length);

      if (myInputId.indexOf("phone") != -1) {
        var myInputBoxinfoId = "boxinfo_" + myInputId;
        dataControl[(0, _global.$)(myInputId).dataset.field] = (0, _global.$)(myInputBoxinfoId).innerText;
      } else {
        dataControl[(0, _global.$)(myInputId).dataset.field] = (0, _global.$)(myInputId).value;
      }
    }

    return dataControl;
  };

  API.resetDataControl = function (dataControl) {
    if (!dataControl) {
      dataControl = API.getDataControls();
    }

    for (var key in dataControl) {
      var dataField = (0, _global.Q)("input[data-field='" + key + "']");
      var control = dataField.id;
      (0, _global.$)(control).style.backgroundColor = "";
      (0, _global.$)("boxerror_" + control).style.display = "none";

      if ((0, _global.$)("boxinfo_" + control)) {
        (0, _global.$)("boxinfo_" + control).style.display = "block";
      }
    }
  };

  API.showItAllStrategy = function () {
    for (var i = 0; i < _global.sS.getItem("lenDiv_DataControls"); i++) {
      (0, _global.$)(_global.sS.getItem("div_DataControls" + i)).style.display = "block";
    }
  };

  API.showOneToOneStrategy = function () {
    var father = "div_dataControl_";

    for (var i = 1; i < _global.sS.getItem("lenDiv_DataControls"); i++) {
      if ((0, _global.$)(_global.sS.getItem("div_DataControls" + i)).style.display == "none") {
        var myInput = (0, _global.$)(_global.sS.getItem("div_DataControls" + (i - 1))).id.slice(father.length);

        if ((0, _global.$)(_global.sS.getItem("div_DataControls" + (i - 1))).style.display == "block" && ((0, _global.$)(myInput).style.borderColor == _enum_color.COLOR.VALIDRGB || !(0, _global.$)(myInput).required)) {
          (0, _global.$)(_global.sS.getItem("div_DataControls" + i)).style.display = "block";
        }

        break;
      }
    }
  };

  API.showIniStrategy = function (strategy) {
    if (strategy == _enum_stratey.STRATEGY.ALL) {
      _global.sS.setItem("strategy", "API.showItAllStrategy()");

      API.showItAllStrategy();
    }

    if (strategy == _enum_stratey.STRATEGY.ONETOONE) {
      _global.sS.setItem("strategy", "API.showOneToOneStrategy()");

      for (var i = 1; i < _global.sS.getItem("lenDiv_DataControls"); i++) {
        (0, _global.$)(_global.sS.getItem("div_DataControls" + i)).style.display = "none";
      }

      (0, _global.$)(_global.sS.getItem("div_DataControls0")).style.display = "block";
    }
  };

  API.scrollTopButton = function (btn) {
    var $scrollBtn = _global.d.querySelector(btn);

    _global.w.addEventListener("scroll", function (e) {
      var scrollTop = _global.w.pageYOffset || _global.d.documentElement.scrollTop;
      scrollTop > 300 ? $scrollBtn.classList.remove("hidden") : $scrollBtn.classList.add("hidden");
    });

    _global.d.addEventListener("click", function (e) {
      if (e.target.matches(btn)) {
        _global.w.scrollTo({
          behavior: "smooth",
          top: 0
        });
      }
    });
  };

  API.serverResponse = function (response) {
    console.log("response", response);

    if (response.status == 404) {
      this.error().message("Error 404 ");
      this.error().on();
    }

    if (Array.isArray(response)) {
      if (response[0].error == 0) {
        console.log("resultado:", response[0].addClient);
        location.reload();
      } else {
        var _loop = function _loop(i) {
          if (response[i].error == 610) {
            (0, _global.$)(response[i].idButton).style.display = "none";
            (0, _global.$)(response[i].idErrorBox).style.display = "block";
            var x = response[i].tiempoBloqueo;
            var intervalo = setInterval(function () {
              x--;

              if (x == 0) {
                (0, _global.$)(response[i].idButton).style.display = "block";
                (0, _global.$)(response[i].idErrorBox).style.display = "none";
                clearInterval(intervalo);
              }

              (0, _global.$)(response[i].idErrorBox).innerHTML = "Estas bloqueado, te quedan: " + x + " segundos.";
            }, 1000); //location.reload();
          } else {
            var field = response[i].messageNameControl;
            var dataField = (0, _global.Q)("input[data-field='" + field + "']");
            var control = dataField.id;
            (0, _global.$)(control).style.backgroundColor = _enum_color.COLOR.ERRORBACKEND;
            (0, _global.$)("boxerror" + control).innerHTML = response[i].messageErrorControl;
            (0, _global.$)("boxerror" + control).style.display = "block";

            if ((0, _global.$)("boxinfo" + control)) {
              (0, _global.$)("boxinfo" + control).style.display = "none";
            }
          }
        };

        for (var i = 0; i < response.length; i++) {
          _loop(i);
        }
      }
    }
  };

  API.ajaxForm = function (props) {
    var _this = this;

    var url = props.url,
        dataControl = props.dataControl;
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(dataControl),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })["catch"](function (error) {
      _this.error.message(error.statusText || "Ocurrió un error al acceder al BackEnd");

      _this.error.on();
    }).then(function (res) {
      return res.json();
    }).then(function (response) {
      _this.loader().off(); //RECIBIMOS EL TEMA


      console.log(response);
      API.resetDataControl(dataControl);
      API.serverResponse(response);
    });
  };

  API.loader = function () {
    'use strict';

    return {
      exist: function exist() {
        if ((0, _global.$)("loader")) {
          return true;
        } else {
          return false;
        }
      },
      message: function message(_message) {
        (0, _global.$)("loader").innerHTML = _message;
      },
      off: function off() {
        (0, _global.$)("loader").classList.add("none");
        (0, _global.$)("loader").style.display = "none";
      },
      on: function on() {
        (0, _global.$)("loader").classList.remove("none");
        (0, _global.$)("loader").style.display = "block";
      }
    };
  };

  return API;
}
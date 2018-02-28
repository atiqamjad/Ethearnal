(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
"use strict";

require("./modules/smartSearch.js"); // MODULE FOR SEARCHING
require("./modules/globalEvents.js"); // MODULE with GLOBAL EVENTS
require("./modules/imageCrop.js"); // MODULE with IMAGE CROPPER
require("./modules/onInitProfile.js"); // MODULE with INIT PROFILE PAGE
require("./modules/onInitProfiles.js"); // MODULE with INIT PROFILE PAGE
require("./modules/generateGigs.js"); // MODULE with Gigs generator
require("./modules/onInitGigs.js"); // MODULE with GIGS PAGE INIT
require("./modules/range-slider.js"); // MODULE with RANGE SLIDER
require("./modules/newGigModal.js"); // MODULE with CREATE NEW GIG
require("./modules/onInitNetwork.js"); // MODULE with INIT NETWORK PAGE

},{"./modules/generateGigs.js":2,"./modules/globalEvents.js":3,"./modules/imageCrop.js":4,"./modules/newGigModal.js":5,"./modules/onInitGigs.js":6,"./modules/onInitNetwork.js":7,"./modules/onInitProfile.js":8,"./modules/onInitProfiles.js":9,"./modules/range-slider.js":10,"./modules/smartSearch.js":11}],2:[function(require,module,exports){
'use strict';

// Smart Search Declarating
window.generateGigsModule = function () {

    function generateGigsFromData(gigID, gigObject, isOwn, one) {

        if (check_gig_marked_deleted(gigObject)) {
            return;
        }

        var api_cdn = api_get_cdn_url();
        var profile_image = null;
        var owner_guid = null;
        var img_src = '';
        var fullname = '';
        var categoryObj = {
            "sd": "Software Development",
            "fa": "Finance & Accounting",
            "ma": "Music & Audio",
            "gd": "Graphic & Design",
            "va": "Video & Animation",
            "tw": "Text & Writing",
            "cs": "Consulting Services",
            "os": "Other Services"
        };

        var round_price = Math.round(gigObject.price * 1000) / 1000;
        var gigDeleteString = '';
        if (isOwn) {
            var gigDeleteString = '<li class="mdl-menu__item delete">Delete</li>';
        }
        var dropdownButton = '<button id="DDB' + gigID + '" class="dropdown-gig mdl-button mdl-js-button mdl-button--icon dropdown-button btn-info-edit"><i class="material-icons">more_vert</i></button>';
        var dropdownUL = '<ul class="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect" for="DDB' + gigID + '"><li class="mdl-menu__item js-open-gig-modal">Open</li>' + gigDeleteString + '</ul>';

        if (gigObject.hasOwnProperty('owner_guid')) {
            owner_guid = gigObject.owner_guid;

            getProfileValue(owner_guid, 'profilePicture', function (profilePictureURL) {
                img_src = api_cdn + JSON.parse(profilePictureURL) + '&thumb=1';
                // $('#imgav' + gigID).attr('src', p_src);
                getProfileValue(owner_guid, 'name', function (name_jstr) {
                    var names_o = JSON.parse(name_jstr);
                    fullname = names_o.first + " " + names_o.last;
                    // $('#nmown' + gigID).text(names_o.first + " " + names_o.last);
                    var gigLayout = '<div class="user-card gig"  id="' + gigID + '" data-toggle="modal" data-target="#gigModal">\n                        <div class="img-card" style="background: url(' + (api_cdn + gigObject.image_hash) + '&thumb=1) center no-repeat; background-size: cover;" >\n                            ' + dropdownButton + '\n                            ' + dropdownUL + '\n                            <div class="card-label">' + categoryObj[gigObject.category] + '</div>\n                        </div>\n                        <div class="user-profile-img">\n                            <div class="div-img-wrap" style="background: url(\'' + img_src + '\')"></div>\n                        </div>\n                        <p class="user-name" id="nmown' + gigID + '">' + fullname + '</p>\n                        <p class="user-role">' + categoryObj[gigObject.category] + '</p>\n                        <div class="user-info">\n                            <p class="info">' + gigObject.title + '</p>\n                        </div>\n                        <div class="user-price">STARTING AT: <span><i class="material-icons">polymer</i>' + round_price + '</span></div>\n                    </div>';
                    $('.preloader-card').remove();
                    if (one == true) {
                        $(".gigs-container").prepend(gigLayout);
                    } else {
                        $(".gigs-container").append(gigLayout);
                    }
                    componentHandler.upgradeDom();
                });
            });
        }
    }

    return {
        generate: function generate(id, obj, isOwn, one) {
            return generateGigsFromData(id, obj, isOwn, one);
        }
    };
}();

},{}],3:[function(require,module,exports){
'use strict';

function filterProfileCards(query, $input) {
  /* CHECK FOR QUERY MATCH WITH NAME */
  $('.profile-user-card').each(function (i, item) {
    var name = $(item).find('.user-name').text().toLowerCase();
    name.match(query.toLowerCase()) ? $(item).removeClass('hidden') : $(item).addClass('hidden');
  });
  /* ADD RED BORDER TO INPUT IF NO SEARCH MATCHED */
  $('.profile-user-card').length == $('.profile-user-card.hidden').length ? $input.addClass('error') : $input.removeClass('error');
}

$(document).ready(function () {
  // Global Events
  $(document).click(function (e) {
    if (!$(e.target).closest('.dropdown').length) {
      $('#settings-dropdown').parents('.dropdown').removeClass('show');
    }
  });
  // Dropdown show in header
  $(document).on('click', '#settings-dropdown', function (e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).parents('.dropdown').toggleClass('show');
    // .siblings('[data-labelledby=settings-dropdown]').
  });

  // OPEN GIG BIG MODAL ON MENU click
  $('body').delegate('li.js-open-gig-modal', 'click', function (e) {
    $(this).closest('.gig').trigger('click');
  });

  /* FILTER PROFILE CARDS */
  if ($('body').hasClass('profiles-page')) {
    /* FILTER PROFILE CARDS */
    $(document).on('input', '.profiles-page #search-header', function () {
      filterProfileCards($(this).val(), $(this));
    });

    /* OPEN INTERNAL PROFILE PAGE */
    $(document).on('click', '.profile-user-card', function () {
      window.location.href = '/ui/profile/#' + $(this).attr('id');
    });
  }

  // REDIRECT TO PROFILE PAGE ON CLICK ON USERS PROFILE
  $(document).on('click', '.jsOpenGigOwnerProfile', function () {
    window.location.href = '/ui/profile/#' + $(this).attr('data-id');
  });
});

},{}],4:[function(require,module,exports){
"use strict";

window.$uploadCrop = $("#cropper-wrap-gig").croppie({
  viewport: {
    width: 450,
    height: 150
  },
  enableZoom: true,
  enableResize: true
});

window.$uploadCropProfile = $("#cropper-wrap-profile").croppie({
  viewport: {
    width: 150,
    height: 150,
    type: "circle"
  },
  enableZoom: true,
  enableResize: true
});

$(document).ready(function () {
  /* BUTTON INIT CLICK ON INPUT TYPE FILE */
  $(document).on('click', '.jsCropUpload', function () {
    var $content = $(this).closest('.content');
    $content.find('input#input-image-gig').click();
  });

  $(document).on("click", ".jsCropUploadProfile", function () {
    var $content = $(this).closest(".content");
    $content.find("input#input-image-profile").click();
  });

  /* BUTTON FOR GETTING CROP RESUlt */
  $(document).on('click', '.jsCropResult', function (e) {
    e.preventDefault();
    var $content = $(this).closest('.content');
    window.$uploadCrop.croppie('result', 'base64').then(function (base64) {
      $content.find('img#input-image-gig').attr('src', base64).show(500).removeClass('empty');
      $content.find($("#cropper-wrap-gig")).show(500);
      $content.find($(".btns-wrap").find(".btn-success")).show();
    });
    window.$uploadCrop.croppie('result', 'blob').then(function (blob) {
      window.$uploadCropBlob = blob;
      $content.find($("#cropper-wrap-gig")).hide(400);
      $content.find($(".btns-wrap").find(".btn-success")).hide();
    });
  });

  $(document).on("click", ".jsCropResultProfile", function (e) {
    e.preventDefault();
    var $content = $(this).closest(".content");
    window.$uploadCropProfile.croppie("result", "base64").then(function (base64) {
      $content.find("span#input-image-profile").css("background-image", 'url(' + base64 + ')').show(500).removeClass("empty");
      $content.find($("#cropper-wrap-profile")).show(500);
      $content.find($(".btns-wrap").find(".btn-success")).show();
    });
    window.$uploadCropProfile.croppie("result", "blob").then(function (blob) {
      window.$uploadCropBlobProfile = blob;
      $content.find($("#cropper-wrap-profile")).hide(400);
      $content.find($(".btns-wrap").find(".btn-success")).hide();
    });
  });
});

},{}],5:[function(require,module,exports){
"use strict";

window.createNewGig = function () {
    $("#add-gig").find("#newGigexpire").datepicker();
    $("#add-gig").on("hidden.bs.modal", function (e) {
        $(this).find(".gig-tags").find(".delete").click();
        $(this).find("img#input-image-gig").hide().addClass("empty").end().find(".img-label").show().removeClass("active").text('').end().find("#cropper-wrap-gig").hide().end().find($(".btns-wrap").find(".btn-success")).hide();
        $(this).find("input,textarea,select").val("").end().find(".range-slider").find("input").val("0").end().find(".range-slider__value").text("0");
        $(this).find("#new-gig-category").parent().find(".text").text("All Categories");
    });

    var calculatedLock;
    $('.jsCalculatedLock').on('input', function () {
        var cost = $('#reputationCost').val(),
            amount = $('#amount').val(),
            $calculatedLock = $('#calculatedLock'),
            calculatedLock = calcLock(cost, amount);
        $calculatedLock.text(calculatedLock + ' ERT');
    });
}();

function calcLock(cost, amount) {
    return cost * amount / 100;
}

},{}],6:[function(require,module,exports){
'use strict';

// Smart Search Declarating
window.gigsPageModule = function () {

    var gig_ctx = $("[data-target='#gigModal'");
    var el = gig_ctx.remove(0);

    function initGigs() {
        $('.nav-tabs .nav-link').removeClass('active');
        $('.nav-tabs .gigs').addClass('active');
        getListOfGigs();
    }

    return {
        oninitGigs: function oninitGigs() {
            return initGigs();
        }
    };
}();

$(document).ready(function () {
    if ($('body').hasClass('gigs-page')) {
        gigsPageModule.oninitGigs();
    }
});

},{}],7:[function(require,module,exports){
"use strict";

// Smart Search Declarating
window.networkPageModule = function () {
  function initNetwork() {
    var map;
    var infowindow = new google.maps.InfoWindow();
    function initialize() {

      var mapProp = {
        center: new google.maps.LatLng(52.4550, -3.3833),
        zoom: 5,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      map = new google.maps.Map(document.getElementById("map"), mapProp);

      var json1 = {
        "geoJSON": [{
          "geo": {
            "zip_code": "EC2V",
            "latitude": 51.5142,
            "country_name": "United Kingdom",
            "region_name": "England",
            "ip": "178.62.22.110",
            "longitude": -0.0931,
            "city": "London",
            "time_zone": "Europe/London",
            "region_code": "ENG",
            "country_code": "GB",
            "metro_code": 0
          },
          "port": "5678",
          "ip4": "178.62.22.110",
          "service_url": "http://178.62.22.110:5678"
        }, {
          "ip4": "165.227.184.55",
          "port": "5678",
          "geo": {
            "zip_code": "07014",
            "latitude": 40.8326,
            "country_name": "United States",
            "region_name": "New Jersey",
            "ip": "165.227.184.55",
            "longitude": -74.1307,
            "metro_code": 501,
            "city": "Clifton",
            "time_zone": "America/New_York",
            "region_code": "NJ",
            "country_code": "US"
          },
          "service_url": "http://165.227.184.55:5678"
        }, {
          "ip4": "46.101.223.52",
          "port": "5678",
          "geo": {
            "zip_code": "09039",
            "latitude": 50.1167,
            "metro_code": 0,
            "region_name": "Hesse",
            "ip": "46.101.223.52",
            "longitude": 8.6833,
            "country_name": "Germany",
            "city": "Frankfurt am Main",
            "time_zone": "Europe/Berlin",
            "region_code": "HE",
            "country_code": "DE"
          },
          "service_url": "http://46.101.223.52:5678"
        }]
      };

      $.each(json1.geoJSON, function (key, data) {
        var latLng = new google.maps.LatLng(data.geo.latitude, data.geo.longitude);
        var marker = new google.maps.Marker({
          position: latLng,
          map: map,
          title: data.geo.country_name
        });

        var country = data.geo.country_name;
        var ip4 = data.ip4;

        bindInfoWindow(marker, map, infowindow, country, ip4);
      });
    }

    function bindInfoWindow(marker, map, infowindow, country, ip4) {
      google.maps.event.addListener(marker, 'click', function () {

        $('#modal-network').find('.ntw-country').text(country);
        $('#modal-network').find('.ntw-ip').text(ip4);
        $("[data-target='#modal-network']").trigger('click');
        // infowindow.setContent(strDescription);
        // infowindow.open(map, marker);
      });
    }

    google.maps.event.addDomListener(window, 'load', initialize);

    //   // openlayer old
    //   var map = new ol.Map({
    //     target: 'map',
    //     layers: [
    //       new ol.layer.Tile({
    //         source: new ol.source.OSM()
    //       })
    //     ],
    //     view: new ol.View({
    //       center: ol.proj.fromLonLat([37.41, 8.82]),
    //       zoom: 4
    //     })
    //   })
    //
    //   var pin_icon = '//cdn.rawgit.com/jonataswalker/ol3-contextmenu/master/examples/img/pin_drop.png';
    //   var center_icon = '//cdn.rawgit.com/jonataswalker/ol3-contextmenu/master/examples/img/center.png';
    //   var list_icon = '//cdn.rawgit.com/jonataswalker/ol3-contextmenu/master/examples/img/view_list.png';
    //
    //   map.on('click', function (e) {
    //     console.log(this)
    //   })
  }

  return {
    oninitNetwork: function oninitNetwork() {
      return initNetwork();
    }
  };
}();

$(document).ready(function () {
  if ($('body').hasClass('network-page')) {
    networkPageModule.oninitNetwork();
  }
});

},{}],8:[function(require,module,exports){
'use strict';

// Smart Search Declarating
window.profilePageModule = function () {

    var gig_ctx = $("[data-target='#gigModal'");
    var el = gig_ctx.remove(0);

    function initProfile() {
        $('.nav-tabs .nav-link').removeClass('active');

        /* RESET AND GET NEW PROFILE ID HASH */
        window.profileID = null;

        if (window.location.hash) {
            window.profileID = window.location.hash.slice(1);
            updateProfile();
            getGigs(window.profileID);
        } else {
            $('.redesigned-gig-modal').addClass('no-button-order');
            $('.editBtnProfile').removeClass('hidden');
            getNodeData(function (nodeData) {
                var data = JSON.parse(nodeData);
                window.profileID = data.guid;
                $('.preloader-card').remove();
                updateProfile();
                getGigs(data.guid);
            });
        }
    };

    function getGigs(guid) {
        console.log(guid);
        getProfileGigs(guid, function (data) {
            var profile_gigs = JSON.parse(data);
            for (var i = 0; i < profile_gigs.length; i++) {
                $.ajax({
                    url: "/api/v1/dht/hkey/?hkey=" + profile_gigs[i],
                    hk: profile_gigs[i],
                    type: "GET",
                    processData: false,
                    success: function success(js_data) {
                        if (js_data != 'null') {
                            var gig_o = JSON.parse(js_data);
                            generateGigsModule.generate(this.hk, gig_o, true);
                        } else {
                            $('.preloader-card').remove();
                        }
                    },
                    error: function error(_error) {
                        console.log('ERR', _error);
                        return;
                    }
                });
            }
        });
    }

    function renderOneGig(gigid, one) {
        $.ajax({
            url: "/api/v1/dht/hkey/?hkey=" + gigid,
            hk: gigid,
            type: "GET",
            processData: false,
            success: function success(js_data) {
                if (js_data != 'null') {
                    var gig_o = JSON.parse(js_data);
                    generateGigsModule.generate(this.hk, gig_o, true, one);
                } else {
                    $('.preloader-card').remove();
                }
            },
            error: function error(_error2) {
                console.log('ERR', _error2);
                return;
            }
        });
    }

    return {
        oninit: initProfile,
        getAllGigs: getGigs,
        renderOneGig: renderOneGig
    };
}();

$(document).ready(function () {
    if ($('body').hasClass('profile-page')) {
        profilePageModule.oninit();
    }
});

},{}],9:[function(require,module,exports){
'use strict';

// Smart Search Declarating
window.profilesPageModule = function () {

    var gig_ctx = $("[data-target='#gigModal'");
    var el = gig_ctx.remove(0);

    function initProfiles() {
        $('.nav-tabs .nav-link').removeClass('active');
        $('.nav-tabs .profiles').addClass('active');
        main_profile_cards();
    }

    $(document).on('click', '.jsLoadMoreProfiles', function () {
        limit = limit + 9;
        main_profile_cards();
    });

    return {
        oninitprofiles: function oninitprofiles() {
            return initProfiles();
        }
    };
}();

$(document).ready(function () {
    if ($('body').hasClass('profiles-page')) {
        profilesPageModule.oninitprofiles();
    }
});

},{}],10:[function(require,module,exports){
"use strict";

window.newGigRangeSlider = function () {
	var rangeSlider = function rangeSlider() {
		var slider = $(".range-slider"),
		    range = $(".range-slider__range"),
		    value = $(".range-slider__value");

		slider.each(function () {
			value.each(function () {
				var value = $(this).prev().attr("value");
				$(this).html(value);
			});

			range.on("input", function () {
				$(this).next(value).html(this.value);
			});
		});
	};

	rangeSlider();
}();

},{}],11:[function(require,module,exports){
'use strict';

// Smart Search Declarating
window.smartSearchModule = function () {
    // Global variables for Smart Search

    var searchArray = new Array();
    var keyupTimeout = null;
    var dataLength = 0;

    var searchA = '';

    function smartSearch() {
        var url = api_idx_cdn_url();
        // build url for searching
        if (searchArray.length) {
            $.each(searchArray, function (i, item) {
                var searchQ = '';
                if (item.type == 'text' && item.value == '' && searchArray.length == 1) {
                    searchQ += 'all';
                    url += 'all';
                } else if (item.type == 'text' && item.value == '' && searchArray.length != 1) {
                    url += '';
                } else if (item.type == 'tags' && item.value == 'select') {
                    url += '';
                } else if (item.type == 'tags' && item.value == '') {
                    url += '';
                } else if (item.type == 'category' && item.value == 'all') {
                    url += 'all';
                } else if (item.type == 'q1range' && searchArray.length == 1) {
                    searchQ += 'all&' + item.type + '=' + item.value;
                    url += searchQ;
                } else {
                    searchQ += '&' + item.type + '=' + item.value;
                    url += searchQ;
                }
            });
        } else {
            url += 'all';
        }

        $.ajax({
            type: 'GET',
            url: url + '&limit=1000',
            qry: searchA,
            success: function success(data) {
                dataLength = data.length;
                if (data == 'null') {
                    data = JSON.stringify({ result: 'No results for this search' });
                }
                event_on_search_gig_data(data);
            }
        });
    }

    // Search Events

    // Submit search for text field
    $(document).on('keyup', 'input#search-header', function (e) {
        if (this.value.length < 2 && this.value.length > 0) return;
        limit = 9;
        $('.gigs-container').empty();
        delay(function () {
            var outputString = $(e.target).val().split(" ").join("%20");
            if (searchArray.length) {
                var text = false;
                searchArray.filter(function (item) {
                    if (item.type == 'text') {
                        text = true;
                        searchArray.splice(searchArray.indexOf(item), 1);
                        searchArray.push({ type: 'text', value: outputString });
                    }
                });
                if (text == false) {
                    searchArray.push({ type: 'text', value: outputString });
                }
            } else {
                searchArray.push({ type: 'text', value: outputString });
            }
            console.log(searchArray);
            smartSearchModule.search();
        }, 500);
    });

    // Submit search for dropdown expertise
    $(document).on('change', '#domain-expertise-select', function () {
        var el = $(this).dropdown('get value');
        limit = 9;
        $('.gigs-container').empty();
        delay(function () {
            if (searchArray.length) {
                searchArray.filter(function (item) {
                    if (item.type == 'tags') {
                        searchArray.splice(searchArray.indexOf(item), 1);
                    }
                });

                var category = false;
                searchArray.filter(function (item) {
                    if (item.type == 'category') {
                        category = true;
                        searchArray.splice(searchArray.indexOf(item), 1);
                        searchArray.push({ type: 'category', value: el });
                    }
                });
                if (category == false) {
                    searchArray.push({ type: 'category', value: el });
                }
            } else {
                searchArray.push({ type: 'category', value: el });
            }
            smartSearchModule.search();
            if (el != 'all') load_tags_per_domain(el);
        }, 200);
    });

    $(document).on('change', '#skills-tags', function () {
        var el = $(this).dropdown('get value');
        console.log(el);
        if (el == null) return;
        limit = 9;
        $('.gigs-container').empty();
        delay(function () {
            $('.gigs-container').empty();
            var outputString = el.join("%20");
            console.log(outputString);
            if (searchArray.length) {
                var tags = false;
                searchArray.filter(function (item) {
                    if (item.type == 'tags') {
                        tags = true;
                        searchArray.splice(searchArray.indexOf(item), 1);
                        searchArray.push({ type: 'tags', value: outputString });
                    }
                });
                if (tags == false) {
                    searchArray.push({ type: 'tags', value: outputString });
                }
            } else {
                searchArray.push({ type: 'tags', value: outputString });
            }
            smartSearchModule.search();
        }, 200);
    });

    $(document).on('mouseup touchend', '#slider-range', function () {
        var values = $(this).slider("values");
        if (values[0] == 0 && values[1] == 2000) {
            searchArray.filter(function (item) {
                if (item.type == 'q1range') {
                    searchArray.splice(searchArray.indexOf(item), 1);
                }
            });
            return;
        }
        limit = 9;
        $('.gigs-container').empty();
        delay(function () {
            if (searchArray.length) {
                var q1range = false;
                searchArray.filter(function (item) {
                    if (item.type == 'q1range') {
                        q1range = true;
                        searchArray.splice(searchArray.indexOf(item), 1);
                        searchArray.push({ type: 'q1range', value: values[0] + '%20' + values[1] });
                    }
                });
                if (q1range == false) {
                    searchArray.push({ type: 'q1range', value: values[0] + '%20' + values[1] });
                }
            } else {
                searchArray.push({ type: 'q1range', value: values[0] + '%20' + values[1] });
            }
            smartSearchModule.search();
        }, 200);
    });

    $(document).on('click', '.jsLoadMoreSearch', function () {
        limit = limit + 9;
        smartSearchModule.search();
    });

    return {
        search: function search() {
            return smartSearch();
        }
    };
}();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvbWFpbi5qcyIsInNyYy9qcy9tb2R1bGVzL2dlbmVyYXRlR2lncy5qcyIsInNyYy9qcy9tb2R1bGVzL2dsb2JhbEV2ZW50cy5qcyIsInNyYy9qcy9tb2R1bGVzL2ltYWdlQ3JvcC5qcyIsInNyYy9qcy9tb2R1bGVzL25ld0dpZ01vZGFsLmpzIiwic3JjL2pzL21vZHVsZXMvb25Jbml0R2lncy5qcyIsInNyYy9qcy9tb2R1bGVzL29uSW5pdE5ldHdvcmsuanMiLCJzcmMvanMvbW9kdWxlcy9vbkluaXRQcm9maWxlLmpzIiwic3JjL2pzL21vZHVsZXMvb25Jbml0UHJvZmlsZXMuanMiLCJzcmMvanMvbW9kdWxlcy9yYW5nZS1zbGlkZXIuanMiLCJzcmMvanMvbW9kdWxlcy9zbWFydFNlYXJjaC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsUUFBUSwwQkFBUixFLENBQXFDO0FBQ3JDLFFBQVEsMkJBQVIsRSxDQUFzQztBQUN0QyxRQUFRLHdCQUFSLEUsQ0FBbUM7QUFDbkMsUUFBUSw0QkFBUixFLENBQXVDO0FBQ3ZDLFFBQVEsNkJBQVIsRSxDQUF3QztBQUN4QyxRQUFRLDJCQUFSLEUsQ0FBc0M7QUFDdEMsUUFBUSx5QkFBUixFLENBQW9DO0FBQ3BDLFFBQVEsMkJBQVIsRSxDQUFzQztBQUN0QyxRQUFRLDBCQUFSLEUsQ0FBcUM7QUFDckMsUUFBUSw0QkFBUixFLENBQXVDOzs7OztBQ1R2QztBQUNBLE9BQU8sa0JBQVAsR0FBNkIsWUFBVzs7QUFFcEMsYUFBUyxvQkFBVCxDQUE4QixLQUE5QixFQUFxQyxTQUFyQyxFQUFnRCxLQUFoRCxFQUF1RCxHQUF2RCxFQUE0RDs7QUFFeEQsWUFBSSx5QkFBeUIsU0FBekIsQ0FBSixFQUF5QztBQUFFO0FBQVE7O0FBRW5ELFlBQUksVUFBVSxpQkFBZDtBQUNBLFlBQUksZ0JBQWdCLElBQXBCO0FBQ0EsWUFBSSxh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QTVMMEIsRUFBM0IiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfXJldHVybiBlfSkoKSIsInJlcXVpcmUoXCIuL21vZHVsZXMvc21hcnRTZWFyY2guanNcIik7IC8vIE1PRFVMRSBGT1IgU0VBUkNISU5HXG5yZXF1aXJlKFwiLi9tb2R1bGVzL2dsb2JhbEV2ZW50cy5qc1wiKTsgLy8gTU9EVUxFIHdpdGggR0xPQkFMIEVWRU5UU1xucmVxdWlyZShcIi4vbW9kdWxlcy9pbWFnZUNyb3AuanNcIik7IC8vIE1PRFVMRSB3aXRoIElNQUdFIENST1BQRVJcbnJlcXVpcmUoXCIuL21vZHVsZXMvb25Jbml0UHJvZmlsZS5qc1wiKTsgLy8gTU9EVUxFIHdpdGggSU5JVCBQUk9GSUxFIFBBR0VcbnJlcXVpcmUoXCIuL21vZHVsZXMvb25Jbml0UHJvZmlsZXMuanNcIik7IC8vIE1PRFVMRSB3aXRoIElOSVQgUFJPRklMRSBQQUdFXG5yZXF1aXJlKFwiLi9tb2R1bGVzL2dlbmVyYXRlR2lncy5qc1wiKTsgLy8gTU9EVUxFIHdpdGggR2lncyBnZW5lcmF0b3JcbnJlcXVpcmUoXCIuL21vZHVsZXMvb25Jbml0R2lncy5qc1wiKTsgLy8gTU9EVUxFIHdpdGggR0lHUyBQQUdFIElOSVRcbnJlcXVpcmUoXCIuL21vZHVsZXMvcmFuZ2Utc2xpZGVyLmpzXCIpOyAvLyBNT0RVTEUgd2l0aCBSQU5HRSBTTElERVJcbnJlcXVpcmUoXCIuL21vZHVsZXMvbmV3R2lnTW9kYWwuanNcIik7IC8vIE1PRFVMRSB3aXRoIENSRUFURSBORVcgR0lHXG5yZXF1aXJlKFwiLi9tb2R1bGVzL29uSW5pdE5ldHdvcmsuanNcIik7IC8vIE1PRFVMRSB3aXRoIElOSVQgTkVUV09SSyBQQUdFXG4iLCIvLyBTbWFydCBTZWFyY2ggRGVjbGFyYXRpbmdcbndpbmRvdy5nZW5lcmF0ZUdpZ3NNb2R1bGUgPSAoZnVuY3Rpb24oKSB7XG5cbiAgICBmdW5jdGlvbiBnZW5lcmF0ZUdpZ3NGcm9tRGF0YShnaWdJRCwgZ2lnT2JqZWN0LCBpc093biwgb25lKSB7XG4gICAgICAgXG4gICAgICAgIGlmIChjaGVja19naWdfbWFya2VkX2RlbGV0ZWQoZ2lnT2JqZWN0KSkgeyByZXR1cm4gfVxuXG4gICAgICAgIHZhciBhcGlfY2RuID0gYXBpX2dldF9jZG5fdXJsKCk7XG4gICAgICAgIHZhciBwcm9maWxlX2ltYWdlID0gbnVsbDtcbiAgICAgICAgdmFyIG93bmVyX2d1aWQgPSBudWxsO1xuICAgICAgICB2YXIgaW1nX3NyYyA9ICcnO1xuICAgICAgICB2YXIgZnVsbG5hbWUgPSAnJztcbiAgICAgICAgdmFyIGNhdGVnb3J5T2JqID0ge1xuICAgICAgICAgICAgXCJzZFwiOiBcIlNvZnR3YXJlIERldmVsb3BtZW50XCIsXG4gICAgICAgICAgICBcImZhXCI6IFwiRmluYW5jZSAmIEFjY291bnRpbmdcIixcbiAgICAgICAgICAgIFwibWFcIjogXCJNdXNpYyAmIEF1ZGlvXCIsXG4gICAgICAgICAgICBcImdkXCI6IFwiR3JhcGhpYyAmIERlc2lnblwiLFxuICAgICAgICAgICAgXCJ2YVwiOiBcIlZpZGVvICYgQW5pbWF0aW9uXCIsXG4gICAgICAgICAgICBcInR3XCI6IFwiVGV4dCAmIFdyaXRpbmdcIixcbiAgICAgICAgICAgIFwiY3NcIjogXCJDb25zdWx0aW5nIFNlcnZpY2VzXCIsXG4gICAgICAgICAgICBcIm9zXCI6IFwiT3RoZXIgU2VydmljZXNcIlxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJvdW5kX3ByaWNlID0gTWF0aC5yb3VuZChnaWdPYmplY3QucHJpY2UgKiAxMDAwKSAvIDEwMDA7XG4gICAgICAgIHZhciBnaWdEZWxldGVTdHJpbmcgPSAnJztcbiAgICAgICAgaWYgKGlzT3duKSB7XG4gICAgICAgICAgICB2YXIgZ2lnRGVsZXRlU3RyaW5nID0gJzxsaSBjbGFzcz1cIm1kbC1tZW51X19pdGVtIGRlbGV0ZVwiPkRlbGV0ZTwvbGk+J1xuICAgICAgICB9XG4gICAgICAgIHZhciBkcm9wZG93bkJ1dHRvbiA9ICc8YnV0dG9uIGlkPVwiRERCJyArIGdpZ0lEICsgJ1wiIGNsYXNzPVwiZHJvcGRvd24tZ2lnIG1kbC1idXR0b24gbWRsLWpzLWJ1dHRvbiBtZGwtYnV0dG9uLS1pY29uIGRyb3Bkb3duLWJ1dHRvbiBidG4taW5mby1lZGl0XCI+PGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiPm1vcmVfdmVydDwvaT48L2J1dHRvbj4nO1xuICAgICAgICB2YXIgZHJvcGRvd25VTCA9ICc8dWwgY2xhc3M9XCJtZGwtbWVudSBtZGwtbWVudS0tYm90dG9tLXJpZ2h0IG1kbC1qcy1tZW51IG1kbC1qcy1yaXBwbGUtZWZmZWN0XCIgZm9yPVwiRERCJyArIGdpZ0lEICsgJ1wiPjxsaSBjbGFzcz1cIm1kbC1tZW51X19pdGVtIGpzLW9wZW4tZ2lnLW1vZGFsXCI+T3BlbjwvbGk+JyArIGdpZ0RlbGV0ZVN0cmluZyArICc8L3VsPic7XG5cbiAgICAgICAgaWYgKGdpZ09iamVjdC5oYXNPd25Qcm9wZXJ0eSgnb3duZXJfZ3VpZCcpKSB7XG4gICAgICAgICAgICBvd25lcl9ndWlkID0gZ2lnT2JqZWN0Lm93bmVyX2d1aWQ7XG5cbiAgICAgICAgICAgIGdldFByb2ZpbGVWYWx1ZShvd25lcl9ndWlkLCAncHJvZmlsZVBpY3R1cmUnLCBmdW5jdGlvbihwcm9maWxlUGljdHVyZVVSTCkge1xuICAgICAgICAgICAgICAgIGltZ19zcmMgPSBhcGlfY2RuICsgSlNPTi5wYXJzZShwcm9maWxlUGljdHVyZVVSTCkgKyAnJnRodW1iPTEnO1xuICAgICAgICAgICAgICAgIC8vICQoJyNpbWdhdicgKyBnaWdJRCkuYXR0cignc3JjJywgcF9zcmMpO1xuICAgICAgICAgICAgICAgIGdldFByb2ZpbGVWYWx1ZShvd25lcl9ndWlkLCAnbmFtZScsIGZ1bmN0aW9uKG5hbWVfanN0cikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmFtZXNfbyA9IEpTT04ucGFyc2UobmFtZV9qc3RyKTtcbiAgICAgICAgICAgICAgICAgICAgZnVsbG5hbWUgPSBuYW1lc19vLmZpcnN0ICsgXCIgXCIgKyBuYW1lc19vLmxhc3Q7XG4gICAgICAgICAgICAgICAgICAgIC8vICQoJyNubW93bicgKyBnaWdJRCkudGV4dChuYW1lc19vLmZpcnN0ICsgXCIgXCIgKyBuYW1lc19vLmxhc3QpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZ2lnTGF5b3V0ID0gYDxkaXYgY2xhc3M9XCJ1c2VyLWNhcmQgZ2lnXCIgIGlkPVwiJHtnaWdJRH1cIiBkYXRhLXRvZ2dsZT1cIm1vZGFsXCIgZGF0YS10YXJnZXQ9XCIjZ2lnTW9kYWxcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbWctY2FyZFwiIHN0eWxlPVwiYmFja2dyb3VuZDogdXJsKCR7YXBpX2NkbiArIGdpZ09iamVjdC5pbWFnZV9oYXNofSZ0aHVtYj0xKSBjZW50ZXIgbm8tcmVwZWF0OyBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1wiID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2Ryb3Bkb3duQnV0dG9ufVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7ZHJvcGRvd25VTH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZC1sYWJlbFwiPiR7Y2F0ZWdvcnlPYmpbZ2lnT2JqZWN0LmNhdGVnb3J5XX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInVzZXItcHJvZmlsZS1pbWdcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGl2LWltZy13cmFwXCIgc3R5bGU9XCJiYWNrZ3JvdW5kOiB1cmwoJyR7aW1nX3NyY30nKVwiPjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzcz1cInVzZXItbmFtZVwiIGlkPVwibm1vd24ke2dpZ0lEfVwiPiR7ZnVsbG5hbWV9PC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJ1c2VyLXJvbGVcIj4ke2NhdGVnb3J5T2JqW2dpZ09iamVjdC5jYXRlZ29yeV19PC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInVzZXItaW5mb1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwiaW5mb1wiPiR7Z2lnT2JqZWN0LnRpdGxlfTwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInVzZXItcHJpY2VcIj5TVEFSVElORyBBVDogPHNwYW4+PGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiPnBvbHltZXI8L2k+JHtyb3VuZF9wcmljZX08L3NwYW4+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PmA7XG4gICAgICAgICAgICAgICAgICAgICQoJy5wcmVsb2FkZXItY2FyZCcpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAob25lID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoXCIuZ2lncy1jb250YWluZXJcIikucHJlcGVuZChnaWdMYXlvdXQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgJChcIi5naWdzLWNvbnRhaW5lclwiKS5hcHBlbmQoZ2lnTGF5b3V0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRIYW5kbGVyLnVwZ3JhZGVEb20oKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2VuZXJhdGU6IGZ1bmN0aW9uKGlkLCBvYmosIGlzT3duLCBvbmUpIHtcbiAgICAgICAgICAgIHJldHVybiBnZW5lcmF0ZUdpZ3NGcm9tRGF0YShpZCwgb2JqLCBpc093biwgb25lKTtcbiAgICAgICAgfVxuICAgIH1cblxufSkoKTtcbiIsImZ1bmN0aW9uIGZpbHRlclByb2ZpbGVDYXJkcyhxdWVyeSwgJGlucHV0KSB7XG4gIC8qIENIRUNLIEZPUiBRVUVSWSBNQVRDSCBXSVRIIE5BTUUgKi9cbiAgJCgnLnByb2ZpbGUtdXNlci1jYXJkJykuZWFjaChmdW5jdGlvbihpLGl0ZW0pIHtcbiAgICB2YXIgbmFtZSA9ICQoaXRlbSkuZmluZCgnLnVzZXItbmFtZScpLnRleHQoKS50b0xvd2VyQ2FzZSgpO1xuICAgIG5hbWUubWF0Y2gocXVlcnkudG9Mb3dlckNhc2UoKSkgPyAkKGl0ZW0pLnJlbW92ZUNsYXNzKCdoaWRkZW4nKSA6ICQoaXRlbSkuYWRkQ2xhc3MoJ2hpZGRlbicpXG4gIH0pO1xuICAvKiBBREQgUkVEIEJPUkRFUiBUTyBJTlBVVCBJRiBOTyBTRUFSQ0ggTUFUQ0hFRCAqL1xuICAkKCcucHJvZmlsZS11c2VyLWNhcmQnKS5sZW5ndGggPT0gJCgnLnByb2ZpbGUtdXNlci1jYXJkLmhpZGRlbicpLmxlbmd0aCA/ICRpbnB1dC5hZGRDbGFzcygnZXJyb3InKSA6ICRpbnB1dC5yZW1vdmVDbGFzcygnZXJyb3InKTtcbn1cblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgLy8gR2xvYmFsIEV2ZW50c1xuICAkKGRvY3VtZW50KS5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgICBpZiAoISQoZS50YXJnZXQpLmNsb3Nlc3QoJy5kcm9wZG93bicpLmxlbmd0aCkge1xuICAgICAgICAgICQoJyNzZXR0aW5ncy1kcm9wZG93bicpLnBhcmVudHMoJy5kcm9wZG93bicpLnJlbW92ZUNsYXNzKCdzaG93Jyk7XG4gICAgICB9XG4gIH0pO1xuICAvLyBEcm9wZG93biBzaG93IGluIGhlYWRlclxuICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnI3NldHRpbmdzLWRyb3Bkb3duJywgZnVuY3Rpb24oZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICQodGhpcykucGFyZW50cygnLmRyb3Bkb3duJykudG9nZ2xlQ2xhc3MoJ3Nob3cnKTtcbiAgICAgIC8vIC5zaWJsaW5ncygnW2RhdGEtbGFiZWxsZWRieT1zZXR0aW5ncy1kcm9wZG93bl0nKS5cbiAgfSk7XG5cbiAgLy8gT1BFTiBHSUcgQklHIE1PREFMIE9OIE1FTlUgY2xpY2tcbiAgJCgnYm9keScpLmRlbGVnYXRlKCdsaS5qcy1vcGVuLWdpZy1tb2RhbCcsICdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAkKHRoaXMpLmNsb3Nlc3QoJy5naWcnKS50cmlnZ2VyKCdjbGljaycpO1xuICB9KTtcblxuICAvKiBGSUxURVIgUFJPRklMRSBDQVJEUyAqL1xuICBpZiAoICQoJ2JvZHknKS5oYXNDbGFzcygncHJvZmlsZXMtcGFnZScpICkge1xuICAgIC8qIEZJTFRFUiBQUk9GSUxFIENBUkRTICovXG4gICAgJChkb2N1bWVudCkub24oJ2lucHV0JywgJy5wcm9maWxlcy1wYWdlICNzZWFyY2gtaGVhZGVyJywgZnVuY3Rpb24oKSB7XG4gICAgICBmaWx0ZXJQcm9maWxlQ2FyZHMoICQodGhpcykudmFsKCksICQodGhpcykgKTtcbiAgICB9KTtcblxuICAgIC8qIE9QRU4gSU5URVJOQUwgUFJPRklMRSBQQUdFICovXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywnLnByb2ZpbGUtdXNlci1jYXJkJyxmdW5jdGlvbigpe1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL3VpL3Byb2ZpbGUvIycgKyAkKHRoaXMpLmF0dHIoJ2lkJyk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBSRURJUkVDVCBUTyBQUk9GSUxFIFBBR0UgT04gQ0xJQ0sgT04gVVNFUlMgUFJPRklMRVxuICAkKGRvY3VtZW50KS5vbignY2xpY2snLCcuanNPcGVuR2lnT3duZXJQcm9maWxlJyxmdW5jdGlvbigpIHtcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvdWkvcHJvZmlsZS8jJyArICQodGhpcykuYXR0cignZGF0YS1pZCcpO1xuICB9KTtcbn0pXG4iLCJ3aW5kb3cuJHVwbG9hZENyb3AgPSAkKFwiI2Nyb3BwZXItd3JhcC1naWdcIikuY3JvcHBpZSh7XG4gIHZpZXdwb3J0OiB7XG4gICAgd2lkdGg6IDQ1MCxcbiAgICBoZWlnaHQ6IDE1MFxuICB9LFxuICBlbmFibGVab29tOiB0cnVlLFxuICBlbmFibGVSZXNpemU6IHRydWVcbn0pO1xuXG53aW5kb3cuJHVwbG9hZENyb3BQcm9maWxlID0gJChcIiNjcm9wcGVyLXdyYXAtcHJvZmlsZVwiKS5jcm9wcGllKHtcbiAgdmlld3BvcnQ6IHtcbiAgICB3aWR0aDogMTUwLFxuICAgIGhlaWdodDogMTUwLFxuICAgIHR5cGU6IFwiY2lyY2xlXCJcbiAgfSxcbiAgZW5hYmxlWm9vbTogdHJ1ZSxcbiAgZW5hYmxlUmVzaXplOiB0cnVlXG59KTtcblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAvKiBCVVRUT04gSU5JVCBDTElDSyBPTiBJTlBVVCBUWVBFIEZJTEUgKi9cbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCcuanNDcm9wVXBsb2FkJyxmdW5jdGlvbigpe1xuICAgICAgdmFyICRjb250ZW50ID0gJCh0aGlzKS5jbG9zZXN0KCcuY29udGVudCcpO1xuICAgICAgJGNvbnRlbnQuZmluZCgnaW5wdXQjaW5wdXQtaW1hZ2UtZ2lnJykuY2xpY2soKTtcbiAgICB9KTtcblxuICAgICQoZG9jdW1lbnQpLm9uKFwiY2xpY2tcIiwgXCIuanNDcm9wVXBsb2FkUHJvZmlsZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciAkY29udGVudCA9ICQodGhpcykuY2xvc2VzdChcIi5jb250ZW50XCIpO1xuICAgICAgJGNvbnRlbnQuZmluZChcImlucHV0I2lucHV0LWltYWdlLXByb2ZpbGVcIikuY2xpY2soKTtcbiAgICB9KTtcblxuICAgIC8qIEJVVFRPTiBGT1IgR0VUVElORyBDUk9QIFJFU1VsdCAqL1xuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsJy5qc0Nyb3BSZXN1bHQnLGZ1bmN0aW9uKGUpe1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdmFyICRjb250ZW50ID0gJCh0aGlzKS5jbG9zZXN0KCcuY29udGVudCcpO1xuICAgICAgd2luZG93LiR1cGxvYWRDcm9wLmNyb3BwaWUoJ3Jlc3VsdCcsJ2Jhc2U2NCcpLnRoZW4oIGZ1bmN0aW9uKGJhc2U2NCkge1xuICAgICAgICAkY29udGVudC5maW5kKCdpbWcjaW5wdXQtaW1hZ2UtZ2lnJykuYXR0cignc3JjJywgYmFzZTY0KS5zaG93KDUwMCkucmVtb3ZlQ2xhc3MoJ2VtcHR5Jyk7XG4gICAgICAgICRjb250ZW50LmZpbmQoJChcIiNjcm9wcGVyLXdyYXAtZ2lnXCIpKS5zaG93KDUwMCk7XG4gICAgICAgICRjb250ZW50LmZpbmQoJChcIi5idG5zLXdyYXBcIikuZmluZChcIi5idG4tc3VjY2Vzc1wiKSkuc2hvdygpO1xuICAgICAgfSk7XG4gICAgICB3aW5kb3cuJHVwbG9hZENyb3AuY3JvcHBpZSgncmVzdWx0JywnYmxvYicpLnRoZW4oIGZ1bmN0aW9uKGJsb2IpIHtcbiAgICAgICAgd2luZG93LiR1cGxvYWRDcm9wQmxvYiA9IGJsb2I7XG4gICAgICAgICRjb250ZW50LmZpbmQoJChcIiNjcm9wcGVyLXdyYXAtZ2lnXCIpKS5oaWRlKDQwMCk7XG4gICAgICAgICRjb250ZW50LmZpbmQoJChcIi5idG5zLXdyYXBcIikuZmluZChcIi5idG4tc3VjY2Vzc1wiKSkuaGlkZSgpO1xuICAgICAgfSk7XG4gICAgfSlcblxuICAgICQoZG9jdW1lbnQpLm9uKFwiY2xpY2tcIiwgXCIuanNDcm9wUmVzdWx0UHJvZmlsZVwiLCBmdW5jdGlvbihlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB2YXIgJGNvbnRlbnQgPSAkKHRoaXMpLmNsb3Nlc3QoXCIuY29udGVudFwiKTtcbiAgICAgIHdpbmRvdy4kdXBsb2FkQ3JvcFByb2ZpbGUuY3JvcHBpZShcInJlc3VsdFwiLCBcImJhc2U2NFwiKS50aGVuKGZ1bmN0aW9uKGJhc2U2NCkge1xuICAgICAgICAgICRjb250ZW50LmZpbmQoXCJzcGFuI2lucHV0LWltYWdlLXByb2ZpbGVcIikuY3NzKFwiYmFja2dyb3VuZC1pbWFnZVwiLCAndXJsKCcrIGJhc2U2NCArJyknKS5zaG93KDUwMCkucmVtb3ZlQ2xhc3MoXCJlbXB0eVwiKTtcbiAgICAgICAgICAkY29udGVudC5maW5kKCQoXCIjY3JvcHBlci13cmFwLXByb2ZpbGVcIikpLnNob3coNTAwKTtcbiAgICAgICAgICAkY29udGVudC5maW5kKCQoXCIuYnRucy13cmFwXCIpLmZpbmQoXCIuYnRuLXN1Y2Nlc3NcIikpLnNob3coKTtcbiAgICAgICAgfSk7XG4gICAgICB3aW5kb3cuJHVwbG9hZENyb3BQcm9maWxlLmNyb3BwaWUoXCJyZXN1bHRcIiwgXCJibG9iXCIpLnRoZW4oZnVuY3Rpb24oYmxvYikge1xuICAgICAgICB3aW5kb3cuJHVwbG9hZENyb3BCbG9iUHJvZmlsZSA9IGJsb2I7XG4gICAgICAgICRjb250ZW50LmZpbmQoJChcIiNjcm9wcGVyLXdyYXAtcHJvZmlsZVwiKSkuaGlkZSg0MDApO1xuICAgICAgICAkY29udGVudC5maW5kKCQoXCIuYnRucy13cmFwXCIpLmZpbmQoXCIuYnRuLXN1Y2Nlc3NcIikpLmhpZGUoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xufSk7XG4iLCJ3aW5kb3cuY3JlYXRlTmV3R2lnID0gKGZ1bmN0aW9uKCkge1xuICAgICQoXCIjYWRkLWdpZ1wiKS5maW5kKFwiI25ld0dpZ2V4cGlyZVwiKS5kYXRlcGlja2VyKCk7XG4gICAgJChcIiNhZGQtZ2lnXCIpLm9uKFwiaGlkZGVuLmJzLm1vZGFsXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgJCh0aGlzKS5maW5kKFwiLmdpZy10YWdzXCIpLmZpbmQoXCIuZGVsZXRlXCIpLmNsaWNrKCk7XG4gICAgICAgICQodGhpcylcbiAgICAgICAgICAgIC5maW5kKFwiaW1nI2lucHV0LWltYWdlLWdpZ1wiKS5oaWRlKCkuYWRkQ2xhc3MoXCJlbXB0eVwiKS5lbmQoKVxuICAgICAgICAgICAgLmZpbmQoXCIuaW1nLWxhYmVsXCIpLnNob3coKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKS50ZXh0KCcnKS5lbmQoKVxuICAgICAgICAgICAgLmZpbmQoXCIjY3JvcHBlci13cmFwLWdpZ1wiKS5oaWRlKCkuZW5kKClcbiAgICAgICAgICAgIC5maW5kKCQoXCIuYnRucy13cmFwXCIpLmZpbmQoXCIuYnRuLXN1Y2Nlc3NcIikpLmhpZGUoKTtcbiAgICAgICAgJCh0aGlzKVxuICAgICAgICAgICAgLmZpbmQoXCJpbnB1dCx0ZXh0YXJlYSxzZWxlY3RcIikudmFsKFwiXCIpLmVuZCgpXG4gICAgICAgICAgICAuZmluZChcIi5yYW5nZS1zbGlkZXJcIilcbiAgICAgICAgICAgIC5maW5kKFwiaW5wdXRcIikudmFsKFwiMFwiKS5lbmQoKVxuICAgICAgICAgICAgLmZpbmQoXCIucmFuZ2Utc2xpZGVyX192YWx1ZVwiKS50ZXh0KFwiMFwiKTtcbiAgICAgICAgJCh0aGlzKS5maW5kKFwiI25ldy1naWctY2F0ZWdvcnlcIikucGFyZW50KCkuZmluZChcIi50ZXh0XCIpLnRleHQoXCJBbGwgQ2F0ZWdvcmllc1wiKTtcbiAgICB9KTtcblxuICAgIHZhciBjYWxjdWxhdGVkTG9jaztcbiAgICAkKCcuanNDYWxjdWxhdGVkTG9jaycpLm9uKCdpbnB1dCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBjb3N0ID0gJCgnI3JlcHV0YXRpb25Db3N0JykudmFsKCksXG4gICAgICAgICAgYW1vdW50ID0gJCgnI2Ftb3VudCcpLnZhbCgpLFxuICAgICAgICAgICRjYWxjdWxhdGVkTG9jayA9ICQoJyNjYWxjdWxhdGVkTG9jaycpLFxuICAgICAgICAgIGNhbGN1bGF0ZWRMb2NrID0gY2FsY0xvY2soY29zdCwgYW1vdW50KVxuICAgICAgICAgICRjYWxjdWxhdGVkTG9jay50ZXh0KGNhbGN1bGF0ZWRMb2NrICsgJyBFUlQnKTtcbiAgICB9KVxuXG59KSgpO1xuXG5mdW5jdGlvbiBjYWxjTG9jayAoY29zdCwgYW1vdW50KSB7XG4gIHJldHVybiAoY29zdCAqIGFtb3VudCkgLyAxMDA7XG59XG4iLCIvLyBTbWFydCBTZWFyY2ggRGVjbGFyYXRpbmdcbndpbmRvdy5naWdzUGFnZU1vZHVsZSA9IChmdW5jdGlvbigpIHtcblxuICAgIHZhciBnaWdfY3R4ID0gJChcIltkYXRhLXRhcmdldD0nI2dpZ01vZGFsJ1wiKVxuICAgIHZhciBlbCA9IGdpZ19jdHgucmVtb3ZlKDApO1xuXG4gICAgZnVuY3Rpb24gaW5pdEdpZ3MoKSB7XG4gICAgICAgICQoJy5uYXYtdGFicyAubmF2LWxpbmsnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICQoJy5uYXYtdGFicyAuZ2lncycpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgZ2V0TGlzdE9mR2lncygpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIG9uaW5pdEdpZ3M6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGluaXRHaWdzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbn0pKCk7XG5cblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAgaWYgKCQoJ2JvZHknKS5oYXNDbGFzcygnZ2lncy1wYWdlJykpIHtcbiAgICAgICAgZ2lnc1BhZ2VNb2R1bGUub25pbml0R2lncygpO1xuICAgIH1cbn0pOyIsIi8vIFNtYXJ0IFNlYXJjaCBEZWNsYXJhdGluZ1xud2luZG93Lm5ldHdvcmtQYWdlTW9kdWxlID0gKGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gaW5pdE5ldHdvcmsgKCkge1xuICAgIHZhciBtYXA7XG4gICAgdmFyIGluZm93aW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdygpO1xuICAgIGZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XG5cbiAgICAgICAgdmFyIG1hcFByb3AgPSB7XG4gICAgICAgICAgICBjZW50ZXI6IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoNTIuNDU1MCwgLTMuMzgzMyksXG4gICAgICAgICAgICB6b29tOiA1LFxuICAgICAgICAgICAgbWFwVHlwZUlkOiBnb29nbGUubWFwcy5NYXBUeXBlSWQuUk9BRE1BUFxuICAgICAgICB9O1xuXG4gICAgICAgIG1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYXBcIiksIG1hcFByb3ApO1xuXG4gICAgICAgIHZhciBqc29uMSA9IHtcbiAgICAgICAgICBcImdlb0pTT05cIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJnZW9cIjoge1xuICAgICAgICAgICAgICAgICAgXCJ6aXBfY29kZVwiOiBcIkVDMlZcIixcbiAgICAgICAgICAgICAgICAgIFwibGF0aXR1ZGVcIjogNTEuNTE0MixcbiAgICAgICAgICAgICAgICAgIFwiY291bnRyeV9uYW1lXCI6IFwiVW5pdGVkIEtpbmdkb21cIixcbiAgICAgICAgICAgICAgICAgIFwicmVnaW9uX25hbWVcIjogXCJFbmdsYW5kXCIsXG4gICAgICAgICAgICAgICAgICBcImlwXCI6IFwiMTc4LjYyLjIyLjExMFwiLFxuICAgICAgICAgICAgICAgICAgXCJsb25naXR1ZGVcIjogLTAuMDkzMSxcbiAgICAgICAgICAgICAgICAgIFwiY2l0eVwiOiBcIkxvbmRvblwiLFxuICAgICAgICAgICAgICAgICAgXCJ0aW1lX3pvbmVcIjogXCJFdXJvcGUvTG9uZG9uXCIsXG4gICAgICAgICAgICAgICAgICBcInJlZ2lvbl9jb2RlXCI6IFwiRU5HXCIsXG4gICAgICAgICAgICAgICAgICBcImNvdW50cnlfY29kZVwiOiBcIkdCXCIsXG4gICAgICAgICAgICAgICAgICBcIm1ldHJvX2NvZGVcIjogMFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJwb3J0XCI6IFwiNTY3OFwiLFxuICAgICAgICAgICAgICAgIFwiaXA0XCI6IFwiMTc4LjYyLjIyLjExMFwiLFxuICAgICAgICAgICAgICAgIFwic2VydmljZV91cmxcIjogXCJodHRwOi8vMTc4LjYyLjIyLjExMDo1Njc4XCJcbiAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIFwiaXA0XCI6IFwiMTY1LjIyNy4xODQuNTVcIixcbiAgICAgICAgICAgICAgICBcInBvcnRcIjogXCI1Njc4XCIsXG4gICAgICAgICAgICAgICAgXCJnZW9cIjoge1xuICAgICAgICAgICAgICAgICAgXCJ6aXBfY29kZVwiOiBcIjA3MDE0XCIsXG4gICAgICAgICAgICAgICAgICBcImxhdGl0dWRlXCI6IDQwLjgzMjYsXG4gICAgICAgICAgICAgICAgICBcImNvdW50cnlfbmFtZVwiOiBcIlVuaXRlZCBTdGF0ZXNcIixcbiAgICAgICAgICAgICAgICAgIFwicmVnaW9uX25hbWVcIjogXCJOZXcgSmVyc2V5XCIsXG4gICAgICAgICAgICAgICAgICBcImlwXCI6IFwiMTY1LjIyNy4xODQuNTVcIixcbiAgICAgICAgICAgICAgICAgIFwibG9uZ2l0dWRlXCI6IC03NC4xMzA3LFxuICAgICAgICAgICAgICAgICAgXCJtZXRyb19jb2RlXCI6IDUwMSxcbiAgICAgICAgICAgICAgICAgIFwiY2l0eVwiOiBcIkNsaWZ0b25cIixcbiAgICAgICAgICAgICAgICAgIFwidGltZV96b25lXCI6IFwiQW1lcmljYS9OZXdfWW9ya1wiLFxuICAgICAgICAgICAgICAgICAgXCJyZWdpb25fY29kZVwiOiBcIk5KXCIsXG4gICAgICAgICAgICAgICAgICBcImNvdW50cnlfY29kZVwiOiBcIlVTXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwic2VydmljZV91cmxcIjogXCJodHRwOi8vMTY1LjIyNy4xODQuNTU6NTY3OFwiXG4gICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBcImlwNFwiOiBcIjQ2LjEwMS4yMjMuNTJcIixcbiAgICAgICAgICAgICAgICBcInBvcnRcIjogXCI1Njc4XCIsXG4gICAgICAgICAgICAgICAgXCJnZW9cIjoge1xuICAgICAgICAgICAgICAgICAgXCJ6aXBfY29kZVwiOiBcIjA5MDM5XCIsXG4gICAgICAgICAgICAgICAgICBcImxhdGl0dWRlXCI6IDUwLjExNjcsXG4gICAgICAgICAgICAgICAgICBcIm1ldHJvX2NvZGVcIjogMCxcbiAgICAgICAgICAgICAgICAgIFwicmVnaW9uX25hbWVcIjogXCJIZXNzZVwiLFxuICAgICAgICAgICAgICAgICAgXCJpcFwiOiBcIjQ2LjEwMS4yMjMuNTJcIixcbiAgICAgICAgICAgICAgICAgIFwibG9uZ2l0dWRlXCI6IDguNjgzMyxcbiAgICAgICAgICAgICAgICAgIFwiY291bnRyeV9uYW1lXCI6IFwiR2VybWFueVwiLFxuICAgICAgICAgICAgICAgICAgXCJjaXR5XCI6IFwiRnJhbmtmdXJ0IGFtIE1haW5cIixcbiAgICAgICAgICAgICAgICAgIFwidGltZV96b25lXCI6IFwiRXVyb3BlL0JlcmxpblwiLFxuICAgICAgICAgICAgICAgICAgXCJyZWdpb25fY29kZVwiOiBcIkhFXCIsXG4gICAgICAgICAgICAgICAgICBcImNvdW50cnlfY29kZVwiOiBcIkRFXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwic2VydmljZV91cmxcIjogXCJodHRwOi8vNDYuMTAxLjIyMy41Mjo1Njc4XCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9O1xuXG4gICAgICAgICQuZWFjaChqc29uMS5nZW9KU09OLCBmdW5jdGlvbiAoa2V5LCBkYXRhKSB7XG4gICAgICAgICAgdmFyIGxhdExuZyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoZGF0YS5nZW8ubGF0aXR1ZGUsIGRhdGEuZ2VvLmxvbmdpdHVkZSk7XG4gICAgICAgICAgdmFyIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuICAgICAgICAgICAgICBwb3NpdGlvbjogbGF0TG5nLFxuICAgICAgICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgICAgICAgdGl0bGU6IGRhdGEuZ2VvLmNvdW50cnlfbmFtZVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdmFyIGNvdW50cnkgPSBkYXRhLmdlby5jb3VudHJ5X25hbWU7XG4gICAgICAgICAgdmFyIGlwNCA9IGRhdGEuaXA0O1xuXG4gICAgICAgICAgYmluZEluZm9XaW5kb3cobWFya2VyLCBtYXAsIGluZm93aW5kb3csIGNvdW50cnksIGlwNCk7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBiaW5kSW5mb1dpbmRvdyhtYXJrZXIsIG1hcCwgaW5mb3dpbmRvdywgY291bnRyeSwgaXA0KSB7XG4gICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcmtlciwgJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgJCgnI21vZGFsLW5ldHdvcmsnKS5maW5kKCcubnR3LWNvdW50cnknKS50ZXh0KGNvdW50cnkpXG4gICAgICAgICAgJCgnI21vZGFsLW5ldHdvcmsnKS5maW5kKCcubnR3LWlwJykudGV4dChpcDQpXG4gICAgICAgICAgJChcIltkYXRhLXRhcmdldD0nI21vZGFsLW5ldHdvcmsnXVwiKS50cmlnZ2VyKCdjbGljaycpXG4gICAgICAgICAgICAvLyBpbmZvd2luZG93LnNldENvbnRlbnQoc3RyRGVzY3JpcHRpb24pO1xuICAgICAgICAgICAgLy8gaW5mb3dpbmRvdy5vcGVuKG1hcCwgbWFya2VyKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkRG9tTGlzdGVuZXIod2luZG93LCAnbG9hZCcsIGluaXRpYWxpemUpO1xuXG4gIC8vICAgLy8gb3BlbmxheWVyIG9sZFxuICAvLyAgIHZhciBtYXAgPSBuZXcgb2wuTWFwKHtcbiAgLy8gICAgIHRhcmdldDogJ21hcCcsXG4gIC8vICAgICBsYXllcnM6IFtcbiAgLy8gICAgICAgbmV3IG9sLmxheWVyLlRpbGUoe1xuICAvLyAgICAgICAgIHNvdXJjZTogbmV3IG9sLnNvdXJjZS5PU00oKVxuICAvLyAgICAgICB9KVxuICAvLyAgICAgXSxcbiAgLy8gICAgIHZpZXc6IG5ldyBvbC5WaWV3KHtcbiAgLy8gICAgICAgY2VudGVyOiBvbC5wcm9qLmZyb21Mb25MYXQoWzM3LjQxLCA4LjgyXSksXG4gIC8vICAgICAgIHpvb206IDRcbiAgLy8gICAgIH0pXG4gIC8vICAgfSlcbiAgLy9cbiAgLy8gICB2YXIgcGluX2ljb24gPSAnLy9jZG4ucmF3Z2l0LmNvbS9qb25hdGFzd2Fsa2VyL29sMy1jb250ZXh0bWVudS9tYXN0ZXIvZXhhbXBsZXMvaW1nL3Bpbl9kcm9wLnBuZyc7XG4gIC8vICAgdmFyIGNlbnRlcl9pY29uID0gJy8vY2RuLnJhd2dpdC5jb20vam9uYXRhc3dhbGtlci9vbDMtY29udGV4dG1lbnUvbWFzdGVyL2V4YW1wbGVzL2ltZy9jZW50ZXIucG5nJztcbiAgLy8gICB2YXIgbGlzdF9pY29uID0gJy8vY2RuLnJhd2dpdC5jb20vam9uYXRhc3dhbGtlci9vbDMtY29udGV4dG1lbnUvbWFzdGVyL2V4YW1wbGVzL2ltZy92aWV3X2xpc3QucG5nJztcbiAgLy9cbiAgLy8gICBtYXAub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgLy8gICAgIGNvbnNvbGUubG9nKHRoaXMpXG4gIC8vICAgfSlcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgb25pbml0TmV0d29yazogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGluaXROZXR3b3JrKClcbiAgICB9XG4gIH1cbn0pKClcblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAgaWYgKCQoJ2JvZHknKS5oYXNDbGFzcygnbmV0d29yay1wYWdlJykpIHtcbiAgICAgICAgbmV0d29ya1BhZ2VNb2R1bGUub25pbml0TmV0d29yaygpO1xuICAgIH1cbn0pO1xuIiwiLy8gU21hcnQgU2VhcmNoIERlY2xhcmF0aW5nXG53aW5kb3cucHJvZmlsZVBhZ2VNb2R1bGUgPSAoZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgZ2lnX2N0eCA9ICQoXCJbZGF0YS10YXJnZXQ9JyNnaWdNb2RhbCdcIilcbiAgICB2YXIgZWwgPSBnaWdfY3R4LnJlbW92ZSgwKTtcblxuICAgIGZ1bmN0aW9uIGluaXRQcm9maWxlKCkge1xuICAgICAgICAkKCcubmF2LXRhYnMgLm5hdi1saW5rJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgIC8qIFJFU0VUIEFORCBHRVQgTkVXIFBST0ZJTEUgSUQgSEFTSCAqL1xuICAgICAgICB3aW5kb3cucHJvZmlsZUlEID0gbnVsbDtcblxuICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLmhhc2gpIHtcbiAgICAgICAgICAgIHdpbmRvdy5wcm9maWxlSUQgPSB3aW5kb3cubG9jYXRpb24uaGFzaC5zbGljZSgxKTtcbiAgICAgICAgICAgIHVwZGF0ZVByb2ZpbGUoKTtcbiAgICAgICAgICAgIGdldEdpZ3Mod2luZG93LnByb2ZpbGVJRCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKCcucmVkZXNpZ25lZC1naWctbW9kYWwnKS5hZGRDbGFzcygnbm8tYnV0dG9uLW9yZGVyJyk7XG4gICAgICAgICAgICAkKCcuZWRpdEJ0blByb2ZpbGUnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICBnZXROb2RlRGF0YShmdW5jdGlvbihub2RlRGF0YSkge1xuICAgICAgICAgICAgICAgIHZhciBkYXRhID0gSlNPTi5wYXJzZShub2RlRGF0YSk7XG4gICAgICAgICAgICAgICAgd2luZG93LnByb2ZpbGVJRCA9IGRhdGEuZ3VpZDtcbiAgICAgICAgICAgICAgICAkKCcucHJlbG9hZGVyLWNhcmQnKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICB1cGRhdGVQcm9maWxlKCk7XG4gICAgICAgICAgICAgICAgZ2V0R2lncyhkYXRhLmd1aWQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZ2V0R2lncyhndWlkKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGd1aWQpO1xuICAgICAgICBnZXRQcm9maWxlR2lncyhndWlkLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICB2YXIgcHJvZmlsZV9naWdzID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvZmlsZV9naWdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9hcGkvdjEvZGh0L2hrZXkvP2hrZXk9XCIgKyBwcm9maWxlX2dpZ3NbaV0sXG4gICAgICAgICAgICAgICAgICAgIGhrOiBwcm9maWxlX2dpZ3NbaV0sXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oanNfZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGpzX2RhdGEgIT0gJ251bGwnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGdpZ19vID0gSlNPTi5wYXJzZShqc19kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZUdpZ3NNb2R1bGUuZ2VuZXJhdGUodGhpcy5oaywgZ2lnX28sIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcucHJlbG9hZGVyLWNhcmQnKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRVJSJywgZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbmRlck9uZUdpZyhnaWdpZCwgb25lKSB7XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IFwiL2FwaS92MS9kaHQvaGtleS8/aGtleT1cIiArIGdpZ2lkLFxuICAgICAgICAgICAgaGs6IGdpZ2lkLFxuICAgICAgICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgICAgICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGpzX2RhdGEpIHtcbiAgICAgICAgICAgICAgICBpZiAoanNfZGF0YSAhPSAnbnVsbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdpZ19vID0gSlNPTi5wYXJzZShqc19kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVHaWdzTW9kdWxlLmdlbmVyYXRlKHRoaXMuaGssIGdpZ19vLCB0cnVlLCBvbmUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5wcmVsb2FkZXItY2FyZCcpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRVJSJywgZXJyb3IpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgb25pbml0OiBpbml0UHJvZmlsZSxcbiAgICAgICAgZ2V0QWxsR2lnczogZ2V0R2lncyxcbiAgICAgICAgcmVuZGVyT25lR2lnOiByZW5kZXJPbmVHaWdcbiAgICB9XG59KSgpO1xuXG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgIGlmICgkKCdib2R5JykuaGFzQ2xhc3MoJ3Byb2ZpbGUtcGFnZScpKSB7XG4gICAgICAgIHByb2ZpbGVQYWdlTW9kdWxlLm9uaW5pdCgpO1xuICAgIH1cbn0pOyIsIi8vIFNtYXJ0IFNlYXJjaCBEZWNsYXJhdGluZ1xud2luZG93LnByb2ZpbGVzUGFnZU1vZHVsZSA9IChmdW5jdGlvbigpIHtcblxuICAgIHZhciBnaWdfY3R4ID0gJChcIltkYXRhLXRhcmdldD0nI2dpZ01vZGFsJ1wiKVxuICAgIHZhciBlbCA9IGdpZ19jdHgucmVtb3ZlKDApO1xuXG4gICAgZnVuY3Rpb24gaW5pdFByb2ZpbGVzKCkge1xuICAgICAgICAkKCcubmF2LXRhYnMgLm5hdi1saW5rJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAkKCcubmF2LXRhYnMgLnByb2ZpbGVzJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBtYWluX3Byb2ZpbGVfY2FyZHMoKTtcbiAgICB9XG5cbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzTG9hZE1vcmVQcm9maWxlcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBsaW1pdCA9IGxpbWl0ICsgOTtcbiAgICAgICAgbWFpbl9wcm9maWxlX2NhcmRzKCk7XG4gICAgfSk7XG5cblxuICAgIHJldHVybiB7XG4gICAgICAgIG9uaW5pdHByb2ZpbGVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBpbml0UHJvZmlsZXMoKTtcbiAgICAgICAgfVxuICAgIH1cblxufSkoKTtcblxuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcbiAgICBpZiAoJCgnYm9keScpLmhhc0NsYXNzKCdwcm9maWxlcy1wYWdlJykpIHtcbiAgICAgICAgcHJvZmlsZXNQYWdlTW9kdWxlLm9uaW5pdHByb2ZpbGVzKCk7XG4gICAgfVxufSk7XG4iLCJ3aW5kb3cubmV3R2lnUmFuZ2VTbGlkZXIgPSAoZnVuY3Rpb24oKSB7XG5cdHZhciByYW5nZVNsaWRlciA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBzbGlkZXIgPSAkKFwiLnJhbmdlLXNsaWRlclwiKSxcblx0XHRcdHJhbmdlID0gJChcIi5yYW5nZS1zbGlkZXJfX3JhbmdlXCIpLFxuXHRcdFx0dmFsdWUgPSAkKFwiLnJhbmdlLXNsaWRlcl9fdmFsdWVcIik7XG5cblx0XHRzbGlkZXIuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdHZhbHVlLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciB2YWx1ZSA9ICQodGhpcylcblx0XHRcdFx0XHQucHJldigpXG5cdFx0XHRcdFx0LmF0dHIoXCJ2YWx1ZVwiKTtcblx0XHRcdFx0JCh0aGlzKS5odG1sKHZhbHVlKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRyYW5nZS5vbihcImlucHV0XCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkKHRoaXMpXG5cdFx0XHRcdFx0Lm5leHQodmFsdWUpXG5cdFx0XHRcdFx0Lmh0bWwodGhpcy52YWx1ZSk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fTtcblxuXHRyYW5nZVNsaWRlcigpO1xufSkoKTtcbiIsIi8vIFNtYXJ0IFNlYXJjaCBEZWNsYXJhdGluZ1xud2luZG93LnNtYXJ0U2VhcmNoTW9kdWxlID0gKGZ1bmN0aW9uKCkge1xuICAgIC8vIEdsb2JhbCB2YXJpYWJsZXMgZm9yIFNtYXJ0IFNlYXJjaFxuXG4gICAgdmFyIHNlYXJjaEFycmF5ID0gbmV3IEFycmF5KCk7XG4gICAgdmFyIGtleXVwVGltZW91dCA9IG51bGw7XG4gICAgdmFyIGRhdGFMZW5ndGggPSAwXG5cbiAgICB2YXIgc2VhcmNoQSA9ICcnO1xuXG4gICAgZnVuY3Rpb24gc21hcnRTZWFyY2goKSB7XG4gICAgICAgIHZhciB1cmwgPSBhcGlfaWR4X2Nkbl91cmwoKTtcbiAgICAgICAgLy8gYnVpbGQgdXJsIGZvciBzZWFyY2hpbmdcbiAgICAgICAgaWYgKHNlYXJjaEFycmF5Lmxlbmd0aCkge1xuICAgICAgICAgICAgJC5lYWNoKHNlYXJjaEFycmF5LCBmdW5jdGlvbihpLCBpdGVtKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlYXJjaFEgPSAnJztcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS50eXBlID09ICd0ZXh0JyAmJiBpdGVtLnZhbHVlID09ICcnICYmIHNlYXJjaEFycmF5Lmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaFEgKz0gJ2FsbCc7XG4gICAgICAgICAgICAgICAgICAgIHVybCArPSAnYWxsJztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW0udHlwZSA9PSAndGV4dCcgJiYgaXRlbS52YWx1ZSA9PSAnJyAmJiBzZWFyY2hBcnJheS5sZW5ndGggIT0gMSkge1xuICAgICAgICAgICAgICAgICAgICB1cmwgKz0gJyc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpdGVtLnR5cGUgPT0gJ3RhZ3MnICYmIGl0ZW0udmFsdWUgPT0gJ3NlbGVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsICs9ICcnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbS50eXBlID09ICd0YWdzJyAmJiBpdGVtLnZhbHVlID09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgIHVybCArPSAnJztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW0udHlwZSA9PSAnY2F0ZWdvcnknICYmIGl0ZW0udmFsdWUgPT0gJ2FsbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsICs9ICdhbGwnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbS50eXBlID09ICdxMXJhbmdlJyAmJiBzZWFyY2hBcnJheS5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBzZWFyY2hRICs9ICdhbGwmJyArIGl0ZW0udHlwZSArICc9JyArIGl0ZW0udmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHVybCArPSBzZWFyY2hRO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaFEgKz0gJyYnICsgaXRlbS50eXBlICsgJz0nICsgaXRlbS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgdXJsICs9IHNlYXJjaFE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1cmwgKz0gJ2FsbCc7XG4gICAgICAgIH1cblxuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdHlwZTogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6IHVybCArICcmbGltaXQ9MTAwMCcsXG4gICAgICAgICAgICBxcnk6IHNlYXJjaEEsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgZGF0YUxlbmd0aCA9IGRhdGEubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGlmIChkYXRhID09ICdudWxsJykge1xuICAgICAgICAgICAgICAgICAgICBkYXRhID0gSlNPTi5zdHJpbmdpZnkoeyByZXN1bHQ6IGBObyByZXN1bHRzIGZvciB0aGlzIHNlYXJjaGAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGV2ZW50X29uX3NlYXJjaF9naWdfZGF0YShkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gU2VhcmNoIEV2ZW50c1xuXG4gICAgLy8gU3VibWl0IHNlYXJjaCBmb3IgdGV4dCBmaWVsZFxuICAgICQoZG9jdW1lbnQpLm9uKCdrZXl1cCcsICdpbnB1dCNzZWFyY2gtaGVhZGVyJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAodGhpcy52YWx1ZS5sZW5ndGggPCAyICYmIHRoaXMudmFsdWUubGVuZ3RoID4gMCkgcmV0dXJuO1xuICAgICAgICBsaW1pdCA9IDk7XG4gICAgICAgICQoJy5naWdzLWNvbnRhaW5lcicpLmVtcHR5KCk7XG4gICAgICAgIGRlbGF5KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIG91dHB1dFN0cmluZyA9ICQoZS50YXJnZXQpLnZhbCgpLnNwbGl0KFwiIFwiKS5qb2luKFwiJTIwXCIpO1xuICAgICAgICAgICAgaWYgKHNlYXJjaEFycmF5Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHZhciB0ZXh0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgc2VhcmNoQXJyYXkuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0udHlwZSA9PSAndGV4dCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VhcmNoQXJyYXkuc3BsaWNlKHNlYXJjaEFycmF5LmluZGV4T2YoaXRlbSksIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VhcmNoQXJyYXkucHVzaCh7IHR5cGU6ICd0ZXh0JywgdmFsdWU6IG91dHB1dFN0cmluZyB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmICh0ZXh0ID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaEFycmF5LnB1c2goeyB0eXBlOiAndGV4dCcsIHZhbHVlOiBvdXRwdXRTdHJpbmcgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWFyY2hBcnJheS5wdXNoKHsgdHlwZTogJ3RleHQnLCB2YWx1ZTogb3V0cHV0U3RyaW5nIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VhcmNoQXJyYXkpO1xuICAgICAgICAgICAgc21hcnRTZWFyY2hNb2R1bGUuc2VhcmNoKCk7XG4gICAgICAgIH0sIDUwMCk7XG4gICAgfSk7XG5cbiAgICAvLyBTdWJtaXQgc2VhcmNoIGZvciBkcm9wZG93biBleHBlcnRpc2VcbiAgICAkKGRvY3VtZW50KS5vbignY2hhbmdlJywgJyNkb21haW4tZXhwZXJ0aXNlLXNlbGVjdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZWwgPSAkKHRoaXMpLmRyb3Bkb3duKCdnZXQgdmFsdWUnKTtcbiAgICAgICAgbGltaXQgPSA5O1xuICAgICAgICAkKCcuZ2lncy1jb250YWluZXInKS5lbXB0eSgpO1xuICAgICAgICBkZWxheShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChzZWFyY2hBcnJheS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBzZWFyY2hBcnJheS5maWx0ZXIoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS50eXBlID09ICd0YWdzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VhcmNoQXJyYXkuc3BsaWNlKHNlYXJjaEFycmF5LmluZGV4T2YoaXRlbSksIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgY2F0ZWdvcnkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBzZWFyY2hBcnJheS5maWx0ZXIoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS50eXBlID09ICdjYXRlZ29yeScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlYXJjaEFycmF5LnNwbGljZShzZWFyY2hBcnJheS5pbmRleE9mKGl0ZW0pLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlYXJjaEFycmF5LnB1c2goeyB0eXBlOiAnY2F0ZWdvcnknLCB2YWx1ZTogZWwgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAoY2F0ZWdvcnkgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoQXJyYXkucHVzaCh7IHR5cGU6ICdjYXRlZ29yeScsIHZhbHVlOiBlbCB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlYXJjaEFycmF5LnB1c2goeyB0eXBlOiAnY2F0ZWdvcnknLCB2YWx1ZTogZWwgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzbWFydFNlYXJjaE1vZHVsZS5zZWFyY2goKTtcbiAgICAgICAgICAgIGlmIChlbCAhPSAnYWxsJykgbG9hZF90YWdzX3Blcl9kb21haW4oZWwpO1xuICAgICAgICB9LCAyMDApO1xuICAgIH0pO1xuXG4gICAgJChkb2N1bWVudCkub24oJ2NoYW5nZScsICcjc2tpbGxzLXRhZ3MnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVsID0gJCh0aGlzKS5kcm9wZG93bignZ2V0IHZhbHVlJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKGVsKTtcbiAgICAgICAgaWYgKGVsID09IG51bGwpIHJldHVybjtcbiAgICAgICAgbGltaXQgPSA5O1xuICAgICAgICAkKCcuZ2lncy1jb250YWluZXInKS5lbXB0eSgpO1xuICAgICAgICBkZWxheShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQoJy5naWdzLWNvbnRhaW5lcicpLmVtcHR5KCk7XG4gICAgICAgICAgICB2YXIgb3V0cHV0U3RyaW5nID0gZWwuam9pbihcIiUyMFwiKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG91dHB1dFN0cmluZylcbiAgICAgICAgICAgIGlmIChzZWFyY2hBcnJheS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB2YXIgdGFncyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHNlYXJjaEFycmF5LmZpbHRlcihmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLnR5cGUgPT0gJ3RhZ3MnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YWdzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlYXJjaEFycmF5LnNwbGljZShzZWFyY2hBcnJheS5pbmRleE9mKGl0ZW0pLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlYXJjaEFycmF5LnB1c2goeyB0eXBlOiAndGFncycsIHZhbHVlOiBvdXRwdXRTdHJpbmcgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAodGFncyA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBzZWFyY2hBcnJheS5wdXNoKHsgdHlwZTogJ3RhZ3MnLCB2YWx1ZTogb3V0cHV0U3RyaW5nIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VhcmNoQXJyYXkucHVzaCh7IHR5cGU6ICd0YWdzJywgdmFsdWU6IG91dHB1dFN0cmluZyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNtYXJ0U2VhcmNoTW9kdWxlLnNlYXJjaCgpO1xuICAgICAgICB9LCAyMDApO1xuICAgIH0pO1xuXG4gICAgJChkb2N1bWVudCkub24oJ21vdXNldXAgdG91Y2hlbmQnLCAnI3NsaWRlci1yYW5nZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdmFsdWVzID0gJCh0aGlzKS5zbGlkZXIoXCJ2YWx1ZXNcIik7XG4gICAgICAgIGlmICh2YWx1ZXNbMF0gPT0gMCAmJiB2YWx1ZXNbMV0gPT0gMjAwMCkge1xuICAgICAgICAgICAgc2VhcmNoQXJyYXkuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS50eXBlID09ICdxMXJhbmdlJykge1xuICAgICAgICAgICAgICAgICAgICBzZWFyY2hBcnJheS5zcGxpY2Uoc2VhcmNoQXJyYXkuaW5kZXhPZihpdGVtKSwgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGltaXQgPSA5O1xuICAgICAgICAkKCcuZ2lncy1jb250YWluZXInKS5lbXB0eSgpO1xuICAgICAgICBkZWxheShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChzZWFyY2hBcnJheS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB2YXIgcTFyYW5nZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHNlYXJjaEFycmF5LmZpbHRlcihmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLnR5cGUgPT0gJ3ExcmFuZ2UnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBxMXJhbmdlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlYXJjaEFycmF5LnNwbGljZShzZWFyY2hBcnJheS5pbmRleE9mKGl0ZW0pLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlYXJjaEFycmF5LnB1c2goeyB0eXBlOiAncTFyYW5nZScsIHZhbHVlOiB2YWx1ZXNbMF0gKyAnJTIwJyArIHZhbHVlc1sxXSB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmIChxMXJhbmdlID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaEFycmF5LnB1c2goeyB0eXBlOiAncTFyYW5nZScsIHZhbHVlOiB2YWx1ZXNbMF0gKyAnJTIwJyArIHZhbHVlc1sxXSB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlYXJjaEFycmF5LnB1c2goeyB0eXBlOiAncTFyYW5nZScsIHZhbHVlOiB2YWx1ZXNbMF0gKyAnJTIwJyArIHZhbHVlc1sxXSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNtYXJ0U2VhcmNoTW9kdWxlLnNlYXJjaCgpO1xuICAgICAgICB9LCAyMDApO1xuICAgIH0pO1xuXG5cblxuXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5qc0xvYWRNb3JlU2VhcmNoJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxpbWl0ID0gbGltaXQgKyA5O1xuICAgICAgICBzbWFydFNlYXJjaE1vZHVsZS5zZWFyY2goKTtcbiAgICB9KTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHNlYXJjaDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gc21hcnRTZWFyY2goKTtcbiAgICAgICAgfVxuICAgIH1cblxufSkoKTsiXX0=

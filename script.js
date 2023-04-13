var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');
$("#legend1").hide();
$(document).ready(function () {
  
    $("#legend1").delay(3000).fadeIn(500);
});
/**
 * Create an overlay to anchor the popup to the map.
 */
var overlay = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250
    }
});

/**
 * Add a click handler to hide the popup.
 * @return {boolean} Don't follow the href.
 */
closer.onclick = function () {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
};

var view = new ol.View({
    projection: 'EPSG:4326',
    center: [36.8219, 1.2921],
    zoom: 6,

});
var view_ov = new ol.View({
    projection: 'EPSG:4326',
    center: [36.8219, 1.2921],
    zoom: 5,
});


var base_maps = new ol.layer.Group({
    'title': 'Base maps',
    layers: [
        new ol.layer.Tile({
            title: 'OSM',
            type: 'base',
            visible: true,
            source: new ol.source.OSM()
        }),
        new ol.layer.Tile({
            title: 'Satellite',
            type: 'base',
            visible: true,
            source: new ol.source.XYZ({
                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                maxZoom: 19
            })
        })


    ]
});

var OSM = new ol.layer.Tile({
    source: new ol.source.OSM(),
    type: 'base',
    title: 'OSM',
});

var worldImagery = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        maxZoom: 19
    })
});

var overlays = new ol.layer.Group({
    'title': 'Overlays',
    layers: [
        // new ol.layer.Image({
        //     title: 'Counties',
        //     // extent: [-180, -90, -180, 90],
        //     source: new ol.source.ImageWMS({
        //         url: 'http://localhost:8080/geoserver/wms',
        //         params: { 'LAYERS': 'Nzoia:Counties' },
        //         ratio: 1,
        //         serverType: 'geoserver'
        //     })
        // }),
        new ol.layer.Image({
            title: 'Nzoia_flood_map_layer',
            // extent: [-180, -90, -180, 90],
            source: new ol.source.ImageWMS({
                url: 'http://localhost:8080/geoserver/wms',
                params: { 'LAYERS': 'Nzoia:Nzoia_flood_map_layer' },
                ratio: 1,
                serverType: 'geoserver'
            })
        }),
        new ol.layer.Image({
            title: 'Kenya_lulc_layer',
            // extent: [-180, -90, -180, 90],
            source: new ol.source.ImageWMS({
                url: 'http://localhost:8080/geoserver/wms',
                params: { 'LAYERS': 'Nzoia:Kenya_lulc_layer' },
                ratio: 1,
                serverType: 'geoserver'
            })
        }),


    ]
});


var map = new ol.Map({
    target: 'map',
    view: view,
    // overlays: [overlay]
});

map.addLayer(base_maps);
// map.addLayer(overlays);

var kenya_srtm = new ol.layer.Image({
    title: 'Kenya_SRTM_layer',
    // extent: [-180, -90, -180, 90],
    source: new ol.source.ImageWMS({
        url: 'http://localhost:8080/geoserver/wms',
        params: { 'LAYERS': 'Nzoia:Kenya_SRTM_layer' },
        ratio: 1,
        serverType: 'geoserver'
    })
});


overlays.getLayers().push(kenya_srtm);

var kenya_counties = new ol.layer.Image({
    title: 'County boundaries',
    // extent: [-180, -90, -180, 90],
    source: new ol.source.ImageWMS({
        url: 'http://localhost:8080/geoserver/wms',
        params: { 'LAYERS': 'Nzoia:Counties' },
        ratio: 1,
        serverType: 'geoserver'
    })
});
map.addLayer(kenya_counties);

var mouse_position = new ol.control.MousePosition();
map.addControl(mouse_position);

var overview = new ol.control.OverviewMap({
    view: view_ov,
    collapseLabel: 'O',
    label: 'O',
    layers: [OSM]
});
map.addControl(overview);

var full_sc = new ol.control.FullScreen({ label: 'F' });
map.addControl(full_sc);

var zoom = new ol.control.Zoom({ zoomInLabel: '+', zoomOutLabel: '-' });
map.addControl(zoom);

var slider = new ol.control.ZoomSlider();
map.addControl(slider);



// var zoom_ex = new ol.control.ZoomToExtent({
//     extent: [
//         65.90, 7.48,
//         98.96, 40.30
//     ]
// });
// map.addControl(zoom_ex);

var layerSwitcher = new ol.control.LayerSwitcher({
    activationMode: 'click',
    startActive: true,
    tipLabel: 'Layers', // Optional label for button
    groupSelectStyle: 'children', // Can be 'children' [default], 'group' or 'none'
    collapseTipLabel: 'Collapse layers',
});
map.addControl(layerSwitcher);

var kenya_srtm1;
var lulc;
var nzoia_flood;

function allLayer(param){
    // console.log(param)

    if(param=="srtm"){
        $('#legend1').removeAttr('hidden');
        $('#legend2').attr("hidden",true);
        $('#legend3').attr("hidden",true);
        kenya_srtm1 = new ol.layer.Image({
            title: 'Kenya_SRTM_layer',
            // extent: [-180, -90, -180, 90],
            source: new ol.source.ImageWMS({
                url: 'http://localhost:8080/geoserver/wms',
                params: { 'LAYERS': 'Nzoia:Kenya_SRTM_layer' },
                ratio: 1,
                serverType: 'geoserver'
            })
        });
        map.addLayer(kenya_srtm1);
        map.removeLayer(lulc);
        map.removeLayer(nzoia_flood);
    }else if(param=="lulc"){
        $('#legend2').removeAttr('hidden');
        $('#legend1').attr("hidden",true);
        $('#legend3').attr("hidden",true);
        lulc = new ol.layer.Image({
            title: 'Kenya_lulc_layer',
            // extent: [-180, -90, -180, 90],
            source: new ol.source.ImageWMS({
                url: 'http://localhost:8080/geoserver/wms',
                params: { 'LAYERS': 'Nzoia:Kenya_lulc_layer' },
                ratio: 1,
                serverType: 'geoserver'
            })
        });
        map.addLayer(lulc);
        map.removeLayer(kenya_srtm1);
        map.removeLayer(nzoia_flood);
    }else if(param=="nzoia"){
        $('#legend3').removeAttr('hidden');
        $('#legend1').attr("hidden",true);
        $('#legend2').attr("hidden",true);
        nzoia_flood = new ol.layer.Image({
            title: 'Nzoia_flood_map_layer',
            // extent: [-180, -90, -180, 90],
            source: new ol.source.ImageWMS({
                url: 'http://localhost:8080/geoserver/wms',
                params: { 'LAYERS': 'Nzoia:Nzoia_flood_map_layer' },
                ratio: 1,
                serverType: 'geoserver'
            })
        });
        map.addLayer(nzoia_flood);
        map.removeLayer(kenya_srtm1);
        map.removeLayer(lulc);
    }
    
}
// function srtm_layer(){
//     $('#legend1').removeAttr('hidden');
//    kenya_srtm1 = new ol.layer.Image({
//         title: 'Kenya_SRTM_layer',
//         // extent: [-180, -90, -180, 90],
//         source: new ol.source.ImageWMS({
//             url: 'http://localhost:8080/geoserver/wms',
//             params: { 'LAYERS': 'Nzoia:Kenya_SRTM_layer' },
//             ratio: 1,
//             serverType: 'geoserver'
//         })
//     });
//     map.addLayer(kenya_srtm1);
//     map.removeLayer(lulc);
//     map.removeLayer(nzoia_flood);
// }

// function lulc_layer() {
//     $('#legend2').removeAttr('hidden');
//     $('#legend1').hide();
//     $('#legend3').hide();
//     lulc = new ol.layer.Image({
//         title: 'Kenya_lulc_layer',
//         // extent: [-180, -90, -180, 90],
//         source: new ol.source.ImageWMS({
//             url: 'http://localhost:8080/geoserver/wms',
//             params: { 'LAYERS': 'Nzoia:Kenya_lulc_layer' },
//             ratio: 1,
//             serverType: 'geoserver'
//         })
//     });
//     map.addLayer(lulc);
//     map.removeLayer(kenya_srtm1);
//     map.removeLayer(nzoia_flood);
// }

// function nzoia_layer() {
//     $('#legend3').removeAttr('hidden');
//     $('#legend1').hide();
//     $('#legend2').hide();
//     nzoia_flood = new ol.layer.Image({
//         title: 'Kenya_lulc_layer',
//         // extent: [-180, -90, -180, 90],
//         source: new ol.source.ImageWMS({
//             url: 'http://localhost:8080/geoserver/wms',
//             params: { 'LAYERS': 'Nzoia:Nzoia_flood_map_layer' },
//             ratio: 1,
//             serverType: 'geoserver'
//         })
//     });
//     map.addLayer(nzoia_flood);
//     map.removeLayer(kenya_srtm1);
//     map.removeLayer(lulc);
// }



function legend() {

    //	$('#legend').empty();

    var no_layers = overlays.getLayers().get('length');

    var head = document.createElement("h4");

    var txt = document.createTextNode("Legend");

    head.appendChild(txt);
    var element = document.getElementById("legend");
    element.appendChild(head);
    var ar = [];
    var i;
    for (i = 0; i < no_layers; i++) {
        ar.push("http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=" + overlays.getLayers().item(i).get('title'));
        //alert(overlays.getLayers().item(i).get('title'));
        // console.log(overlays.getLayers().item(i))
        // console.log(ar)
    }
    for (i = 0; i < no_layers; i++) {
        var head = document.createElement("p");

        var txt = document.createTextNode(overlays.getLayers().item(i).get('title'));
        //alert(txt[i]);
        head.appendChild(txt);
        var element = document.getElementById("legend");
        element.appendChild(head);
        var img = new Image();
        img.src = ar[i];
        // img.src.sort(function (a, b) { return b - a });
        // console.log(img.src)
        var src = document.getElementById("legend");
      
        // src.appendChild(img);
        

        // [http://localhost:8080/geoserver/sf/wms?service=WMS&version=1.1.0&request=GetLegendGraphic&layer=sf:sfdem&styles=&bbox=589980.0,4913700.0,609000.0,4928010.0&width=512&height=385&srs=EPSG:26713&format=application/json&outputFormat=application/json]
        var dat_r = "http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=application/json&OUTPUTFORMAT=application/json&WIDTH=20&HEIGHT=20&LAYER=" + overlays.getLayers().item(i).get('title')
        var dat2 ="http://localhost:8080/geoserver/sf/wms?service=WMS&version=1.1.0&request=GetLegendGraphic&layer=sf:sfdem&styles=&bbox=589980.0,4913700.0,609000.0,4928010.0&width=512&height=385&srs=EPSG:26713&format=application/json&outputFormat=application/json"
      
 
        // console.log(dat3)
        // var viewResolution = /** @type {number} */ (view.getResolution());
        // wmsSource1 = new ol.source.ImageWMS({
        //     url: 'http://localhost:8080/geoserver/wms',
        //     params: { 'LAYERS': 'Nzoia:Kenya_lulc_layer' },
        //     serverType: 'geoserver',
        
        // });
        // var graphicUrl = wmsSource1.getLegendUrl(
        //     viewResolution,
        //     { 'FORMAT': 'application/json' ,
        //        'FEATURE_COUNT':'9999',},
            
        // );
        // var res = JSON.parse(dat3)
        // console.log(dat3);
 



    }

}

// legend();

var leg = "http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=Nzoia:Kenya_SRTM_layer"


var dat3 = "http://localhost:8080/geoserver/wms?service=WMS&version=1.1.0&request=GetLegendGraphic&layer=Nzoia:Kenya_SRTM_layer&format=application/json&format_options=callback:getJson";

$.getJSON(dat3, function (data) {
    // JSON result in `data` variable
    // console.log(data.Legend[0].rules[0].symbolizers[0].Raster.colormap.entries[0])
    var cont = data.Legend[0].rules[0].symbolizers[0].Raster.colormap.entries;
 
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        // var datval = []
        var data = google.visualization.arrayToDataTable([

      

            ['Task', 'Elevation', { role: "style" }],
            [cont[0].label, parseInt(cont[0].quantity), cont[0].color],
            [cont[1].label, parseInt(cont[1].quantity), cont[1].color],
            [cont[2].label, parseInt(cont[2].quantity), cont[2].color],
            [cont[3].label, parseInt(cont[3].quantity), cont[3].color],
            [cont[4].label, parseInt(cont[4].quantity), cont[4].color],
            [cont[5].label, parseInt(cont[5].quantity), cont[5].color],
            [cont[6].label, parseInt(cont[6].quantity), cont[6].color],
            [cont[7].label, parseInt(cont[7].quantity), cont[7].color],
            [cont[8].label, parseInt(cont[8].quantity), cont[8].color],
            // [ldata, qdata],
        ]);
        var view = new google.visualization.DataView(data);
        view.setColumns([0, 1,
            {
                calc: "stringify",
                sourceColumn: 1,
                type: "string",
                role: "annotation"
            },
            2]);

        var options = {
            title: 'Kenya SRTM Chart',
            bar: { groupWidth: "95%" },
            // legend: { position: 'top', maxLines: 3 },
            legend: { position: "none" },
            width: 500,
            height: 400,
            vAxis: {
                title: 'Elevation in meters',
                // textStyle: {
                //     color: '#1a237e',
                //     fontSize: 24,
                //     bold: true
                // },
                titleTextStyle: {
                    // color: '#1a237e',
                    fontSize: 14,
                    // bold: true
                }
            }, 
            hAxis: { textPosition: 'none' ,
        title:"Elevation trend"},
            timeline: { showBarLabels: false },
            explorer: {
                actions: ['dragToZoom', 'rightClickToReset'],
                axis: 'vertical',
                keepInBounds: true,
                maxZoomIn: 10.0,
            }
            
            // colors: [cont[1].color, cont[2].color, cont[3].color]
        };

        var chart = new google.visualization.ColumnChart(document.getElementById('barchart'));

        chart.draw(view, options);
    }

});







function activate_getinfo(){
    if (measureTooltipElement) {
        var elem = document.getElementsByClassName("tooltip tooltip-static");

        for (var i = elem.length - 1; i >= 0; i--) {

            elem[i].remove();
            //alert(elem[i].innerHTML);
        }
    }
    
    map.on('singleclick', getinfo);

}

function deactivate_getinfo(){
    map.un('singleclick', getinfo);
    overlay.setPosition(undefined);
    closer.blur();
}


function getinfo(evt) {


    var viewResolution = /** @type {number} */ (view.getResolution());

    $("#popup-content").empty();
    // console.log(coordinate)
    // document.getElementById('info').innerHTML = '';
    var no_layers = overlays.getLayers().get('length');
    // alert(no_layers);
    var url = new Array();
    var wmsSource = new Array();
    var layer_title = new Array();

    var vis = map.getLayers().item(2).getVisible();
    // console.log(vis)
    var lay_title;
    if (vis == true) {
        // lay_title = map.getLayers().item(0).get('title');
        // console.log(lay_title)
        var wmsSource1 = new ol.source.ImageWMS({
            url: 'http://localhost:8080/geoserver/wms',
            params: { 'LAYERS': 'Nzoia:Kenya_SRTM_layer' },
            serverType: 'geoserver',
            crossOrigin: 'anonymous'
        });

        // console.log(wmsSource1)

        var url1 = wmsSource1.getFeatureInfoUrl(
            evt.coordinate, viewResolution, 'EPSG:4326',
            { 'INFO_FORMAT': 'application/json' }
        );
        // console.log(url1)

        // $.get(url1, function (data) {
        //     // console.log(data)
        //     var table = $("#table1").html(data);
        //     console.log(data.features[0].properties.ELEVATION)
        //     var elev = data.features[0].properties.ELEVATION;
        //     var popupContent = '<h6>' + 'Elevation ' +'</h3>';
        //     popupContent += '<h6>' + 'Value: ' + elev + '</h3>';
        //     table.innerHTML = popupContent;
        //     var coordinate = evt.coordinate;
        //     // $("#popup-content").append(data);
        //     // // $("#info").append(data);
        //     // var popup1 = new ol.Overlay.Popup({
        //     // element: document.getElementById('popup'),
        //     // });
        //     // map.addOverlay(popup1);
        //     // content.innerHTML = data;
        //     // var coordinate = evt.coordinate;

        //     overlay.setPosition(coordinate);


        // });

        var url2 = wmsSource1.getFeatureInfoUrl(
            evt.coordinate, viewResolution, 'EPSG:4326',
            { 'INFO_FORMAT': 'text/html' }
        );
        // console.log(url1)

        $.get(url2, function (data) {
            // console.log(data)
            // var table = $("#table1").html(data);
            $("#table1").html(data);
            // console.log(data.features[0].properties.ELEVATION)
            // var elev = data.features[0].properties.ELEVATION;
            // var popupContent = '<h6>' + 'Elevation ' +'</h3>';
            // popupContent += '<h6>' + 'Value: ' + elev + '</h3>';
            // table.innerHTML = popupContent;
            // var coordinate = evt.coordinate;
            // $("#popup-content").append(data);
            // // $("#info").append(data);
            // var popup1 = new ol.Overlay.Popup({
            // element: document.getElementById('popup'),
            // });
            // map.addOverlay(popup1);
            // content.innerHTML = data;
            // var coordinate = evt.coordinate;

            // overlay.setPosition(coordinate);


        });
    }




}
//map.on('singleclick', getinfo);
// map.un('singleclick', getinfo);

// getinfotype.onchange = function () {
//     map.removeInteraction(draw);
//     if (vectorLayer) { vectorLayer.getSource().clear(); }
//     map.removeOverlay(helpTooltip);
//     if (measureTooltipElement) {
//         var elem = document.getElementsByClassName("tooltip tooltip-static");

//         for (var i = elem.length - 1; i >= 0; i--) {

//             elem[i].remove();
//             //alert(elem[i].innerHTML);
//         }
//     }

//     if (getinfotype.value == 'activate_getinfo') {
//         map.on('singleclick', getinfo);
//     }
//     else if (getinfotype.value == 'select' || getinfotype.value == 'deactivate_getinfo') {
//         map.un('singleclick', getinfo);
//         overlay.setPosition(undefined);
//         closer.blur();
//     }
// };



// measure tool

var source = new ol.source.Vector();
var vectorLayer = new ol.layer.Vector({
    //title: 'layer',
    source: source,
    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new ol.style.Stroke({
            color: '#ffcc33',
            width: 2
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: '#ffcc33'
            })
        })
    })
});

//overlays.getLayers().push(vectorLayer);
map.addLayer(vectorLayer);


//layerSwitcher.renderPanel();


/**
* Currently drawn feature.
* @type {module:ol/Feature~Feature}
*/
var sketch;


/**
 * The help tooltip element.
 * @type {Element}
 */
var helpTooltipElement;


/**
 * Overlay to show the help messages.
 * @type {module:ol/Overlay}
 */
var helpTooltip;


/**
 * The measure tooltip element.
 * @type {Element}
 */
var measureTooltipElement;


/**
 * Overlay to show the measurement.
 * @type {module:ol/Overlay}
 */
var measureTooltip;


/**
 * Message to show when the user is drawing a polygon.
 * @type {string}
 */
var continuePolygonMsg = 'Click to continue drawing the polygon';


/**
 * Message to show when the user is drawing a line.
 * @type {string}
 */
var continueLineMsg = 'Click to continue drawing the line';


/**
 * Handle pointer move.
 * @param {module:ol/MapBrowserEvent~MapBrowserEvent} evt The event.
 */
var pointerMoveHandler = function (evt) {
    if (evt.dragging) {
        return;
    }
    /** @type {string} */
    var helpMsg = 'Click to start drawing';

    if (sketch) {
        var geom = (sketch.getGeometry());
        if (geom instanceof ol.geom.Polygon) {

            helpMsg = continuePolygonMsg;
        } else if (geom instanceof ol.geom.LineString) {
            helpMsg = continueLineMsg;
        }
    }

    helpTooltipElement.innerHTML = helpMsg;
    helpTooltip.setPosition(evt.coordinate);

    helpTooltipElement.classList.remove('hidden');
};

// map.on('pointermove', pointerMoveHandler);

// map.getViewport().addEventListener('mouseout', function () {
//     helpTooltipElement.classList.add('hidden');
// });

//var measuretype = document.getElementById('measuretype');

var draw; // global so we can remove it later


/**
 * Format length output.
 * @param {module:ol/geom/LineString~LineString} line The line.
 * @return {string} The formatted length.
 */
var formatLength = function (line) {
    var length = ol.sphere.getLength(line, { projection: 'EPSG:4326' });
    //var length = getLength(line);
    //var length = line.getLength({projection:'EPSG:4326'});

    var output;
    if (length > 100) {
        output = (Math.round(length / 1000 * 100) / 100) +
            ' ' + 'km';

    } else {
        output = (Math.round(length * 100) / 100) +
            ' ' + 'm';

    }
    return output;

};


/**
 * Format area output.
 * @param {module:ol/geom/Polygon~Polygon} polygon The polygon.
 * @return {string}// Formatted area.
 */
var formatArea = function (polygon) {
    // var area = getArea(polygon);
    var area = ol.sphere.getArea(polygon, { projection: 'EPSG:4326' });
    // var area = polygon.getArea();
    //alert(area);
    var output;
    if (area > 10000) {
        output = (Math.round(area / 1000000 * 100) / 100) +
            ' ' + 'km<sup>2</sup>';
    } else {
        output = (Math.round(area * 100) / 100) +
            ' ' + 'm<sup>2</sup>';
    }
    return output;
};

function addInteraction() {

    var type;
    if (measuretype.value == 'area') { type = 'Polygon'; }
    else if (measuretype.value == 'length') { type = 'LineString'; }
    //alert(type);

    //var type = (measuretype.value == 'area' ? 'Polygon' : 'LineString');
    draw = new ol.interaction.Draw({
        source: source,
        type: type,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.5)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 0, 0.5)',
                lineDash: [10, 10],
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 5,
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 0, 0.7)'
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.5)'
                })
            })
        })
    });

    if (measuretype.value == 'select' || measuretype.value == 'clear') {

        map.removeInteraction(draw);
        if (vectorLayer) { vectorLayer.getSource().clear(); }
        map.removeOverlay(helpTooltip);

        if (measureTooltipElement) {
            var elem = document.getElementsByClassName("tooltip tooltip-static");
            //$('#measure_tool').empty(); 

            //alert(elem.length);
            for (var i = elem.length - 1; i >= 0; i--) {

                elem[i].remove();
                //alert(elem[i].innerHTML);
            }
        }

        //var elem1 = elem[0].innerHTML;
        //alert(elem1);

    }

    else if (measuretype.value == 'area' || measuretype.value == 'length') {

        map.addInteraction(draw);
        createMeasureTooltip();
        createHelpTooltip();

        var listener;
        draw.on('drawstart',
            function (evt) {
                // set sketch


                //vectorLayer.getSource().clear();

                sketch = evt.feature;

                /** @type {module:ol/coordinate~Coordinate|undefined} */
                var tooltipCoord = evt.coordinate;

                listener = sketch.getGeometry().on('change', function (evt) {
                    var geom = evt.target;

                    var output;
                    if (geom instanceof ol.geom.Polygon) {

                        output = formatArea(geom);
                        tooltipCoord = geom.getInteriorPoint().getCoordinates();

                    } else if (geom instanceof ol.geom.LineString) {

                        output = formatLength(geom);
                        tooltipCoord = geom.getLastCoordinate();
                    }
                    measureTooltipElement.innerHTML = output;
                    measureTooltip.setPosition(tooltipCoord);
                });
            }, this);

        draw.on('drawend',
            function () {
                measureTooltipElement.className = 'tooltip tooltip-static';
                measureTooltip.setOffset([0, -7]);
                // unset sketch
                sketch = null;
                // unset tooltip so that a new one can be created
                measureTooltipElement = null;
                createMeasureTooltip();
                ol.Observable.unByKey(listener);
            }, this);

    }
}


/**
 * Creates a new help tooltip
 */
function createHelpTooltip() {
    if (helpTooltipElement) {
        helpTooltipElement.parentNode.removeChild(helpTooltipElement);
    }
    helpTooltipElement = document.createElement('div');
    helpTooltipElement.className = 'tooltip hidden';
    helpTooltip = new ol.Overlay({
        element: helpTooltipElement,
        offset: [15, 0],
        positioning: 'center-left'
    });
    map.addOverlay(helpTooltip);
}


/**
 * Creates a new measure tooltip
 */
function createMeasureTooltip() {
    if (measureTooltipElement) {
        measureTooltipElement.parentNode.removeChild(measureTooltipElement);
    }
    measureTooltipElement = document.createElement('div');
    measureTooltipElement.className = 'tooltip tooltip-measure';

    measureTooltip = new ol.Overlay({
        element: measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center'
    });
    map.addOverlay(measureTooltip);

}


/**
 * Let user change the geometry type.
 */
measuretype.onchange = function () {
    map.un('singleclick', getinfo);
    overlay.setPosition(undefined);
    closer.blur();
    map.removeInteraction(draw);
    addInteraction();
};

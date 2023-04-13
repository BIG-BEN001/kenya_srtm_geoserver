/**
 * Elements that make up the popup.
 */
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

var clickedCoord = []
var geojsonObj = {}
var heatMapLayer
var dataLayer
var clusterLayer
var hexbin, layer, binSize;




/**
 * Create an overlay to anchor the popup to the map.
 */
var overlay = new ol.Overlay({
    element: container,
    autoPan: {
        animation: {
            duration: 250,
        },
    },
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



//  Initiating map
var viewMap = new ol.View({
    center: ol.proj.fromLonLat([36.8219, 1.2921]),
    zoom: 7
});

var basemapLayer = new ol.source.OSM();


// /**
//  * Elements that make up the popup.
//  */
// const container = document.getElementById('popup');
// const content = document.getElementById('popup-content');
// const closer = document.getElementById('popup-closer');

// /**
//  * Create an overlay to anchor the popup to the map.
//  */
// const overlay = new ol.Overlay({
//     element: container,
//     autoPan: {
//         animation: {
//             duration: 250,
//         },
//     },
// });

// /**
//  * Add a click handler to hide the popup.
//  * @return {boolean} Don't follow the href.
//  */
// closer.onclick = function () {
//     overlay.setPosition(undefined);
//     closer.blur();
//     return false;
// };



var map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: basemapLayer
                // source: new ol.source.Stamen({
                //     layer: 'toner'
                // })
        })
    ],
    view: viewMap,
    overlays: [overlay],
});

// Define vector source
var drawSource = new ol.source.Vector();

// Define vector layer
var drawLayer = new ol.layer.Vector({
    source: drawSource
});

// add layer to map
map.addLayer(drawLayer);

// Initiate a draw interaction
var draw = new ol.interaction.Draw({
    type: 'Point',
    source: drawSource
});

// upon start draw interaction
// draw.on('drawstart', function(e) {
//     e.preventDefault();
//     // alert('point added')
//     drawSource.clear();
// });

// Enable draw interaction
function startDrawing() {
    map.addInteraction(draw);
}

// end interaction
draw.on('drawend', function(e) {
    e.preventDefault();
    // alert('point added')
    $("#addPointModal").modal('show');
    clickedCoord = e.feature.getGeometry().getCoordinates();
    // console.log(clickedCoord)
    // console.log('clicked at: ', e.feature[0].getGeometry().getFlatCoordinates());
 
    map.removeInteraction(draw);
});

// $(".closeModalBtn").on('click', function() {
//     $("#addPointModal").modal('hide');
// })


// Save data to db
$(document).ready(function() {
    $('#saveBtn').on('click', function(e) {
        if ($('#add-data-form')[0].checkValidity()) {
            e.preventDefault();
            // console.log('clcked')
            var name = document.getElementById('name').value;
            var condition = document.getElementById('condition').value;
            var long = clickedCoord[0];
            var lat = clickedCoord[1];
            if (name != '' && condition != '' && long != '' && lat != '') {

                $.ajax({
                    url: 'save_data.php',
                    type: 'POST',
                    data: {
                        name: name,
                        condition: condition,
                        long: long,
                        lat: lat
                    },
                    success: function(response) {
                        // console.log(response);
                        // var result = JSON.parse(response);
                        $("#addPointModal").modal('hide');
                        // var result = JSON.parse(response);
                    
                        // console.log(result)
                        // if (result.statusCode == 200) {
                        //     $('#add-data-form')[0].reset();
                        //     $("#addPointModal").modal('hide');
                        //     console.log('data added successfully');
                        // } else {
                        //     console.log('somethng went wrong')
                        // }
                    }
                })
            } else {
                alert("Something went wrong2");
            }
            // console.log(long, lat)
        }
    })
});


function createGeoJSON(dataArray) {
    // console.log(dataArray)
    geojsonObj['type'] = "FeatureCollection"
    var features = [];
    for (i = 0; i < dataArray.length; i++) {
        var featObj = {}
        featObj['type'] = "Feature"
        featObj['properties'] = {
            'name': dataArray[i].name,
            'condition': dataArray[i].condition
        }
        featObj['geometry'] = JSON.parse(dataArray[i].st_asgeojson)

        features.push(featObj)
    }
    geojsonObj['features'] = features
        // console.log(features)

     

    var dataSource = new ol.source.Vector({
        features: new ol.format.GeoJSON().readFeatures(geojsonObj)
    });

    heatMapLayer = new ol.layer.Heatmap({
        source: dataSource
    });
    // map.addLayer(heatMapLayer);
    // console.log(dataSource)

    dataLayer = new ol.layer.Vector({
        source: dataSource,
        // style: new ol.style.Style({
        //     image: new ol.style.Circle({
        //         fill: new ol.style.Fill({
        //             color: '#ff0000'
        //         }),
        //         radius: 3
        //     })
        // })
        style: function (feature) {
            // console.log(feature.values_.name)
            // console.log(feature.N.name)
            if (feature.N.condition == 'fever') {
                return new ol.style.Style({
                    image: new ol.style.Circle({
                        fill: new ol.style.Fill({
                            color: '#0000FF'
                        }),
                        radius: 4
                    })
                })
            } else if (feature.N.condition == 'cough') {
                return new ol.style.Style({
                    image: new ol.style.Circle({
                        fill: new ol.style.Fill({
                            color: '#FF0000'
                        }),
                        radius: 4
                    })
                })
            } else if (feature.N.condition == 'sore-throat') {
                return new ol.style.Style({
                    image: new ol.style.Circle({
                        fill: new ol.style.Fill({
                            color: '#800080'
                        }),
                        radius: 4
                    })
                })
            } else if (feature.N.condition == 'headache') {
                return new ol.style.Style({
                    image: new ol.style.Circle({
                        fill: new ol.style.Fill({
                            color: '#FFA500'
                        }),
                        radius: 4
                    })
                })
            } else if (feature.N.condition == 'breathing') {
                return new ol.style.Style({
                    image: new ol.style.Circle({
                        fill: new ol.style.Fill({
                            color: '#FFFF00'
                        }),
                        radius: 4
                    })
                })
            } else if (feature.N.condition == 'covid') {
                return new ol.style.Style({
                    image: new ol.style.Circle({
                        fill: new ol.style.Fill({
                            color: '#00FF00'
                        }),
                        radius: 4
                    })
                })
            }
        }
    });
    map.addLayer(dataLayer);

    // console.log(dataLayer)
    
   
    /**
 * Add a click handler to the map to render the popup.
 */
    map.on('click', function (evt) {
        var features = map.forEachFeatureAtPixel(evt.pixel, function(feature,layer){
            // console.log(feature)
            return feature;
           }

           
        );
        // console.log(features.N)
        var popupContent = '<h6>' + 'Name: ' +features.N.name + '</h3>';
            popupContent += '<h6>' +'Condition: '+ features.N.condition + '</h3>';

        content.innerHTML = popupContent;
        var coordinate = evt.coordinate;
        // var hdms = toStringHDMS(toLonLat(coordinate));
        // console.log(coordinate)
        // content.innerHTML = '<p>You clicked here:</p><code>' + features.N.name + '</code>';
        overlay.setPosition(coordinate);
    });



    

    // cluster
    var clusterSource = new ol.source.Cluster({
        source: dataSource,
        distance: parseInt(40, 10)
    });
   
    var styleCache = {};
    clusterLayer = new ol.layer.Vector({
        source: clusterSource,
        style: function(feature) {
            var size = feature.get('features').length;
            let style = styleCache[size];
            if (!style) {
                style = new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 10,
                        stroke: new ol.style.Stroke({
                            color: '#fff',
                        }),
                        fill: new ol.style.Fill({
                            color: '#3399CC',
                        }),
                    }),
                    text: new ol.style.Text({
                        text: size.toString(),
                        fill: new ol.style.Fill({
                            color: '#fff',
                        }),
                    }),
                });
                styleCache[size] = style;
            }
            return style;
        },
    });


    

}


// Define a new legend
    var legend = new ol.legend.Legend({
        title: 'Legend',
        margin: 5
    });
    var legendCtrl = new ol.control.Legend({
        legend: legend,
        collapsed: false
    });
    map.addControl(legendCtrl);

    // Add a new one
    var legend2 = new ol.legend.Legend({
        title: ' ', // no title
        margin: 5
    });
    map.addControl(new ol.control.Legend({
        legend: legend2,
        target: legendCtrl.element
    }));

    // // var leg_props;
    // var form = { Trianle: 3, Square: 4, Pentagon: 5, Hexagon: 6 };
    // $.each(features, function (key, val) {
    //     // console.log(val.properties)
    //     // leg_props.push(val.properties)
    //     var leg_props = val.properties
    //     var pr
    //     for (var i in leg_props){
    //         // console.log(leg_props[i])
    //         pr = leg_props[i]
    //     }
    //     console.log(pr)

    // });


        legend.addItem({
            title: 'Cough',
            typeGeom: 'Point',
            style: new ol.style.Style({
                image: new ol.style.Circle({
                    fill: new ol.style.Fill({
                        color: '#FF0000'
                    }),
                    radius: 4
                })
            })
        });

legend.addItem({
    title: 'Fever',
    typeGeom: 'Point',
    style: new ol.style.Style({
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                color: '#0000FF'
            }),
            radius: 4
        })
    })
});

legend.addItem({
    title: 'Sore throat',
    typeGeom: 'Point',
    style: new ol.style.Style({
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                color: '#800080'
            }),
            radius: 4
        })
    })
});

legend.addItem({
    title: 'Headache',
    typeGeom: 'Point',
    style: new ol.style.Style({
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                color: '#FFA500'
            }),
            radius: 4
        })
    })
});

legend.addItem({
    title: 'Breathing',
    typeGeom: 'Point',
    style: new ol.style.Style({
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                color: '#FFFF00'
            }),
            radius: 4
        })
    })
});

legend.addItem({
    title: 'Covid +ve',
    typeGeom: 'Point',
    style: new ol.style.Style({
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                color: '#00FF00'
            }),
            radius: 4
        })
    })
});
    
    // console.log(features)
   
    // if (feature.N.condition == 'fever') {
    //     return new ol.style.Style({
    //         image: new ol.style.Circle({
    //             fill: new ol.style.Fill({
    //                 color: '#0000FF'
    //             }),
    //             radius: 4
    //         })
    //     })
    // for (var i in form) {
    //     legend.addItem({
    //         title: i,
    //         typeGeom: 'Point',
    //         style: new ol.style.Style({
    //             image: new ol.style.RegularShape({
    //                 points: form[i],
    //                 radius: 15,
    //                 stroke: new ol.style.Stroke({ color: [255, 128, 0, 1], width: 1.5 }),
    //                 fill: new ol.style.Fill({ color: [255, 255, 0, .3] })
    //             })
    //         })
    //     });
    //     legend2.addItem({
    //         title: i,
    //         typeGeom: 'Point',
    //         style: new ol.style.Style({
    //             image: new ol.style.RegularShape({
    //                 points: form[i],
    //                 radius: 15,
    //                 radius2: 7,
    //                 stroke: new ol.style.Stroke({ color: [0, 128, 255, 1], width: 1.5 }),
    //                 fill: new ol.style.Fill({ color: [0, 255, 255, .3] })
    //             })
    //         })
    //     });
    // }

function addLayers(param) {

    if (param == 'heatmap') {
        map.addLayer(heatMapLayer);
        map.removeLayer(clusterLayer);
        map.removeLayer(dataLayer);
        map.removeLayer(layer);
        // map.un('moveend', moveEndFunc);
    } else if (param == 'attributes') {
        map.addLayer(dataLayer);
        map.removeLayer(heatMapLayer);
        map.removeLayer(clusterLayer);
        map.removeLayer(layer);
        // map.un('moveend', moveEndFunc);
    } else if (param == 'cluster') {
        map.addLayer(clusterLayer);
        map.removeLayer(heatMapLayer);
        map.removeLayer(dataLayer);
        map.removeLayer(layer);
        // map.un('moveend', moveEndFunc);
    } else if (param == 'clusterColor') {
        map.addLayer(layer);
        map.removeLayer(clusterLayer);
        map.removeLayer(heatMapLayer);
        map.removeLayer(dataLayer);
        // map.on('moveend', moveEndFunc);
    }
}
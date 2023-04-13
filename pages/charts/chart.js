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
            width: 900,
            height: 500,
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
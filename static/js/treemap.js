google.load('visualization', '1', {packages:['treemap']});

function drawChart(arrayData) {
    debugger;
    console.log(arrayData)
    data = google.visualization.arrayToDataTable(arrayData["array"]);
    debugger;
    var tree = new google.visualization.TreeMap(document.
        getElementById('treemap'));
    tree.draw(data, {
        minColor: '#b00',
        midColor: '#ddd',
        maxColor: '#080',
        fontColor: 'black',
        showScale: true});
}

$(document).ready(function() {
    var request = {
        searched_word: $('#search-value').val()
    };
    console.log(request.searched_word)
    $.get('/treemap', request, drawChart);
});

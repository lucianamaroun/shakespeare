/* This module regards the client operations and requests in the
 * results page. It is responsible for tetching the results in the server and
 * rendering on the html, besides responding to interaction in the filter
 * form. */

function insertMentions(mentions) {
    /* Displays the mentions of the search filtered by work and character. The 
     * filter is optional */
    if (jQuery.isEmptyObject(mentions)) {
        message = document.createElement('p');
        $(message).text('No results found for ');
        word = document.createElement('i');
        $(word).text($('#search-value').val());
        $(message).append(word);
        $('#results').append(message);
    }
    
    for (work in mentions) {
        item = document.createElement('div');
        $(item).addClass('result-item');
        title = document.createElement('div');
        $(title).addClass('title text-danger');
        $(title).text(work);
        $(item).append(title);
    
        for (charac in mentions[work]) {
            speaker = document.createElement('p');
            $(speaker).addClass('leader');
            $(speaker).css('color', '#ccc');
            $(speaker).text(charac);
            $(item).append(speaker);
            for (var i = 0; i < mentions[work][charac].length; i++) {
                line = document.createElement('p');
                $(line).addClass('result-line');
                $(line).html(mentions[work][charac][i]);
                $(item).append(line);
            }
        }
    
        $('#results').append(item);
    }
}

function insertResultsInfo(time, number_results) {
    $('#results-info').text(number_results + " results (" + time + " seconds)");   
}

function insertDidYouMean(did_you_mean) {
    if (did_you_mean) {
        message = document.createElement('span');
        message.text('Did you mean:');
        message.addClass('google-red');
        suggestion = document.createElement('a');
        suggestion.text(did_you_mean);
        suggestion.href('/results?searched_word=' + did_you_mean);
        $('#did-you-mean').append(message);
        $('#did-you-mean').append(suggestion);
    }
}

function insertResults(result) {
    /* Insert all the request results in the html */
    
    mentions = result['mentions'];
    insertMentions(mentions);

    time = result['time'];
    number_results = result['number_results'];
    insertResultsInfo(time, number_results);

    did_you_mean = result['did_you_mean'];
    insertDidYouMean(did_you_mean); 
}

function populateChars(data){
    /* Insert the characters in the select element for the filter, according to
     * the work selected */ 
    chars = data['chars'];
    $('#char-select').empty();
    $('#char-select').append(new Option('Any'));
    for (var i = 0; i < chars.length; i++) {
        $('#char-select').append(new Option(chars[i]));
    }
}

function populateWorks(data){
    /* Insert the works in the select element for the filter, according to
     * the search word */ 
    works = data['works'];
    $('#work-select').empty();
    $('#work-select').append(new Option('Any'));
    for (var i = 0; i < works.length; i++) {
        $('#work-select').append(new Option(works[i]));
    }
}

function searchRequest(request) {
    /* Make a request for retrieving results, clearing and hiding the html
     * element first and displaying loading */
    $('#results').hide();
    $('#results').empty();
    $('#results-loading').show();

    $.get('/search', request, insertResults);

    $('#results-loading').hide();
    $('#results').show();
}

function filterByWorkAndCharacter() {
    /* Filter the results of the searched word according to work and character.
     * It does not change the treemap since it is associated only to the word.
     * */
    var request = {
        char_filter: $('#char-select').find(':selected').text(),
        work_filter: $('#work-select').find(':selected').text(),
        searched_word: document.location.search.split('=')[1] 
    };
    
    searchRequest(request);
}

function loadTreemap() {
    /* Make a request to load the treemap regarding the searched word */
    var request = {
        searched_word: $('#search-value').val()
    };
    
    $.get('/treemap', request, drawChart);
}


$(document).ready(function() {
    $('#search-button').click(function() {
        /* This changes the url when the submit button is clicked and then the
         * submit is placed because of the reload of the page. To prevent the 
         * reload we would have to use a plugin, which we did not want include 
         * for only this purpose. */
        document.location.replace('?searched_word=' + $('#search-value').val()); 
    });

    $('#search-header').submit(function(event) {
        /* Submit the search word with optional filter arguments */
        event.preventDefault();

        var request = {
            char_filter: 'Any',
            work_filter: 'Any',
            searched_word: document.location.search.split('=')[1] 
        };

        searchRequest(request);

        $.get('/works', request, populateWorks);

        loadTreemap();
    });

    /* The submit is placed at every page reload */
    $('#search-header').submit();

    $('#work-select').change(function() {
        /* Update the character information int the filter according to the work
         * selected */
        work = $(this).find(':selected').text();

        if (work == 'Any') {
            $('#char-select').empty();
            $('#char-select').append(new Option('Any'));
            return;
        };

        var request = {
            work_filter: work,
            searched_word: $('#search-value').val()
        };

        $.get('/chars', request, populateChars);
    });
});

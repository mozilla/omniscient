$(function () {
    var client = ZAFClient.init();
    client.invoke('resize', {width: '100%', height: '200px'});

    //Fetch the Firefox Account ID from the ticket
    client.get('ticket.customField:custom_field_360018061392').then(
        function (data) {
            var fxa_id = data['ticket.customField:custom_field_360018061392'];

            getSubscriptionInfo(client, fxa_id);
        }
    )
})

function getSubscriptionInfo(client, fxa_id) {
    client.metadata().then(function(metadata) {
        var baseUrl = metadata.settings.apiBaseUrl;
        var apiToken = metadata.settings.apiToken;

        var settings = {
            'url': baseUrl + '/customer/' + fxa_id + '/subscriptions',
            'type': 'GET',
            'content-Type': 'x-www-form-urlencoded',
            'dataType': 'json',
            'headers': {
                'Authorization': 'bearer ' + apiToken
            }
        };

        client.request(settings).then(
            function(data) {
                console.log(data);
                showSubscriptionInfo(data);
            },
            function(response) {
                console.error(response.responseText);
            }
        );
    })
}

function showSubscriptionInfo(data) {
    for (var i = 0; i < data.length; i++) {
        var subsObj = data[1];
        console.log(subsObj);
    }
}

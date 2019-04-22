$(function () {
    var client = ZAFClient.init();
    client.invoke('resize', {width: '100%', height: '200px'});

    //Fetch the Firefox Account ID from the ticket
    client.metadata().then(function (metadata) {
        var fxaFieldId = metadata.settings.fxaFieldId;
        var fxaProperty = 'ticket.customField:custom_field_' + fxaFieldId;

        client.get(fxaProperty).then(function (data) {
            var fxa_id = data[fxaProperty];
            getSubscriptionInfo(client, fxa_id);
        })
    })
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
                showSubscriptionInfo(data, fxa_id);
            },
            function(response) {
                console.error(response.responseText);
            }
        );
    })
}

function showSubscriptionInfo(data, fxa_id) {
    var subscriptions = [];
    data.forEach(function (obj) {
        console.log(obj);

        var status = 'active';
        if (obj.end_at != null) {
            status = 'cancelled';
        }

        var nextChargeDate = new Date(obj.current_period_end * 1000);

        var subscription = {
            'subscriptionId': obj.subscription_id,
            'nextChargeDate': nextChargeDate,
            'status': status,
        };

        subscriptions.push(subscription);
    });

    var subscriptionData = {
        'user': fxa_id,
        'subscriptions': subscriptions
    };

    console.log(subscriptionData);

    var source = $("#sub-template").html();
    var template = Handlebars.compile(source);
    var html = template(subscriptionData);
    $("#content").html(html);
}

Handlebars.registerHelper('list', function(context, options) {
    var ret = "<ul>";
    for(var i=0, j=context.length; i<j; i++) {
        ret = ret + "<li>" + options.fn(context[i]) + "</li>";
    }

    return ret + "</ul>";
});
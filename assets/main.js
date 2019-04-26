$(function () {
    var client = ZAFClient.init();
    client.invoke('resize', {width: '100%', height: '400px'});

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

        var dashboardBase = metadata.settings.fxaDashboardUrl;
        var iframeUrl = dashboardBase + '/' + fxa_id;

        client.request(settings).then(
            function(data) {
                console.log(data);

                var templateContent = {
                    'user': fxa_id,
                    'subscriptions': formatSubscriptions(data['subscriptions']),
                    'dashboardSrc': iframeUrl
                };

                console.log(templateContent);

                var source = $("#sub-template").html();
                var template = Handlebars.compile(source);
                var html = template(templateContent);
                $("#content").html(html);
            },
            function(response) {
                console.error(response.responseText);
            }
        );
    })
}

function formatSubscriptions(rawSubscriptions) {
    var subscriptions = [];

    rawSubscriptions.forEach(function (obj) {
        var subscription = {
            'subscriptionName': obj.nickname,
            'status': obj.status,
            'lastPaymentDate': formatUnixTimestamp(obj.current_period_start),
            'nextPaymentDate': formatUnixTimestamp(obj.current_period_end)
        };

        subscriptions.push(subscription);
    });

    return subscriptions;
}

function formatUnixTimestamp(timestamp) {
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    var date = new Date(timestamp * 1000);

    return date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
}

Handlebars.registerHelper('list', function(context, options) {
    var ret = '';
    for(var i=0, j=context.length; i<j; i++) {
        ret = ret + "<hr />" + options.fn(context[i]);
    }

    return ret;
});
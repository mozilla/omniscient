$(function () {
    var client = ZAFClient.init();
    client.invoke('resize', {width: '100%', height: '400px'});

    //Fetch the Firefox Account ID from the ticket
    client.metadata().then(function (metadata) {
        var ticketGroupProperty = 'ticket.assignee.group.name';

        var fxaFieldId = metadata.settings.fxaFieldId;
        var fxaProperty = 'ticket.requester.customField:' + fxaFieldId;

        client.get(ticketGroupProperty).then(function (data) {
            var ticketGroup = data[ticketGroupProperty];

            var regex = /subscription/ig;
            var found = ticketGroup.match(regex);

            if (found) {
                client.get(fxaProperty).then(function (data) {
                    var fxa_id = data[fxaProperty];

                    if (fxa_id) {
                        getSubscriptionInfo(client, fxa_id);
                    } else {
                        displayError('User does not have a Firefox Account ID.')
                    }
                })
            } else {
                displayError('Not a Subscription Services ticket.')
            }
        }, function (error) {
            console.error(error);
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
                'Authorization': apiToken
            }
        };

        var dashboardBase = metadata.settings.fxaDashboardUrl;
        var iframeUrl = dashboardBase + '/' + fxa_id;

        client.request(settings).then(
            function(data) {
                var templateContent = {
                    'user': fxa_id,
                    'subscriptions': formatSubscriptions(data['subscriptions']),
                    'dashboardSrc': iframeUrl
                };

                var source = $("#sub-template").html();
                var template = Handlebars.compile(source);
                var html = template(templateContent);
                $("#content").html(html);
            },
            function(response) {
                console.error(response.responseText);
                displayError('Unable to fetch subscription data.')
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

function displayError(errorMessage) {
    var templateContent = {
        'error': errorMessage
    };

    var source = $("#sub-template").html();
    var template = Handlebars.compile(source);
    var html = template(templateContent);
    $("#content").html(html);
}

Handlebars.registerHelper('list', function(context, options) {
    var ret = '';
    for(var i=0, j=context.length; i<j; i++) {
        ret = ret + "<hr />" + options.fn(context[i]);
    }

    return ret;
});
$(function () {
    var client = ZAFClient.init();
    client.invoke('resize', {width: '100%', height: '400px'});

    //Fetch the Firefox Account ID from the ticket
    client.metadata().then(function (metadata) {
        var userIdFieldKey = metadata.settings.userIdFieldKey;
        var userIdProperty = 'ticket.requester.customField:' + userIdFieldKey;

        client.get('ticket').then(function (data) {
            var subscriptionFormId = 360000417091;
            var subscriptionTag = 'subscription_services';

            var ticketFormId = data.ticket.form.id;
            var ticketTags = data.ticket.tags;

            var isSubscriptionTicket = false;

            if (ticketFormId === subscriptionFormId) {
                isSubscriptionTicket = true;
            } else if (ticketTags.includes(subscriptionTag)) {
                isSubscriptionTicket = true;
            }

            if (isSubscriptionTicket) {
                client.get(userIdProperty).then(function (data) {
                    var user_id = data[userIdProperty];

                    if (user_id) {
                        getSubscriptionInfo(client, user_id);
                    } else {
                        displayError('User does not have a User ID.')
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

function getSubscriptionInfo(client, user_id) {
    client.metadata().then(function(metadata) {
        var baseUrl = metadata.settings.apiBaseUrl;
        var apiToken = metadata.settings.apiToken;

        var settings = {
            'url': baseUrl + '/v1/support/' + user_id + '/subscriptions',
            'type': 'GET',
            'content-Type': 'x-www-form-urlencoded',
            'dataType': 'json',
            'headers': {
                'Authorization': apiToken
            }
        };

        var dashboardBase = metadata.settings.subscriptionDashboardUrl;
        var iframeUrl = dashboardBase + '/' + user_id;

        client.request(settings).then(
            function(data) {
                var templateContent = {
                    'user': user_id,
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
            'subscriptionName': obj.plan_name,
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
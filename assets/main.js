$(function () {
    var client = ZAFClient.init();
    client.invoke('resize', {width: '100%', height: '400px'});

    //Fetch the Firefox Account ID from the ticket
    client.metadata().then(function (metadata) {

        var userIdFieldKey = metadata.settings.userIdFieldKey;
        var userIdProperty = 'ticket.requester.customField:' + userIdFieldKey;

        client.get('ticket').then(function (data) {
          console.log("requester " + JSON.stringify(data.ticket.requester));
            var subscriptionFormId = 360000417091;
            var subscriptionTag = 'subscription_services';

            var ticketFormId = data.ticket.form.id;
            var ticketTags = data.ticket.tags;
            let userEmail = data.ticket.requester.email;
            console.log("userEmail =" + userEmail);

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

        var dashboardBase = metadata.settings.subscriptionDashboardUrl;
        var iframeUrl = dashboardBase + '?uid=' + user_id;

        var templateContent = {
            'user': user_id,
            'dashboardSrc': iframeUrl
        };

        var source = $("#sub-template").html();
        var template = Handlebars.compile(source);
        var html = template(templateContent);
        $("#content").html(html);
    })
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

# omniscient
A custom Zendesk app that will provide subscription data in relation to help desk tickets.

## Expected Behavior
This app determines if a ticket is a subscription services ticket by checking the form id and the ticket tags. If the 
form id matches the Subscription Services form or the 'subscription_services' tag is used the app will attempt to load
the user's subscription information. If the app determines that the ticket is not a subscription services ticket, a
message will display explaining that the ticket is not of an applicable type.

The app will then check to see that the ticket requester has a user id set. If the user id is not set, the app will
display text describing that the user object does not have an id associated with it. If the user id is found, the app
will then attempt to load the subscription data for the user.

If there is an error fetching the user's subscription data, a message will display describing that the app was unable to
load subscription data. Otherwise, the app will display any subscription data for the user or indicate that the user
does not have any subscription data to display.

## Local Development

Before beginning development, you will need to install Zendesk App Tools (ZAT). Installation instructions can be followed
here: https://develop.zendesk.com/hc/en-us/articles/360001075048-Installing-and-using-the-Zendesk-apps-tools

From within a terminal, you can run the app locally and test the app within the Zendesk instance.

To start the application locally execute `zat server` from the application's root directory.

As you start the server, you will be prompted to provide configuration data - these settings are defined within
`manifest.json`.

Once the server is running, navigate to a ticket on the Zendesk instance and append `?zat=true` to the end of the url 
and refresh.

You may have to set your browser to unblock content on the page to view the app. The application will appear on the 
right-hand side of the ticket. Once it is unblocked, the app may be hidden: there is a button `Apps` (located on the upper 
right-hand side of the page) that will hide/show the applications that are loaded.

As you make changes to the application, you can use the "reload all apps" button to reload the application. This is a
small button with a circular arrow located above the application on the right.

## Zendesk Installation
Once you are ready to load the app into Zendesk, you will first need to prepare the application. From the application 
root directory execute the following:
* `zat validate` to validate the application, if it fails validation, fix any reported errors and run the validation 
command again.
* `zat package` to package up the application into a zip file. The console output will give you the location of the zip
file.

Once you have the application packaged up, you are ready to install the application on Zendesk.

* In Zendesk Support, click the Admin icon in the sidebar, then select Manage from the Apps category.
* Click Upload Private App in the upper-right corner of the page.
* Enter the name of your app.
* Click Choose File and select the zip file of your app.
* Click Upload to upload the app to Zendesk Support.
* When prompted, click Install.

After the application has been installed, the configurations can be updated from the Apps Manager.

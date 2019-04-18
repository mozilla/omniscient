# omniscient
A custom Zendesk app that will provide subscription data in relation to help desk tickets.

## Local Development
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
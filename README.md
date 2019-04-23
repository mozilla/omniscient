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
* Enter the name of your app (Requester X-ray). If you did the tutorial for ZAF v1 and installed the app, use a slightly different name for this second version of the app.
* Click Choose File and select the zip file of your app.
* Click Upload to upload the app to Zendesk Support.
* When prompted, click Install.

After the application has been installed, use the 

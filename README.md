# basic_authentication_nodejs
Implements basic authentication, using cookies, in nodejs

This is a learning purpose project

This repository implements the basic authentication strategy, using cookies to store authentication data in to the clients browser

The authentication data, encoded with base64, is sent via a client fetch request to the server, then the server verifies if the authentication cookie already exists, if it
not exists the server tests de data sent by client if ok, creates an encoded cookie with a server based secret, else returns a message to client, 
if the cookie exists the the server will test its validity.

next tasks
- server/client implement try/catch structures to error handling
- server implement a log for all authentication events
- use typescript
- +/- server/client refactor the authentication endpoint using specific methods
- OK client login data validation before send to server (must not contain ":")
- OK client display server message within login page
- OK cookie expires after a pre-set period
- OK server implements an app page end point with the cookie testing policy
- OK client remove javascript code from the login html file
- OK server looks for user login data in a database
- OK server validates cookie user data connecting with the DB
- OK server/client implements a sign on page and link it to a server database


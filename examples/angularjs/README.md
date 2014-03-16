# Passport-UserApp - Example with AngularJS as a front-end

<https://github.com/userapp-io/passport-userapp>

Example with AngularJS as the front-end and Node.js+Passport as the back-end. Authentication to UserApp is handled from the front-end by the [UserApp module](https://github.com/userapp-io/userapp-angular), while authorization to the back-end API is done by providing the session token with a cookie. The [UserApp Passport strategy](https://github.com/userapp-io/passport-userapp) is then validating the session token before authorizing the API calls.

## Getting Started

* Get your UserApp [App Id](https://help.userapp.io/customer/portal/articles/1322336-how-do-i-find-my-app-id-) and replace 'YOUR-USERAPP-APP-ID' in `app.js` and `public/js/app.js` with that id.

* Install all the dependencies:

  `$ npm install`

* Start the Node.js server

  `$ node app.js`

* Browse to `http://localhost:3000`

* Try to sign up and log in. Two "articles" should load from the back-end.

## Help

Contact us via email at support@userapp.io or visit our [support center](https://help.userapp.io). You can also see the [UserApp documentation](https://app.userapp.io/#/docs/) for more information.

## License

(The MIT License)

Copyright (c) 2014 UserApp

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

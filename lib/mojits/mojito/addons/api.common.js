// (The MIT License)

// Copyright (c) 2012 Richard S Allinson <rsa@mountainmansoftware.com>

// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// 'Software'), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:

// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
// CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/*globals define: true*/

'use strict';

define("mojito-addon-api", ["mojito-utils"], function (utils) {

    return function (command, adapter, api) {

        /*
            The meta data object
        */

        api.meta = api.meta || {};

        /*
            Send data & or meta then close the connection
        */

        api.done = function (data, meta) {
            this.send(data, meta);
            adapter.done();
        };

        /*
            Send data & or meta
        */

        api.send = function (data, meta) {

            var sendMeta = {};

            if (meta) {
                sendMeta = utils.merge(api.meta, meta);
            } else {
                sendMeta = api.meta;
            }

            adapter.send(data, sendMeta);
        };

        /*
            Words
        */

        api.use = function (addonName, fn) {

            if (typeof addonName === "string") {
                addonName = [addonName];
            }

            require(addonName, function () {

                var pos,
                    module;

                /*
                    Words
                */
                for (pos in arguments) {
                    if (arguments.hasOwnProperty(pos)) {
                        module = arguments[pos];
                        if (typeof module === "function") {
                            module(command, adapter, api);
                        }
                    }
                }

                fn();
            });
        };
    };
});
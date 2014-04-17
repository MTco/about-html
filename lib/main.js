/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

require('page/setup');

const tabs = require("sdk/tabs");
const { when: unload } = require('sdk/system/unload');
const { loadReason } = require('sdk/self');
const { close } = require('./page/actions');

if (loadReason == 'install') {
  tabs.open({
    url: 'about:html'
  });
}

// Closing all about:history tabs on uninstall/disable
unload(reason => {
  if (reason == 'disable' || reason == 'uninstall') {
    close();
  }
});

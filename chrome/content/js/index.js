/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

const $ = id => document.getElementById(id);

let output = $('output');
const endTag = $('end-tag')
const tag = $('tag');
tag.addEventListener('keyup', onTagChange, false);

function onTagChange() {
  // always use lower case
  let value = tag.value = tag.value.toLowerCase();
  let { lastValue } = tag;

  if (lastValue == value)
    return;

  tag.lastValue = value;

  if (output) {
    document.body.removeChild(output);
  }
  output = render(value)
  document.body.appendChild(output);
}
onTagChange();

function render(tag) {
  let tagName = /^[a-z]+/i.exec(tag);
  clear(endTag);
  if (!tagName || tagName) {
    endTag.appendChild(document.createTextNode('/>'));
  }
  return html('div', { "id": "output" }, [ tag ]);
}

function clear(ele) {
  for (let i = ele.children.length - 1; i > 0; i--) {
    ele.removeChild(ele.children[i]);
  }
  ele.innerHTML = '';
}

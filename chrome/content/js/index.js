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
  value = value.trim();

  if (output) {
    document.body.removeChild(output);
  }
  render(value).then(ele => {
    output = ele;
    document.body.appendChild(output);
  }, err => {
    console.exception(err);
  });
}
onTagChange();

function extractAttributes(tag) {
  let attrs = (tag + " ").match(/^[a-z]\s+([a-z]+(=["'][^"']*['"]\s*)?)*/i) || [];
  let attributes = {};
  let lastAttr;

  for (let len = attrs.length, i = 1; i < len; i++) {
    let x = attrs[i];
    if (!x) continue;
    if (x.startsWith("=") && !lastAttr) {
      attributes[lastAttr] = x.splice(2, x.length - 3);
    }
    else {
      console.log(x);
      lastAttr = x.match(/^[a-z]+/)[0];
      attributes[lastAttr] = "";
    }
  }
  console.log(JSON.stringify(attributes));
  return attributes;
}

function render(tag) {
  let p = new Promise(function(resolve, reject) {
    let tagName = /^[a-z]+/i.exec(tag);
    let attrs = extractAttributes(tag);

    clear(endTag);
    if (!tagName) {
      endTag.appendChild(document.createTextNode('/>'));
    }
    else {
      let xhr = new XMLHttpRequest();
      xhr.onload = function() {
        try {
          let json = xhr.responseText;
          json = JSON.parse(json);

          if (json.requiresEndTag) {
            endTag.appendChild(document.createTextNode('/><' + tagName + '>'));
          }
          else {
            endTag.appendChild(document.createTextNode('/>'));
          }

          resolve(html('div', { "id": "output" }, [
            html("h1", {}, "<" + tagName + ">"),
            html("div", { id: "desc" }, json.description),
            html("div", { id: "props" },  (function() {
              let props = [];
              for (let prop of Object.keys(json.attributes)) {
                let details = json.attributes[prop];

                props.push(html("div", {
                  "class":  attrs[prop] !== undefined ? "property used" : "property"
                }, [
                  html("h2", {}, prop),
                  html("div", {}, details.description)
                ]));
              }
              return props;
            })())
          ]));
        }
        catch(e) {
          return reject();
        }
      }
      xhr.open("GET", "tags/" + tagName + ".json");
      xhr.send();
    }
  });

  return p;
}

function clear(ele) {
  for (let i = ele.children.length - 1; i > 0; i--) {
    ele.removeChild(ele.children[i]);
  }
  ele.innerHTML = '';
}

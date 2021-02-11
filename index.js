import React from 'react';

import { Plugin } from '@vizality/entities';
import { findInReactTree } from '@vizality/util/react';
import { patch, unpatch } from '@vizality/patcher';
import { getModule, getModuleByDisplayName, getModules } from '@vizality/webpack';

const label = require('./components/label.jsx');

export default class HoofersFirstPlugin extends Plugin {
start () {
    const MaskedLink = getModuleByDisplayName("MaskedLink", false)
    patch('title-inject', MaskedLink.prototype, "render", (args, res) => {
        if (typeof(res.props.children) === "string"){
            res.props.children = [res.props.children]
        }
        res.props.children.push(React.createElement(label, {})); 
        return res;
    });
  }

  stop () {
     unpatch('title-inject')
  }
}
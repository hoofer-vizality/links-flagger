import React from 'react';

import { Plugin } from '@vizality/entities';
import { findInReactTree } from '@vizality/util/react';
import { patch, unpatch } from '@vizality/patcher';
import { getModule, getModuleByDisplayName, getModules } from '@vizality/webpack';

const label = require('./components/label.jsx');

const tooltipTypes = [
    {
        name: "Safe URL",
        field_display: "No problems found!",
        urlClass: "safe-url-link",
        tooltipClass: "safe-url-tooltip-content"
    },
    {
        name: "Unsafe URL",
        field_display: "This potentially has unwanted content, proceed with caution.",
        urlClass: "unsafe-url-link",
        tooltipClass: "unsafe-url-tooltip-content"
    },
    {
        name: "Dangerous URL",
        field_display: "This URL was flagged as dangerous, proceed at your own risk.",
        urlClass: "dangerous-url-link",
        tooltipClass: "dangerous-url-tooltip-content"
    }
]

export default class LinksFlagger extends Plugin {
start () {
    // theming
    this.injectStyles('style.scss');

    // modules
    const MaskedLink = getModuleByDisplayName("MaskedLink", false)
    const Tooltip = getModuleByDisplayName('Tooltip', false)

    // injectors
    patch('tooltip-inject', Tooltip.prototype, "renderTooltip", (args, res) => {
        if (!res.props || !res.props.children || !res.props.targetElementRef || !res.props.targetElementRef.current)
            return;
        
        // probably bad way of doing it, don't care though
        tooltipTypes.forEach(tooltipInfo=>{
            console.log(res.props.targetElementRef.current.classList)
            if (res.props.targetElementRef.current.classList.contains(tooltipInfo.urlClass)){
                res.props.tooltipClassName = tooltipInfo.tooltipClass
                res.props.children = tooltipInfo.field_display;
            }
        })
        
        return res;
    });
    patch('link-inject', MaskedLink.prototype, "render", (args, res) => {
        if (!res.props || !res.props.children)
            return res;
        if (typeof(res.props.children) === "object")
            res.props.children = res.props.children[0];
        
        var customClass = "";


        console.log(res.props.className)
        if (res.props.className && res.props.className.includes("embedTitleLink"))
            customClass = "link-title-container";

        if (!res.props.href.startsWith("https://discord"))
            res.props.children = React.createElement(label, {classType:customClass,field:res.props.children,hoverText:res.props.children});
        
        return res;
    });


  }

  stop () {
     unpatch('tooltip-inject')
     unpatch('link-inject')
  }
}
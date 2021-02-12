import React from 'react';

import { Plugin } from '@vizality/entities';
import { findInReactTree } from '@vizality/util/react';
import { patch, unpatch } from '@vizality/patcher';
import { getModule, getModuleByDisplayName, getModules } from '@vizality/webpack';
import { get } from '@vizality/http';

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

const bypassedUrls = [];
const unsafeUrls = [];
const dangerousUrls = [];

export default class LinksFlagger extends Plugin {
    start () {
        // theming
        this.injectStyles('style.scss');  
        // preload all the urls

        get("https://raw.githubusercontent.com/hoofer-vizality/links-flagger/main/urls/unsafe_urls.txt")
            .then(res=> this.assortUrls(res.body.toString(),unsafeUrls))
        get("https://raw.githubusercontent.com/hoofer-vizality/links-flagger/main/urls/dangerous_urls.txt")
            .then(res=> this.assortUrls(res.body.toString(),dangerousUrls))
        get("https://raw.githubusercontent.com/hoofer-vizality/links-flagger/main/urls/bypassed_urls.txt")
            .then(res=> this.assortUrls(res.body.toString(),bypassedUrls))    

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
            
            if (res.props.className && res.props.className.includes("embedTitleLink"))
                customClass += "link-title-container"; 
            
            var filter = this.filterUrl(res.props.href)
            if (filter){
                if (this.getToolTipFromName("Safe URL").urlClass !== filter) {
                    customClass += " flagged-link"
                }
                res.props.children = React.createElement(label, {classType:customClass,field:res.props.children,data:filter});
            }
            
            return res;
        });   
    }

    stop () {
        unpatch('tooltip-inject')
        unpatch('link-inject')
    }

    // sorts the urls from http requests

    assortUrls(stringList, arrayLocation){
        stringList.split("\n").forEach(url=>{
            if (url !== ""){
                arrayLocation.push(url);
            }
        })
    }

    // filters inputted url and returns class type of url

    filterUrl(inputUrl){
        inputUrl = inputUrl.toLowerCase();
        var res = this.getToolTipFromName("Safe URL").urlClass;
        unsafeUrls.forEach(url=>{
            url = url.split(/\s+/).join('');
            if (url !== "" && inputUrl.includes(url.toLowerCase())){
                res = this.getToolTipFromName("Unsafe URL").urlClass;
            }
        })
        dangerousUrls.forEach(url=>{
            url = url.split(/\s+/).join('');
            if (url !== "" && inputUrl.includes(url.toLowerCase())){
                res = this.getToolTipFromName("Dangerous URL").urlClass;
            }
        })
        bypassedUrls.forEach(url=>{
            url = url.split(/\s+/).join('');
            if (url !== "" && inputUrl.includes(url.toLowerCase())){
                res = false
            }
        })

        return res;
    }

    // converts tooltip name into tooltip object

    getToolTipFromName(name){   
        var res = null;
        tooltipTypes.forEach(tooltip=>{
            if (tooltip.name == name){
                res = tooltip;
            }
        })
        return res;
    }
}
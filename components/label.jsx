import React from 'react';
import { FormItem, FormText, Tooltip, Button, Divider } from '@vizality/components/';

module.exports = ({field,hoverText,classType}) => (
   <Tooltip
   text={hoverText}
   color="red"
   className='vz-settings-button-item-button-wrapper dangerous-url-link'>
    <div class={`suspicious-url ${classType}`}>
        {field}
    </div>
   </Tooltip>
);


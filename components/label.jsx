import React from 'react';
import { FormItem, FormText, Tooltip, Button, Divider } from '@vizality/components/';

module.exports = ({field,hoverText}) => (
   <Tooltip
   text="This URL is potentially malicious. Proceed with caution."
   color="red"
   className='vz-settings-button-item-button-wrapper suspicious-url-link'>
    <div class="suspicious-url">
        {field}
    </div>
   </Tooltip>
);


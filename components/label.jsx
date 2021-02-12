import React from 'react';
import { FormItem, FormText, Tooltip, Button, Divider } from '@vizality/components/';

module.exports = ({field,classType,data}) => (
   <Tooltip
   text="Loading..."
   color="red"
   className={`vz-settings-button-item-button-wrapper ${data}`}>
    <div class={`suspicious-url ${classType}`}>
        {field}
    </div>
   </Tooltip>
);


import React from 'react';
import { Tooltip } from '@vizality/components/';

module.exports = ({field,classType,data}) => (
   <Tooltip
   text="Loading..."
   color="red"
   className={`vz-settings-button-item-button-wrapper ${data}`}>
    <div class={`modified-url ${classType}`}>
        {field}
    </div>
   </Tooltip>
);


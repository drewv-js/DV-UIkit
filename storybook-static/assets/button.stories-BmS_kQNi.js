import{r as e}from"./preload-helper-Dl2UHooj.js";var t,n,r,i,a,o;e((()=>{t={title:`Components/Button`,tags:[`autodocs`],argTypes:{label:{control:`text`},variant:{control:`select`,options:[`primary`,`secondary`,`danger`]},disabled:{control:`boolean`}},args:{label:`Button`,variant:`primary`,disabled:!1},render:({label:e,variant:t,disabled:n})=>`<dv-button variant="${t}" ${n?`disabled`:``}>${e}</dv-button>`},n={args:{label:`Save`,variant:`primary`}},r={args:{label:`Cancel`,variant:`secondary`}},i={args:{label:`Delete`,variant:`danger`}},a={args:{label:`Disabled`,variant:`primary`,disabled:!0}},n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Save',
    variant: 'primary'
  }
}`,...n.parameters?.docs?.source}}},r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Cancel',
    variant: 'secondary'
  }
}`,...r.parameters?.docs?.source}}},i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Delete',
    variant: 'danger'
  }
}`,...i.parameters?.docs?.source}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Disabled',
    variant: 'primary',
    disabled: true
  }
}`,...a.parameters?.docs?.source}}},o=[`Primary`,`Secondary`,`Danger`,`Disabled`]}))();export{i as Danger,a as Disabled,n as Primary,r as Secondary,o as __namedExportsOrder,t as default};
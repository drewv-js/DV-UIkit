import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'dv-textfield',
  styleUrl: 'textfield.scss',
  shadow: true
})
export class DvTextfield {
  @Prop({ reflect: true })
  label = 'DvTextfield';

  render() {
    return (
      <Host>
        <slot>{this.label}</slot>
      </Host>
    );
  }
}

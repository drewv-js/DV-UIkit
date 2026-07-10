import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'dv-radio',
  styleUrl: 'radio.scss',
  shadow: true
})
export class DvRadio {
  @Prop({ reflect: true })
  label = 'DvRadio';

  render() {
    return (
      <Host>
        <slot>{this.label}</slot>
      </Host>
    );
  }
}

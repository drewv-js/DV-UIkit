import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'dv-checkbox',
  styleUrl: 'checkbox.scss',
  shadow: true
})
export class DvCheckbox {
  @Prop({ reflect: true })
  label = 'DvCheckbox';

  render() {
    return (
      <Host>
        <slot>{this.label}</slot>
      </Host>
    );
  }
}

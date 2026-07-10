import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'dv-dropdown',
  styleUrl: 'dropdown.scss',
  shadow: true
})
export class DvDropdown {
  @Prop({ reflect: true })
  label = 'DvDropdown';

  render() {
    return (
      <Host>
        <slot>{this.label}</slot>
      </Host>
    );
  }
}

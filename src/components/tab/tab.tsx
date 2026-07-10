import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'dv-tab',
  styleUrl: 'tab.scss',
  shadow: true
})
export class DvTab {
  @Prop({ reflect: true })
  label = 'DvTab';

  render() {
    return (
      <Host>
        <slot>{this.label}</slot>
      </Host>
    );
  }
}

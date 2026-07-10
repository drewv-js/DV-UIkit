import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'dv-tab-group',
  styleUrl: 'tab-group.scss',
  shadow: true
})
export class DvTabGroup {
  @Prop({ reflect: true })
  label = 'DvTabGroup';

  render() {
    return (
      <Host>
        <slot>{this.label}</slot>
      </Host>
    );
  }
}

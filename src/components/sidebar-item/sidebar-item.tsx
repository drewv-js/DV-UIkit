import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'dv-sidebar-item',
  styleUrl: 'sidebar-item.scss',
  shadow: true
})
export class DvSidebarItem {
  @Prop({ reflect: true })
  label = 'DvSidebarItem';

  render() {
    return (
      <Host>
        <slot>{this.label}</slot>
      </Host>
    );
  }
}

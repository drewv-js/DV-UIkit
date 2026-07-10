import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'dv-sidebar',
  styleUrl: 'sidebar.scss',
  shadow: true
})
export class DvSidebar {
  @Prop({ reflect: true })
  label = 'DvSidebar';

  render() {
    return (
      <Host>
        <slot>{this.label}</slot>
      </Host>
    );
  }
}

import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'dv-app-bar',
  styleUrl: 'app-bar.scss',
  shadow: true
})
export class DvAppBar {
  @Prop({ reflect: true })
  label = 'DvAppBar';

  render() {
    return (
      <Host>
        <slot>{this.label}</slot>
      </Host>
    );
  }
}

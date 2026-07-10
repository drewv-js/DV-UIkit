import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'dv-toggle',
  styleUrl: 'toggle.scss',
  shadow: true
})
export class DvToggle {
  @Prop({ reflect: true })
  label = 'DvToggle';

  render() {
    return (
      <Host>
        <slot>{this.label}</slot>
      </Host>
    );
  }
}

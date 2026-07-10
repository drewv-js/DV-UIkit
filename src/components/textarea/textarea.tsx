import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'dv-textarea',
  styleUrl: 'textarea.scss',
  shadow: true
})
export class DvTextarea {
  @Prop({ reflect: true })
  label = 'DvTextarea';

  render() {
    return (
      <Host>
        <slot>{this.label}</slot>
      </Host>
    );
  }
}

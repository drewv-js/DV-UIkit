import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'dv-modal',
  styleUrl: 'modal.scss',
  shadow: true
})
export class DvModal {
  @Prop({ reflect: true })
  label = 'DvModal';

  render() {
    return (
      <Host>
        <slot>{this.label}</slot>
      </Host>
    );
  }
}

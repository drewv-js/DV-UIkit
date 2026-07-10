import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'dv-footer',
  styleUrl: 'footer.scss',
  shadow: true
})
export class DvFooter {
  @Prop({ reflect: true })
  label = 'DvFooter';

  render() {
    return (
      <Host>
        <slot>{this.label}</slot>
      </Host>
    );
  }
}

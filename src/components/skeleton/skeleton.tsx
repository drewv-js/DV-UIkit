import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'dv-skeleton',
  styleUrl: 'skeleton.scss',
  shadow: true
})
export class DvSkeleton {
  @Prop({ reflect: true })
  label = 'DvSkeleton';

  render() {
    return (
      <Host>
        <slot>{this.label}</slot>
      </Host>
    );
  }
}

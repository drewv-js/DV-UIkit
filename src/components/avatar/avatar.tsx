import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'dv-avatar',
  styleUrl: 'avatar.scss',
  shadow: true
})
export class DvAvatar {
  @Prop({ reflect: true })
  label = 'DvAvatar';

  render() {
    return (
      <Host>
        <slot>{this.label}</slot>
      </Host>
    );
  }
}

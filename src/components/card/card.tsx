import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'd-card',
  styleUrl: 'card.scss',
  shadow: true
})
export class DCard {
  @Prop({ reflect: true })
  heading = '';

  render() {
    return (
      <Host>
      <article part="card">
        {this.heading ? <header part="header">{this.heading}</header> : null}
        <div class="body" part="body">
          <slot />
        </div>
      </article>
      </Host>
    );
  }
}

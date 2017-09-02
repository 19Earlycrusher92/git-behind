'use babel';

/*
export default class GitBehindView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('git-behind');

    // Create message element
    const message = document.createElement('div');
    message.textContent = 'The GitBehind package is Alive! It\'s ALIVE!';
    message.classList.add('message');
    this.element.appendChild(message);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

}
*/

console.log('here2')
const element_name = `git-behind${Date.now()}`;

class StatusBarTileView extends HTMLElement {
  init() {
    console.log('here3')
    //this.link = document.createElement('a');
    //this.link.classList.add('inline-block');
    //this.link.href = 'https://wakatime.com/';
    //this.appendChild(this.link);

    //this.icon = document.createElement('div');
    //this.icon.setAttribute('id', 'wakatime-status-bar');
    //this.icon.classList.add('inline-block');
    //this.icon.innerHTML = svg;
    //this.link.appendChild(this.icon);

    this.msg = document.createElement('span');
    this.msg.classList.add('inline-block');
    this.appendChild(this.msg);

    return this.setStatus("Git-behind HELLO... ✔︎ 🔴");
  }

  show() {
    this.classList.add(element_name, 'inline-block');
    return this.classList.remove(element_name, 'hidden');
  }

  hide() {
    this.classList.remove(element_name, 'inline-block');
    return this.classList.add(element_name, 'hidden');
  }

  destroy() {
    if (this.tooltip != null) {
      this.tooltip.dispose();
    }
    return this.classList = '';
  }

  setStatus(content) {
    return (this.msg != null ? this.msg.textContent = content || '' : undefined);
  }

  setTitle(text) {
    if (this.tooltip != null) {
      this.tooltip.dispose();
    }
    return this.tooltip = atom.tooltips.add(this,
      {title: text});
  }
}

module.exports = document.registerElement(element_name, {
  prototype: StatusBarTileView.prototype,
  extends: 'div'
});

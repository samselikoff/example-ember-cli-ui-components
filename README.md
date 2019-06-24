Don't use this 🤙

# Usage

Example just using the JS api:

```js
import { computed } from '@ember/object';
import Component from '@ember/component';
import { Styled, group } from 'ember-cli-ui-components';
import { or } from '@ember/object/computed';
import { oneWay } from '@ember/object/computed';

export default Component.extend(Styled, {

  'on-click': null,
  task: null,

  isRunning: false,

  tagName: 'button',

  styles: Object.freeze({
    base: 'leading-tight pointer relative transition focus:outline-none',

    defaultStyle: 'inline-block medium gray margins round',

    colors: group({
      gray: 'bg-grey-light text-black font-medium hover:bg-grey focus:bg-grey',
      subtle: 'bg-grey-light text-grey-dark font-medium',
      warn: 'border-none text-white font-semibold bg-red hover:bg-red-dark focus:bg-red-dark',
      white: 'font-normal bg-transparent border-solid border-2 border-white text-white',
      blue: 'border-none bg-blue text-white hover:bg-blue-dark focus:bg-blue-dark',
      brand: 'border-none bg-em-orange text-white font-medium hover:bg-em-orange-dark focus:bg-em-orange-dark',
      orange: 'border-none bg-em-orange text-white hover:bg-em-orange-dark focus:bg-em-orange-dark',
      'white-bg': 'font-normal bg-white text-black',
    }),

    sizes: group({
      small: 'text-7 xs:text-6 py-1 xs:py-2 px-2 xs:px-3',
      medium: 'text-6 xs:text-4 py-2 xs:py-3 px-3 xs:px-4',
      large: 'text-5 xs:text-4 py-3 px-3 xs:px-4'
    }),

    'nowrap': 'whitespace-no-wrap',

    floating: 'shadow-l',

    behavior: group({
      dim: 'dim',
      disabled: 'opacity-50 no-events'
    }),

    margins: group({
      margins: 'mt-2 mb-3',
      marginless: ''
    }),

    uppercase: 'uppercase',

    radii: group({
      round: 'rounded-2',
      pill: 'rounded-pill',
      append: 'rounded-r h-full',
      'md:append': 'rounded-2 md:rounded-l-0 md:rounded-r md:h-full',
    }),

    bold: 'font-bold',

    full: 'w-full',

    displays: group({
      block: 'block',
      'inline-block': 'inline-block',
      flex: 'flex'
    }),

    input: {
      tagName: 'input'
    },

    link: {
      style: 'no-underline',
      tagName: 'a'
    }
  }),

  attributeBindings: ['href', 'type', 'value', 'disabled', 'elementStyle:style'],

  isSubmit: computed('activeStyles', function() {
    return this.activeStyles.includes('input');
  }),

  isLink: computed('activeStyles', function() {
    return this.activeStyles.includes('link');
  }),

  type: computed('isSubmit', function() {
    if (this.isSubmit) {
      return 'submit';
    } else if (this.isLink) {
      return '';
    } else {
      return 'button';
    }
  }),

  isLoading: or('isRunning', 'task.isRunning'),
  disabled: oneWay('isLoading'),

  click(event) {
    let action = this['on-click'];
    let task = this.task;

    if (action) {
      event.preventDefault();
      action();
    } else if (task) {
      event.preventDefault();
      task.perform();
    }
  },

  didInsertElement() {
    this._super(...arguments);

    let initialWidth = this.$().outerWidth();
    this.set('initialWidth', initialWidth);
    this.set('loadingOffset', initialWidth - 20);
  },

  didRender() {
    this._super(...arguments);

    if (this.element) {
      let spinnerWidth = this.$('[data-loading-spinner]').width();
      let offset = spinnerWidth / 2;

      this.set('spinnerOffset', `margin-left: -${offset}px`);
    }
  }
});
```

Example template of a UI component using `{{activeClasses}}`:

```hbs
{{~#if on-click~}}

  <a href="#" {{action on-click}} class={{activeClasses}} data-test-id={{data-test-id}} data-attachment-id={{data-attachment-id}}>
    {{yield}}
  </a>

{{~else if href~}}

  <a href={{href}} class={{activeClasses}} data-test-id={{data-test-id}} data-attachment-id={{data-attachment-id}}>
    {{yield}}
  </a>

{{~/if~}}
```

# Styleguide

The styleguide code is because we were playing with autogenerating a styleguide based on the ui components.

```js
// router
this.route('styleguide', function() {
  this.route('components', function() {
    this.route('component', { path: '/:component_name' });
  });
});

// styleguide template
{{#styleguide-viewer as |viewer|}}
  {{#viewer.nav as |nav|}}
    {{nav.item 'BUTTON' 'styleguide.components.component' 'button'}}
    {{nav.item 'UI P' 'styleguide.components.component' 'ui-p'}}
    {{nav.item 'UI ALERT' 'styleguide.components.component' 'ui-alert'}}
    {{nav.item 'UI CONTAINER' 'styleguide.components.component' 'ui-container'}}
    {{nav.item 'UI FLASH MESSAGE' 'styleguide.components.component' 'ui-flash-message'}}
    {{nav.item 'UI INPUT' 'styleguide.components.component' 'ui-input'}}
    {{nav.item 'UI TEXTAREA' 'styleguide.components.component' 'ui-textarea'}}
    {{nav.item 'UI LABEL' 'styleguide.components.component' 'ui-label'}}
    {{nav.item 'UI LINK' 'styleguide.components.component' 'ui-link'}}
    {{nav.item 'UI LOADING' 'styleguide.components.component' 'ui-loading'}}
    {{nav.item 'UI PANEL' 'styleguide.components.component' 'ui-panel'}}
    {{nav.item 'UI TABLE' 'styleguide.components.component' 'ui-table'}}
    {{nav.item 'UI TITLE' 'styleguide.components.component' 'ui-title'}}

    {{nav.item 'Course Signup' 'styleguide.components.component' 'course-signup-provider'}}

  {{/viewer.nav}}

  {{#viewer.main}}
    {{outlet}}
  {{/viewer.main}}

{{/styleguide-viewer}}
```

Something like this, and it spits out https://embermap.com/styleguide based on the styles you've defined.

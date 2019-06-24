import Component from '@ember/component';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import _ from 'lodash';
import setupCustomAssertions from '../../helpers/setup-custom-assertions';
import { Styled, group } from 'ember-cli-ui-components';

module('Ember CLI UI Components | Styled', function(hooks) {
  setupRenderingTest(hooks);
  setupCustomAssertions(hooks);

  function assertElementHasClasses(assert, $el, classes) {
    classes = _.compact(classes.split(' '));
    let actualClasses = $el.attr("class").split(' ').filter(cls => cls !== 'ember-view');

    let classesMatch = _.isEqual(classes.sort(), actualClasses.sort());
    assert.ok(classesMatch, `Expected [${classes.join(',')}] to equal [${actualClasses.join(',')}]`);
  }

  function assertElementTagIs(assert, $el, tag) {
    let expectedTag = tag.toUpperCase();
    let actualTag = $el.prop('tagName');
    let tagMatches = expectedTag === actualTag
    assert.ok(tagMatches, `Expected ${actualTag} to equal ${expectedTag}`);
  }

  test("I can use the Styled mixin with nothing defined", async function(assert) {
    this.owner.register('component:styled-component', Component.extend(Styled));

    await render(hbs`
      {{styled-component}}
    `);

    assertElementHasClasses(assert, this.$('div'), '');
  });

  test("I can use the Styled mixin with an empty styles prop", async function(assert) {
    this.owner.register('component:styled-component', Component.extend(Styled, {
      styles: Object.freeze({})
    }));

    await render(hbs`
      {{styled-component}}
    `);

    assertElementHasClasses(assert, this.$('div'), '');
  });

  test("I can use the Styled mixin with an empty base definition", async function(assert) {
    this.owner.register('component:styled-component', Component.extend(Styled, {
      styles: Object.freeze({
        base: ''
      })
    }));

    await render(hbs`
      {{styled-component}}
    `);

    assertElementHasClasses(assert, this.$('div'), '');
  });

  test("I can add classes to the element using the base definition", async function(assert) {
    this.owner.register('component:styled-component', Component.extend(Styled, {
      styles: Object.freeze({
        base: 'text-4 ff-copy'
      })
    }));

    await render(hbs`
      {{styled-component}}
    `);

    assertElementHasClasses(assert, this.$('div'), 'text-4 ff-copy');
  });

  test("I can define and use a style", async function(assert) {
    this.owner.register('component:styled-component', Component.extend(Styled, {
      styles: Object.freeze({
        green: 'light-green'
      })
    }));

    await render(hbs`
      {{styled-component style='green'}}
    `);

    assertElementHasClasses(assert, this.$('div'), 'light-green');
  });

  test("I can define and use multiple styles", async function(assert) {
    this.owner.register('component:styled-component', Component.extend(Styled, {
      styles: Object.freeze({
        green: 'light-green',
        large: 'text-3'
      })
    }));

    await render(hbs`
      {{styled-component style='green large'}}
    `);

    assertElementHasClasses(assert, this.$('div'), 'light-green text-3');
  });

  test("I can use the base definition with styles", async function(assert) {
    this.owner.register('component:styled-component', Component.extend(Styled, {
      styles: Object.freeze({
        base: 'ff-copy',
        green: 'light-green',
        large: 'text-3'
      })
    }));

    await render(hbs`
      {{styled-component style='green large'}}
    `);

    assertElementHasClasses(assert, this.$('div'), 'ff-copy light-green text-3');
  });

  test("I can group styles", async function(assert) {
    this.owner.register('component:styled-component', Component.extend(Styled, {
      styles: Object.freeze({
        colors: group({
          green: 'light-green',
          blue: 'blue'
        })
      })
    }));

    await render(hbs`
      {{styled-component style='green'}}
    `);

    assertElementHasClasses(assert, this.$('div'), 'light-green');
  });

  test("I get an error when trying to use more than one style from a group", async function(assert) {
    this.owner.register('component:styled-component', Component.extend(Styled, {
      styles: Object.freeze({
        colors: group({
          green: 'light-green',
          blue: 'blue'
        })
      })
    }));

    await assert.asyncThrows(() => {
      return render(hbs`
        {{styled-component style='green blue'}}
      `);
    }, `You passed the 'blue' style to a component:styled-component but you've already used a style from the 'colors' oneOf group.`);
  });

  test("I can use normal styles and group styles", async function(assert) {
    this.owner.register('component:styled-component', Component.extend(Styled, {
      styles: Object.freeze({
        wide: 'w-500',
        colors: group({
          green: 'light-green',
          blue: 'blue'
        })
      })
    }));

    await render(hbs`
      {{styled-component style='wide green'}}
    `);

    assertElementHasClasses(assert, this.$('div'), 'w-500 light-green');
  });

  test("I can use a base definition, normal styles and group styles", async function(assert) {
    this.owner.register('component:styled-component', Component.extend(Styled, {
      styles: Object.freeze({
        base: 'ff-copy',
        wide: 'w-500',
        colors: group({
          green: 'light-green',
          blue: 'blue'
        })
      })
    }));

    await render(hbs`
      {{styled-component style='wide green'}}
    `);

    assertElementHasClasses(assert, this.$('div'), 'ff-copy w-500 light-green');
  });

  test("I can set a defaultStyle", async function(assert) {
    this.owner.register('component:styled-component', Component.extend(Styled, {
      styles: Object.freeze({
        defaultStyle: 'wide green',

        wide: 'w-500',
        colors: group({
          green: 'light-green',
          blue: 'blue'
        })
      })
    }));

    await render(hbs`
      {{styled-component}}
    `);

    assertElementHasClasses(assert, this.$('div'), 'w-500 light-green');
  });

  test("Setting a style will override any default style that comes from that style's group", async function(assert) {
    this.owner.register('component:styled-component', Component.extend(Styled, {
      styles: Object.freeze({
        defaultStyle: 'wide green',

        wide: 'w-500',
        colors: group({
          green: 'light-green',
          blue: 'blue'
        })
      })
    }));

    await render(hbs`
      {{styled-component style='blue'}}
    `);

    assertElementHasClasses(assert, this.$('div'), 'w-500 blue');
  });

  test("I can set a style to a dynamic property", async function(assert) {
    this.owner.register('component:styled-component', Component.extend(Styled, {
      styles: Object.freeze({
        defaultStyle: 'wide green',

        wide: 'w-500',
        colors: group({
          green: 'light-green',
          blue: 'blue'
        })
      })
    }));

    this.set('myStyle', '');
    await render(hbs`
      {{styled-component style=myStyle}}
    `);

    assertElementHasClasses(assert, this.$('div'), 'w-500 light-green');

    this.set('myStyle', 'blue');

    assertElementHasClasses(assert, this.$('div'), 'w-500 blue');
  });

  test("I can use the `activeClasses` property in my component's template", async function(assert) {
    this.owner.register('component:styled-component', Component.extend(Styled, {
      styles: Object.freeze({
        defaultStyle: 'wide green',

        wide: 'w-500',
        colors: group({
          green: 'light-green',
          blue: 'blue'
        })
      })
    }));
    this.owner.register('template:components/styled-component', hbs`<p class={{activeClasses}}>hi</p>`);

    await render(hbs`
      {{styled-component}}
    `);

    assertElementHasClasses(assert, this.$('p'), 'w-500 light-green');
  });

  test("I can render a tagless component and use the `activeClasses` property in my template", async function(assert) {
    this.owner.register('component:styled-component', Component.extend(Styled, {
      tagName: '',

      styles: Object.freeze({
        defaultStyle: 'wide green',

        wide: 'w-500',
        colors: group({
          green: 'light-green',
          blue: 'blue'
        })
      })
    }));
    this.owner.register('template:components/styled-component', hbs`<p class={{activeClasses}}>hi</p>`);

    await render(hbs`
      {{styled-component}}
    `);

    assertElementHasClasses(assert, this.$('p'), 'w-500 light-green');
  });

  test("I can set `applyActiveClassesToRoot` to false if I don't want the styles rendered to the root element", async function(assert) {
    this.owner.register('component:styled-component', Component.extend(Styled, {
      applyActiveClassesToRoot: false,

      styles: Object.freeze({
        defaultStyle: 'wide green',

        wide: 'w-500',
        colors: group({
          green: 'light-green',
          blue: 'blue'
        })
      })
    }));

    await render(hbs`
      {{styled-component}}
    `);

    assertElementHasClasses(assert, this.$('div'), '');
  });

  test("I see an error if I try to define styles in separate groups with the same name", async function(assert) {
    this.owner.register('component:styled-component', Component.extend(Styled, {
      styles: Object.freeze({
        sizes: group({
          medium: 'foo'
        }),
        weights: group({
          medium: 'bar'
        })
      })
    }));

    await assert.asyncThrows(() => {
      return render(hbs`
        {{styled-component}}
      `);
    }, `You defined two styles named 'medium' on 'component:styled-component'. Stylenames must be unique across all groups.`);
  });

  test("I see an error if I try to set a defaultStyle that doesn't have a definition", async function(assert) {
    this.owner.register('component:styled-component', Component.extend(Styled, {
      styles: Object.freeze({
        defaultStyle: 'large',

        sizes: group({
          small: 'foo',
          medium: 'bar'
        })
      })
    }));

    await assert.asyncThrows(() => {
      return render(hbs`
        {{styled-component}}
      `);
    }, `You set a default style named 'large' on 'component:styled-component', but that style was not defined.`);
  });

  test("I can pass in an object for a style definition", async function(assert) {
    this.owner.register('component:styled-component', Component.extend(Styled, {
      styles: Object.freeze({
        blue: {
          style: 'bg-blue'
        }
      })
    }));

    await render(hbs`
      {{styled-component style='blue'}}
    `);

    assertElementHasClasses(assert, this.$('div'), 'bg-blue');
  });

  test("I can set a tagName using a style definition object", async function(assert) {
    this.owner.register('component:styled-component', Component.extend(Styled, {
      styles: Object.freeze({
        medium: {
          tagName: 'h2'
        },
      })
    }));

    await render(hbs`
      {{styled-component style='medium'}}
    `);

    assertElementTagIs(assert, this.$('.ember-view'), 'h2');
  });

  test("I see an error if I try to update a style that changes the tagName", async function(assert) {
    this.owner.register('component:styled-component', Component.extend(Styled, {
      styles: Object.freeze({
        medium: {
          tagName: 'h2'
        },
      })
    }));

    await render(hbs`
      {{styled-component style='medium'}}
    `);

    assertElementTagIs(assert, this.$('.ember-view'), 'h2');
  });

  test("I see an error if two active styles try to set the tagName", async function(assert) {
    this.owner.register('component:styled-component', Component.extend(Styled, {
      styles: Object.freeze({
        medium: {
          tagName: 'h2'
        },
        large: {
          tagName: 'h2'
        },
      })
    }));

    await assert.asyncThrows(() => {
      return render(hbs`
        {{styled-component style='medium large'}}
      `);
    }, `You're rendering a 'component:styled-component' with an active style of 'large' that's setting the tagName, but the 'medium' style is already active and also setting the tagName.`);
  });

  // add test that defaultStyles are valid
  // add runtime check that styles passed in are actually defined
  // add test that styled asserts no class prop set on ui component
  // add test that styles are global unique names
});

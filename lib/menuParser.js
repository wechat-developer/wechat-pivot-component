function genSchema() {
  return [
    { x: 1, y: 5, name: '', type: '', url: '', key: '' },
    { x: 1, y: 4, name: '', type: '', url: '', key: '' },
    { x: 1, y: 3, name: '', type: '', url: '', key: '' },
    { x: 1, y: 2, name: '', type: '', url: '', key: '' },
    { x: 1, y: 1, name: '', type: '', url: '', key: '' },
    { x: 1, y: 0, name: '', type: '', url: '', key: '' },

    { x: 2, y: 5, name: '', type: '', url: '', key: '' },
    { x: 2, y: 4, name: '', type: '', url: '', key: '' },
    { x: 2, y: 3, name: '', type: '', url: '', key: '' },
    { x: 2, y: 2, name: '', type: '', url: '', key: '' },
    { x: 2, y: 1, name: '', type: '', url: '', key: '' },
    { x: 2, y: 0, name: '', type: '', url: '', key: '' },

    { x: 3, y: 5, name: '', type: '', url: '', key: '' },
    { x: 3, y: 4, name: '', type: '', url: '', key: '' },
    { x: 3, y: 3, name: '', type: '', url: '', key: '' },
    { x: 3, y: 2, name: '', type: '', url: '', key: '' },
    { x: 3, y: 1, name: '', type: '', url: '', key: '' },
    { x: 3, y: 0, name: '', type: '', url: '', key: '' },
  ];
}

module.exports.fromWechat = function fromWechat(menu) {
  console.assert(menu.button.length > 0, 'If this is the first time you creating the menu, just work from scratch. You don\'t have to download nothing.');

  var formatted = genSchema();

  menu.button.forEach(function (button, x) {
    x += 1;
    var idx = formatted.findIndex(function (m) { return m.x === x && m.y === 0; });

    if (button.sub_button.length === 0) {
      // ** only level 1 menu
      if (button.type === 'view') {
        formatted[idx] = { x: x, y: 0, name: button.name, type: button.type, url: button.url };
      } else if (button.type === 'click') {
        formatted[idx] = { x: x, y: 0, name: button.name, type: button.type, key: button.key };
      } else {
        throw new Error('[smartMenu.fromWeixin - NotImplementedError] button type shall be view/click');
      }
    } else {
      formatted[idx].name = button.name;
      formatted[idx].type = 'group';

      button.sub_button.reverse().forEach(function (sub, y) {
        y += 1;

        var index = formatted.findIndex(function (m) { return m.x === x && m.y === y; });
        if (sub.type === 'view') {
          formatted[index] = { x: x, y: y, name: sub.name, type: sub.type, url: sub.url };
        } else if (sub.type === 'click') {
          formatted[index] = { x: x, y: y, name: sub.name, type: sub.type, key: sub.key };
        } else {
          throw new Error('[smartMenu.fromWeixin - NotImplementedError] button type shall be view/click');
        }
      });
    }
  });

  return formatted;
}


module.exports.fromScratch = function fromScratch() {
  var menu = {
    button: [
      {
        name: '点击修改',
        sub_button: [
          { name: '点击修改', type: 'view', url: 'https://www.bing.com' },
        ],
      },
      {
        name: '点击修改',
        sub_button: [
          { name: '点击修改', type: 'view', url: 'https://www.bing.com' },
        ],
      },
      {
        name: '点击修改',
        sub_button: [
          { name: '点击修改', type: 'view', url: 'https://www.bing.com' },
        ],
      },
    ],
  };
  return fromWeixin(menu);
}


module.exports.toWechat = function toWechat(menus) {
  var button0 = menus.filter(function (m) { return m.x === 1 && m.y === 0; })[0];
  var group0 = menus.filter(function (m) { return m.x === 1 && m.y > 0 && m.name; });
  var sub0 = group0.map(function (m) { return m; });

  var button1 = menus.filter(function (m) { return m.x === 2 && m.y === 0; })[0];
  var group1 = menus.filter(function (m) { return m.x === 2 && m.y > 0 && m.name; });
  var sub1 = group1.map(function (m) { return m; });

  var button2 = menus.filter(function (m) { return m.x === 3 && m.y === 0; })[0];
  var group2 = menus.filter(function (m) { return m.x === 3 && m.y > 0 && m.name; });
  var sub2 = group2.map(function (m) { return m; });
  // debugger;

  var payload = [];

  // FIXME: other types
  if (button0.type === 'view') {
    payload.push({
      name: button0.name,
      type: button0.type,
      url: button0.url,
    });
  } else if (button0.type === 'click') {
    payload.push({
      name: button0.name,
      type: button0.type,
      key: button0.key,
    });
  } else {
    payload.push({
      name: button0.name,
      sub_button: sub0,
    });
  }

  if (button1.type === 'view') {
    payload.push({
      name: button1.name,
      type: button1.type,
      url: button1.url,
    });
  } else if (button1.type === 'click') {
    payload.push({
      name: button1.name,
      type: button1.type,
      key: button1.key,
    });
  } else {
    payload.push({
      name: button1.name,
      sub_button: sub1,
    });
  }

  if (button2.type === 'view') {
    payload.push({
      name: button2.name,
      type: button2.type,
      url: button2.url,
    });
  } if (button2.type === 'click') {
    payload.push({
      name: button2.name,
      type: button2.type,
      key: button2.key,
    });
  } else {
    payload.push({
      name: button2.name,
      sub_button: sub2,
    });
  }

  return {
    button: payload,
  };
}

const match = require('./match');

console.log(
  match(
    'div > img[src="http://www.baidu.com"]',
    {
      tagName: 'img',
      attributes: [
        { name: 'src', operator: '=', value: 'http://www.baidu.com' }
      ],
      parentNode: {
        tagName: 'div',
        attributes: [],
        parentNode: []
      }
    })
);

console.log(
  match(
    'div > img[src="http://www.baidu.com"]',
    {
      tagName: 'img',
      attributes: [
        { name: 'src', operator: '=', value: 'http://www.google.com' }
      ],
      parentNode: {
        tagName: 'div',
        attributes: [],
        parentNode: []
      }
    })
)

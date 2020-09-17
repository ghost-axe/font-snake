// const ddd = require('node-html-parser')
// const parse = ddd.parse
// const root = parse('<ul id="list"><li>Hello World</li></ul>');

// console.log(root.firstChild.structure);
// ul#list
//   li
//     #text

// console.log(root.querySelector('li'));
// { tagName: 'ul',
//   rawAttrs: 'id="list"',
//   childNodes:
//    [ { tagName: 'li',
//        rawAttrs: '',
//        childNodes: [Object],
//        classNames: [] } ],
//   id: 'list',
//   classNames: [] }
// console.log(root.toString());
// <ul id="list"><li>Hello World</li></ul>
// root.set_content('<li>Hello World</li>');
// root.toString();	// <li>Hello World</li>


// var css2json = require('css2json');
// const less = require('less')
//
// var lessStr = `
// @theme-color: #fff;
//   .list-box {
//     margin: 0 15px;
//     .item {
//       background: #fff;
//       border-radius: 10px;
//       margin-bottom: 12px;
//       padding: 10px 0 14px;
//       .item-info {
//         padding: 0 15px 0 6.5px;
//       }
//       .item-logo {
//         width: 37px;
//         height: 37px;
//         float: left;
//         margin-right: 6px;
//       }
//       .item-name {
//         line-height: 37px;
//         color: @theme-color;
//         font-size: 16px;
//         font-weight: 600;
//       }
//       .item-status {
//         font-size: 15px;
//         font-weight: 600;
//         &.s1 {
//           color: #FF9E2B;
//         }
//         &.s2 {
//           color: @theme-color;
//         }
//         &.s3 {
//           color: #469F4C;
//         }
//         &.s4 {
//           color: #999999;
//         }
//       }
//       .item-des {
//         color: #666666;
//         font-size: 13px;
//         line-height: 1em;
//         margin-top: 12px;
//         padding: 0 15px;
//         span {
//           color: #111;
//           font-weight: 600;
//         }
//       }
//     }
//   }
// `

// var json = le(css);
//
// console.log(json)
// less.render(lessStr)
//   .then(
//     function(output) {
//       console.log(output, '...........................////////////////////////////////////')
//       let css = css2json(output.css)
//       console.log(css)
//     },
//     function(error) {
//       console.log(error)
//     }
//   );


// console.log(le)

const mapDir = require('./look')
mapDir(
  './src',
  function(file) {
    console.log(file)
    // console.log('TCL: file', file.toString())
    // 读取文件后的处理
  },
  function() {
    // console.log('xxx文件目录遍历完了')
  }
)

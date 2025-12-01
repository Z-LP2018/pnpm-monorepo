// 1. 定义我们支持的原子类及其对应的 CSS
const utilities = {
  'safe-b': { 'padding-bottom': 'calc(env(safe-area-inset-bottom))' },
  'safe-t': { 'padding-top': 'calc(env(safe-area-inset-top))' },
  'safe-l': { 'padding-left': 'calc(env(safe-area-inset-left))' },
  'safe-r': { 'padding-right': 'calc(env(safe-area-inset-right))' },
  safe: {
    padding:
      'calc(env(safe-area-inset-bottom)) calc(env(safe-area-inset-right)) calc(env(safe-area-inset-top)) calc(env(safe-area-inset-left))',
  },
  'my-overflow': { 'white-space': 'nowrap', overflow: 'hidden', 'text-overflow': 'ellipsis' },
  'my-overflow-1': {
    display: '-webkit-box',
    overflow: 'hidden',
    '-webkit-box-orient': 'vertical',
    '-webkit-line-clamp': '1',
  },
  'my-overflow-2': {
    display: '-webkit-box',
    overflow: 'hidden',
    '-webkit-box-orient': 'vertical',
    '-webkit-line-clamp': '2',
  },
  'my-overflow-3': {
    display: '-webkit-box',
    overflow: 'hidden',
    '-webkit-box-orient': 'vertical',
    '-webkit-line-clamp': '3',
  },
} as Record<string, any>
// 2. 引擎的核心功能：根据类名生成 CSS
export function generateCss(classNames: string[]) {
  let finalCss = ''
  // 遍历所有从代码中提取到的类名
  for (const className of classNames) {
    // 如果我们的定义库里有这个类
    if (utilities[className]) {
      // 生成 CSS 规则
      finalCss += `.${className} {\n`
      const rules = utilities[className]
      for (const prop in rules) {
        finalCss += `  ${prop}: ${rules[prop]};\n`
      }
      finalCss += `}\n\n`
    }
  }
  return finalCss
}

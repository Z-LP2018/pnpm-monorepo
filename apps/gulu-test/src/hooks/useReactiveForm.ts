import { Validator, validate } from 'class-validator'
import { reactive } from 'vue'

// 自定义类装饰器 Reactive
export function Reactive<T extends { new (...args: any[]): {} }>(my_constructor: T) {
  return class extends my_constructor {
    constructor(...args: any[]) {
      super(...args)
      //把类的实例变成响应式的
      return reactive(this) //返回的是对象，该对象会覆盖constructor返回的对象实例
    }
  }
}

/**
 * 自定义表单异常
 * @constructor （message）自定义异常
 */
export class FormException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FormException'
  }
}
/**
 * 初始化监听异常的方法
 */
export const exceptionInterceptor = () => {
  window.addEventListener('error', function (event) {
    if (event.error instanceof FormException) {
      console.warn(event.error.message)
    }
  })
  window.addEventListener('unhandledrejection', event => {
    const { reason } = event
    if (reason instanceof FormException) {
      console.warn(reason.message)
    }
  })
}

//将它的子类用@Reactive变成响应式的类，就可以使用这些方法给响应式对象赋值了
export class FormValidator extends Validator {
  [key: string]: any

  //初始化
  init<T extends Record<string, any>>(form: T) {
    for (const key in form) {
      if (Object.prototype.hasOwnProperty.call(this, key)) {
        this[key] = form[key] as any
      }
    }
  }

  //重置各个属性的值
  reset() {
    const instance = Reflect.construct(this.constructor, [])
    const keys = Object.keys(instance)
    keys.forEach(key => {
      this[key] = instance[key]
    })
  }

  //表单提交
  submit(): Promise<this> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async resolve => {
      const err = await validate(this)
      if (err.length > 0) {
        //需要配合class-validator中的验证注解使用，str为验证失败的提示信息
        const str = Object.values(err[0]!.constraints!)[0]
        throw new FormException(str || '')
      }
      resolve(this)
    })
  }
}

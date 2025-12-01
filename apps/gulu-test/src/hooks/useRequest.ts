import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'

// 1. 后台返回类型
interface BaseResponse<T = any> {
  data: T
  code: number
  msg: string
}

// 2. 错误码
enum ErrorCode {
  SUCCESS = 200,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
}

interface CustomRequestConfig extends AxiosRequestConfig {
  retryCount?: number //重试次数，默认0，(✅每次请求都需要传递)
  refreshTokenUrl?: string //刷新token的url，默认'/auth/refresh'
  concurrentNumber?: number //同时最大请求数量，默认5
  isRefreshTokenRequest?: boolean // 标记刷新token请求，避免重试和拦截器干扰
}

// 3. 配置管理
type Environment = 'development' | 'production'
enum BaseUrl {
  development = '/api',
  production = 'https://127.0.0.1:8080',
}
const config = {
  baseURL: BaseUrl[process.env.NODE_ENV as Environment],
  timeout: 50000,
} as const

// 请求队列项接口
interface QueueItem {
  config: CustomRequestConfig
  resolve: (value: any) => void
  reject: (reason?: any) => void
}

class Request {
  private instance: AxiosInstance
  private refreshTokenUrl: string //请求刷新token的url
  private concurrentNumber: number //同时最大请求数量
  private processingCount = 0 //当前正在处理的请求数量
  private queue: QueueItem[] = [] // 请求超过最大请求数后，放入请求队列
  private isRefreshing = false // 是否正在刷新token
  private refreshSubscribers: (() => void)[] = [] // 刷新token期间的请求订阅者

  constructor(config: CustomRequestConfig) {
    this.concurrentNumber = config.concurrentNumber ?? 5
    this.refreshTokenUrl = config.refreshTokenUrl ?? '/auth/refresh' // ✅ 默认值
    this.instance = axios.create(config)
    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    this.setupRequestInterceptors()
    this.setupResponseInterceptors()
  }

  // 请求拦截
  private setupRequestInterceptors(): void {
    this.instance.interceptors.request.use(
      config => {
        const token = localStorage.getItem('token')
        if (!config.headers) {
          config.headers = {} as any
        }
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      error => {
        return Promise.reject(error)
      }
    )
  }

  // 响应拦截
  private setupResponseInterceptors(): void {
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        const data = response.data
        // 根据业务代码处理
        if (data.code !== ErrorCode.SUCCESS) {
          if (data.code === ErrorCode.UNAUTHORIZED) {
            return this.handleUnauthorized(response.config)
          } else if (data.code === ErrorCode.FORBIDDEN) {
            return Promise.reject(new Error('权限不足'))
          } else {
            this.showErrorTip(data.msg)
            return Promise.reject(new Error('请求出错'))
          }
        }
        return response
      },
      error => {
        // 网络错误或服务器错误处理
        if (error.response) {
          const { status, config } = error.response
          if (status === ErrorCode.UNAUTHORIZED) {
            return this.handleUnauthorized(config as CustomRequestConfig)
          } else if (status === ErrorCode.FORBIDDEN) {
            return Promise.reject(error)
          } else {
            this.showErrorTip(`请求出错，${status}`)
            return Promise.reject(new Error('请求出错'))
          }
        }
        // 其他错误进行重试
        return this.handleRetry(error.config as CustomRequestConfig, error)
      }
    )
  }

  // 请求出错的时候给的提示(✅最好从外部引入)
  showErrorTip(msg: string) {
    alert(msg)
  }
  // 处理未授权（刷新token的请求应该在config上加isRefreshTokenRequest字段标识）
  private async handleUnauthorized(config: CustomRequestConfig): Promise<any> {
    // 如果是刷新token的请求本身失败，直接跳转登录
    if (config.isRefreshTokenRequest) {
      this.clearTokenAndRedirect()
      return Promise.reject(new Error('刷新token失败'))
    }
    // 如果正在刷新token，将请求加入订阅队列并等待返回
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        const waitingRequest = () => {
          this.instance.request(config).then(resolve).catch(reject)
        }
        this.refreshSubscribers.push(waitingRequest)
      })
    }

    this.isRefreshing = true

    try {
      // 刷新token
      const newToken = await this.refreshToken()
      // 更新本地存储的token
      localStorage.setItem('token', newToken)
      // 执行所有等待的请求
      this.refreshSubscribers.forEach(callback => callback())
      this.refreshSubscribers = []
      return this.instance.request(config)
    } catch (error) {
      // 刷新token失败，清空所有等待的请求
      this.refreshSubscribers = []
      this.clearTokenAndRedirect()
      return Promise.reject(error)
    } finally {
      this.isRefreshing = false
    }
  }

  // 处理重试
  private async handleRetry(config: CustomRequestConfig, error: any): Promise<any> {
    const currentRetry = (config as any)._retryCount || 0
    const retryCount = config.retryCount || 0
    if (currentRetry < retryCount) {
      // 增加重试计数
      ;(config as any)._retryCount = currentRetry + 1

      // 指数退避策略
      const delay = Math.pow(2, currentRetry) * 1000

      return new Promise(resolve => {
        setTimeout(() => {
          console.log(`请求重试 ${currentRetry + 1}/${retryCount}:`, config.url)
          resolve(this.instance.request(config))
        }, delay)
      })
    }

    return Promise.reject(error)
  }

  // 双token刷新机制
  private async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem('refreshToken')

    if (!refreshToken) {
      throw new Error('没有可用的刷新token')
    }

    try {
      const response = await this.request({
        url: this.refreshTokenUrl,
        method: 'POST',
        data: { refreshToken },
        isRefreshTokenRequest: true,
      })

      if (response.code === ErrorCode.SUCCESS) {
        return response.data.token
      } else {
        throw new Error(response.msg || '刷新token失败')
      }
    } catch (error) {
      // 刷新token失败，清除所有token
      this.clearTokenAndRedirect()
      throw error
    }
  }

  // 清除token并跳转登录(✅最好从外部引入)
  private clearTokenAndRedirect(): void {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    // 跳转到登录页
    window.location.href = '/login'
  }

  private async realRequest({ config, resolve, reject }: QueueItem) {
    try {
      const response = await this.instance.request(config)
      resolve(response.data)
    } catch (error) {
      reject(error)
    } finally {
      this.processingCount--
      // 处理队列中的下一个请求
      if (this.queue.length > 0) {
        const next = this.queue.shift()!
        this.processingCount++
        this.realRequest(next)
      }
    }
  }
  // 增强请求方法，支持更多配置
  public async request<T = any>(config: CustomRequestConfig): Promise<BaseResponse<T>> {
    if (this.processingCount > this.concurrentNumber) {
      return new Promise((resolve, reject) => {
        this.queue.push({ config, resolve, reject })
      })
    } else {
      this.processingCount++
      return new Promise((resolve, reject) => {
        this.realRequest({ config, resolve, reject })
      })
    }
  }

  // 提供获取实例的方法，用于特殊场景
  public getInstance(): AxiosInstance {
    return this.instance
  }
}

// 单例模式创建请求实例
const createRequestInstance = (() => {
  return new Request(config)
})()

// 封装常用的 HTTP 方法
const useGet = <T = any>(url: string, params?: any, config?: CustomRequestConfig) => {
  return createRequestInstance.request<T>({
    url,
    params,
    method: 'GET',
    ...config,
  })
}

const usePost = <T = any>(url: string, data?: any, config?: CustomRequestConfig) => {
  return createRequestInstance.request<T>({
    url,
    data,
    method: 'POST',
    ...config,
  })
}

const usePut = <T = any>(url: string, data?: any, config?: CustomRequestConfig) => {
  return createRequestInstance.request<T>({
    url,
    data,
    method: 'PUT',
    ...config,
  })
}

const useDelete = <T = any>(url: string, params?: any, config?: CustomRequestConfig) => {
  return createRequestInstance.request<T>({
    url,
    params,
    method: 'DELETE',
    ...config,
  })
}

// 导出实例和所有方法
export { createRequestInstance as useBaseRequest, useDelete, useGet, usePost, usePut }

// 默认导出实例
export default createRequestInstance

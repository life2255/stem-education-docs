export function useDebounceFn<T extends (...args: any[]) => any>(
    fn: T,
    delay: number = 300
  ): T {
    let timeoutId: NodeJS.Timeout | null = null

    return ((...args: Parameters<T>) => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      timeoutId = setTimeout(() => {
        fn(...args)
        timeoutId = null
      }, delay)
    }) as T
  }
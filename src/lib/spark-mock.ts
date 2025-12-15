declare global {
  interface Window {
    spark: any;
  }
}

if (typeof window !== 'undefined') {
  (window as any).spark = (window as any).spark || {};
  
  if (!(window as any).spark.kv) {
    (window as any).spark.kv = {
      keys: async () => [],
      get: async () => undefined,
      set: async () => {},
      delete: async () => {}
    };
  }
  
  if (!(window as any).spark.llmPrompt) {
    (window as any).spark.llmPrompt = (strings: string[], ...values: any[]) => {
      return strings.reduce((acc: string, str: string, i: number) => acc + str + (values[i] || ''), '');
    };
  }
  
  if (!(window as any).spark.llm) {
    (window as any).spark.llm = async () => '{}';
  }
  
  if (!(window as any).spark.user) {
    (window as any).spark.user = async () => ({
      avatarUrl: '',
      email: '',
      id: '',
      isOwner: false,
      login: ''
    });
  }
}

export {};

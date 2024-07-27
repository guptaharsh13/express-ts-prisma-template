import axios, { type AxiosRequestConfig } from 'axios';

const sleep = async (ms: number) =>
  await new Promise((resolve) => setTimeout(resolve, ms));

interface RetryConfig {
  incrementMultiple: 1 | 2;
  initialDelay: number;
  maxRetries: number;
}

const defaultRetryConfig: RetryConfig = {
  incrementMultiple: 2,
  initialDelay: 5000,
  maxRetries: 6,
};

async function retryRequest(
  method: 'GET' | 'POST',
  url: string,
  config: AxiosRequestConfig = {},
  retryConfig: RetryConfig,
  body?: unknown,
  currentRetry: number = 0,
): Promise<any> {
  try {
    if (currentRetry !== 0) {
      if (config.headers != null) console.debug(JSON.stringify(config.headers));
      console.debug(
        `${method} request to ${url} in ${
          retryConfig.initialDelay / 1000
        } seconds`,
      );
      await sleep(retryConfig.initialDelay);
    }

    const response =
      method === 'GET'
        ? await axios.get(url, config)
        : await axios.post(url, body, config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && currentRetry < retryConfig.maxRetries) {
      return await retryRequest(
        method,
        url,
        config,
        {
          ...retryConfig,
          initialDelay:
            currentRetry === 0
              ? retryConfig.initialDelay
              : retryConfig.initialDelay * retryConfig.incrementMultiple,
        },
        body,
        currentRetry + 1,
      );
    }

    throw error;
  }
}

const request = {
  async GET(
    url: string,
    config: AxiosRequestConfig = {},
    retryConfig: RetryConfig = defaultRetryConfig,
  ) {
    return await retryRequest('GET', url, config, retryConfig);
  },

  async POST(
    url: string,
    body: unknown,
    config: AxiosRequestConfig = {},
    retryConfig: RetryConfig = defaultRetryConfig,
  ) {
    return await retryRequest('POST', url, config, retryConfig, body);
  },
};

export default request;

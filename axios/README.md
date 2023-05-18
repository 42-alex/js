# Axios Notes

## Sources for learning

* https://axios-http.com/

---

### Api call with config

#### Vanilla JS

```
export const callExternalApi = async (options) => {
  try {
    const response = await axios(options.config);
    return {
      data: response.data,
      error: null,
    };
  } catch (error) {
    let message = "HTTP request failed";

    if (axios.isAxiosError(error)) {
      const { response } = error;
      if (response && response.statusText) {
        message = response.statusText;
      }
      if (response && response.data && response.data.message) {
        message = response.data.message;
      }
    } else {
      message = error.message;
    }

    return {
      data: null,
      error: { message },
    };
  }
};

// Example usage:
const config = {
  url: `${apiServerUrl}/api/messages/public`,
  method: "GET",
  headers: {
    "content-type": "application/json",
  },
};

callExternalApi({ config });
```

#### Typescript

```
import axios, { AxiosError, AxiosResponse } from 'axios';

const apiServerUrl: string = 'https://example.com'; // Replace with the actual API server URL

interface ApiResponse {
  data: any | null;
  error: { message: string } | null;
}

interface ApiConfig {
  url: string;
  method: string;
  headers: Record<string, string>;
}

interface ApiOptions {
  config: ApiConfig;
  [key: string]: any;
}

export const callExternalApi = async (options: ApiOptions): Promise<ApiResponse> => {
  const { config, ...otherOptions } = options;

  try {
    const response: AxiosResponse = await axios(config);
    return {
      data: response.data,
      error: null,
    };
  } catch (error: unknown) {
    let message: string = 'HTTP request failed';

    if (axios.isAxiosError(error)) {
      const axiosError: AxiosError = error;

      const { response } = axiosError;

      if (response && response.statusText) {
        message = response.statusText;
      }

      if (response && response.data && response.data.message) {
        message = response.data.message;
      }
    } else if (error instanceof Error) {
      message = error.message;
    }

    return {
      data: null,
      error: {
        message,
      },
    };
  }
};

// Example usage:
const config: ApiConfig = {
  url: `${apiServerUrl}/api/messages/public`,
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
};

callExternalApi({ config, additionalProperty: 'value' });


```

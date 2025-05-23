import axios from 'axios';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface TestResponse {
  message: string;
  user?: any;
}

export const testApi = async (): Promise<ApiResponse<any>> => {
  try {
    // Test public endpoint
    const publicTest = await axios.get<TestResponse>('http://localhost:5000/api/admin/test');
    console.log('Public test endpoint:', publicTest.data);

    // Test authenticated endpoint
    const token = localStorage.getItem('adminToken');
    const authTest = await axios.get<TestResponse>('http://localhost:5000/api/admin/test-auth', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Authenticated test endpoint:', authTest.data);

    // Test coaches endpoint
    const coaches = await axios.get('http://localhost:5000/api/admin/coaches', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Coaches endpoint:', coaches.data);

    return { success: true, data: coaches.data };
  } catch (error: any) {
    console.error('API test error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

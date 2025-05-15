export const BASE_URL = 'http://77.37.121.137:3000';

export const headers = {
  'Content-Type': 'application/json',
};

export const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
}; 
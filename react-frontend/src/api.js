import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

const getData = async (endpoint, params = {}) => {
    try {
        endpoint = "get-shortest-path";
        const url = `${API_URL}${endpoint}/`;
  
      const response = await axios.get(url, { params });
  
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };
  

export default getData;

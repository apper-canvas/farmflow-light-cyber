import { getApperClient } from "@/services/apperClient";

const weatherService = {
  async getForecast() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");
      
      const response = await apperClient.fetchRecords("weather_c", {
        fields: [
          { field: { Name: "date_c" } },
          { field: { Name: "temperature_c" } },
          { field: { Name: "condition_c" } },
          { field: { Name: "precipitation_c" } },
          { field: { Name: "humidity_c" } }
        ],
        orderBy: [{
          fieldName: "date_c",
          sorttype: "ASC"
        }]
      });
      
      if (!response?.success) {
        console.error("Error fetching weather forecast:", response?.message);
        return [];
      }
      
      return (response.data || []).map(record => ({
        ...record,
        date: record.date_c,
        condition: record.condition_c,
        precipitation: record.precipitation_c,
        humidity: record.humidity_c,
        temperature: parseTemperatureObject(record.temperature_c)
      }));
    } catch (error) {
      console.error("Error in weatherService.getForecast:", error);
      return [];
    }
  },

  async getCurrentWeather() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");
      
      const response = await apperClient.fetchRecords("weather_c", {
        fields: [
          { field: { Name: "date_c" } },
          { field: { Name: "temperature_c" } },
          { field: { Name: "condition_c" } },
          { field: { Name: "precipitation_c" } },
          { field: { Name: "humidity_c" } }
        ],
        orderBy: [{
          fieldName: "date_c",
          sorttype: "DESC"
        }],
        pagingInfo: {
          limit: 1,
          offset: 0
        }
      });
      
      if (!response?.success) {
        console.error("Error fetching current weather:", response?.message);
        return null;
      }
      
      const record = response.data?.[0];
      if (!record) return null;
      
      return {
        ...record,
        date: record.date_c,
        condition: record.condition_c,
        precipitation: record.precipitation_c,
        humidity: record.humidity_c,
        temperature: parseTemperatureObject(record.temperature_c)
      };
    } catch (error) {
      console.error("Error in weatherService.getCurrentWeather:", error);
      return null;
    }
  }
};

function parseTemperatureObject(tempStr) {
  try {
    if (typeof tempStr === 'object') return tempStr;
    if (typeof tempStr === 'string') {
      return JSON.parse(tempStr);
    }
    return { high: 70, low: 50 };
  } catch (error) {
    console.error("Error parsing temperature:", error);
    return { high: 70, low: 50 };
  }
}

export default weatherService;
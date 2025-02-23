import { Router, Request, Response } from 'express';
const router = Router();
import WeatherService from '../../service/weatherService.js';
import HistoryService from '../../service/historyService.js';


// class LocalWeatherService {
//   // existing methods and properties

//   static async getWeatherForCity(cityName: string): Promise<any> {
//     // Implementation to get weather data for the city
//     // This is a placeholder implementation
//     return { cityName, weather: 'sunny' };
//   }
// }

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  console.log(req.body);
  // TODO: GET weather data from city name
  let weatherData = await WeatherService.getWeatherForCity(req.body.cityName);
  // TODO: save city to search history
  // await HistoryService.addCity(req.body.cityName);


  res.json(weatherData);
});

// TODO: GET search history
router.get('/history', async (req: Request, res: Response) => {
  console.log(req.body);
  // Placeholder response for search history
  res.status(200).json({ message: 'Search history retrieved' });

  // use HistoryService to get search history
  // const history = await HistoryService.getCities();
  // res.json(history);
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  console.log(req.body);
  // Placeholder response for delete operation
  res.status(200).json({ message: 'City deleted from search history' });
});

export default router;

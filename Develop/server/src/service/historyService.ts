import * as fs from 'fs';

// TODO: Define a City class with name and id properties
class City {
  constructor(
    public name: string,
    public id: string
  ) {}
}
// TODO: Complete the HistoryService class
class HistoryService {
   private cities: City[] = [];
   
  // Define a read method that reads from the searchHistory.json file
  private async read(): Promise<void> {
    const data = await fs.promises.readFile('searchHistory.json', 'utf-8');
    this.cities = JSON.parse(data);
  }

  // Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(): Promise<void> {
    const data = JSON.stringify(this.cities, null, 2);
    await fs.promises.writeFile('searchHistory.json', data, 'utf-8');
  }

  // Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    await this.read();
    return this.cities;
  }

  // Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: City): Promise<void> {
    await this.read();
    this.cities.push(city);
    await this.write();
  }

  // BONUS: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string): Promise<void> {
    await this.read();
    this.cities = this.cities.filter(city => city.id !== id);
    await this.write();
  }
}

// Export an instance of the HistoryService class
export default new HistoryService();

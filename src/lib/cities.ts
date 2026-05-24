/** Major cities across India, used by every city selector in the app. */
export const INDIA_CITIES: string[] = [
  'Agra', 'Ahmedabad', 'Ajmer', 'Aligarh', 'Allahabad (Prayagraj)', 'Amravati', 'Amritsar', 'Aurangabad',
  'Bangalore', 'Bareilly', 'Belgaum', 'Bhavnagar', 'Bhilai', 'Bhopal', 'Bhubaneswar', 'Bikaner',
  'Bilaspur', 'Bokaro', 'Chandigarh', 'Chennai', 'Coimbatore', 'Cuttack', 'Dehradun', 'Delhi',
  'Dhanbad', 'Durgapur', 'Erode', 'Faridabad', 'Firozabad', 'Ghaziabad', 'Goa (Panaji)', 'Gorakhpur',
  'Greater Noida', 'Gulbarga', 'Guntur', 'Gurugram (Gurgaon)', 'Guwahati', 'Gwalior', 'Haora (Howrah)',
  'Hubli-Dharwad', 'Hyderabad', 'Imphal', 'Indore', 'Jabalpur', 'Jaipur', 'Jalandhar', 'Jammu',
  'Jamnagar', 'Jamshedpur', 'Jhansi', 'Jodhpur', 'Kakinada', 'Kanpur', 'Kochi (Cochin)', 'Kolhapur',
  'Kolkata', 'Kollam', 'Kota', 'Kozhikode (Calicut)', 'Lucknow', 'Ludhiana', 'Madurai', 'Mangalore',
  'Meerut', 'Moradabad', 'Mumbai', 'Mysore (Mysuru)', 'Nagpur', 'Nanded', 'Nashik', 'Navi Mumbai',
  'Nellore', 'New Delhi', 'Noida', 'Patna', 'Puducherry', 'Pune', 'Raipur', 'Rajkot', 'Ranchi',
  'Rourkela', 'Saharanpur', 'Salem', 'Sangli', 'Shimla', 'Siliguri', 'Solapur', 'Srinagar', 'Surat',
  'Thane', 'Thiruvananthapuram', 'Thrissur', 'Tiruchirappalli (Trichy)', 'Tirunelveli', 'Tirupati',
  'Tiruppur', 'Udaipur', 'Ujjain', 'Vadodara (Baroda)', 'Varanasi (Banaras)', 'Vasai-Virar',
  'Vijayawada', 'Visakhapatnam (Vizag)', 'Warangal',
];

/** Approx coordinates [lng, lat] for the cities that have donor/hospital data.
 *  Others fall back to same-city matching in the match engine. */
export const CITY_COORDS: Record<string, [number, number]> = {
  Mumbai: [72.8777, 19.076], Delhi: [77.209, 28.6139], 'New Delhi': [77.209, 28.6139],
  Bangalore: [77.5946, 12.9716], Chennai: [80.2707, 13.0827], Pune: [73.8567, 18.5204],
  Hyderabad: [78.4867, 17.385], Kolkata: [88.3639, 22.5726], Indore: [75.8577, 22.7196],
  Ahmedabad: [72.5714, 23.0225], Jaipur: [75.7873, 26.9124], Lucknow: [80.9462, 26.8467],
  Surat: [72.8311, 21.1702], Nagpur: [79.0882, 21.1458], Kanpur: [80.3319, 26.4499],
  Patna: [85.1376, 25.5941], Bhopal: [77.4126, 23.2599],
};

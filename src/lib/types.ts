
// Represents the data needed to create a new car listing
export type CreateCarType = {
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  description: string;
  color: string;
  fuel_type: string;
  transmission: string;
  image: string;
};

// Represents the data to update an existing car listing
// 'id' should be required to identify which car to update
export type UpdateCarType = CreateCarType & {
  id: string; // required for update
};

// User login credentials
export type LoginData = {
  email: string;
  password: string;
};

// Data required to sign up a new user
export type SignupData = {
  username: string;
  email: string;
  password: string;
  confirmed_password: string;
};

// Response returned by login/signup endpoints
export type LoginResponse = {
  token?: string;
  access_token?: string;
  accessToken?: string;
  authToken?: string;
  refreshToken?: string;
  refresh_token?: string;
  user?: any;
  message?: string;
};

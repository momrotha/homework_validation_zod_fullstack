
export type CreateCarType = {
  make: string;
  model: string;
  year: number;
  price: number;
  description: string;
  color: string;
  image: string;
};

export type UpdateCarType = CreateCarType & {
  id: string; 
};


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

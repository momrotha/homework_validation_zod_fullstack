

export type CarResponseType = {
    make: string,
    model: string,
    year: number,
    // color: string,
    price: number,
    description : string, 
    image : string
}
export type CarCreateType = {
  make: string,
  model: string,
  year: number,
  price: number,
  mileage: number,
  description: string,
  color: string,
  fuel_type: string,
  transmission: string,
  image: string
}

export type CarUpdateType = {
  make: string,
  model: string,
  year: number,
  price: number,
  mileage: number,
  description: string,
  color: string,
  fuel_type: string,
  transmission: string,
  image: string,
  is_sold: boolean
}

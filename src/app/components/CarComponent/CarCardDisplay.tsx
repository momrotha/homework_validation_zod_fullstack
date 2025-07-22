"use client";
import { useGetCarsQuery } from "@/redux/service/car/car";
import { CardCarousel } from "@/components/ui/card-carousel";

export default function CarCardDisplay() {
//    declare data, isLoading, isFetching, error 
const {data, isFetching,isLoading,error} = useGetCarsQuery({
    page: 1,
    limit: 4
}); //calling hook to apply with specifics task 

   console.log(error);
   console.log(isLoading);
   console.log(isFetching);

   const images =
     data?.map(item => ({
       src: item.image?.startsWith('http') ? item.image : `https://car-nextjs-api.cheatdev.online/${item.image}`,
       alt: item.make
     })) ?? [];

  return (

    <div>
     <CardCarousel
        images={images}
        autoplayDelay={2000}
        showPagination={true}
        showNavigation={true}
      />
    </div>
  )
}
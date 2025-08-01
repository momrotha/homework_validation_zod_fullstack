

"use client"
import { Provider } from 'react-redux';
import { makeStore,AppStore } from '@/redux/store';
import React, { useRef } from 'react';

export default function StoreProvider({
     children 
    }: { 
        children: React.ReactNode 
    }) 
    {

        const storeRef = useRef<AppStore>(undefined)
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()
  }

  return <Provider store={storeRef.current}>{children}</Provider>

}
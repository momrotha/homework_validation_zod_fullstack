"use client"

import { error } from 'console';
import { useForm } from 'react-hook-form'

export default function FormComponent() {
    const { register, handleSubmit,formState:{errors},reset} = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: ""
        },
        mode:"onSubmit",
    });
    

    // const onSubmit = (data) => {
    //     console.log(data);
    //     reset();
    // };

    return (
        <div className='p-4 m-2 '>
            <form onSubmit={handleSubmit(console.log)} className='p-3 bg-gray-100 rounded-lg shadow-md w-full max-w-md'>
                <label htmlFor="firstName">First Name</label>
                <input className='border rounded-2xl p-2 mb-2 w-full' type="text" id="firstName" {...register("firstName")} placeholder="Enter your first name" />

                <label htmlFor="lastName">Last Name</label>
                <input className='border rounded-2xl p-2 mb-2 w-full' type="text" id="lastName" {...register("lastName")} placeholder="Enter your last name" />

                <label htmlFor="email">Email</label>
                <input className='border rounded-2xl p-2 mb-2 w-full' type="email" id="email" {...register("email")} placeholder="Enter your email" />

                <label htmlFor="password">Password</label>
                <input className='border rounded-2xl p-2 mb-2 w-full' type="password" id="password" {...register("password")} placeholder="Enter your password" />

                <label htmlFor="confirmPassword">Confirm Password</label>
                <input className='border rounded-2xl p-2 mb-2 w-full' type="password" id="confirmPassword" {...register("confirmPassword")} placeholder="Confirm your password" />

                {
                    errors.confirmPassword && <p> {errors.confirmPassword.message} </p>
                }

                <button onClick={()=>reset()} className='border rounded-2xl bg-blue-400 p-2 mb-2 w-full text-white font-semibold' type="submit">
                    Submit
                </button>
            </form>
        </div>
    )
}


"use client"

export default function DashboardPage() {

    

     // Get access token from cookie
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
        return null;
      };

      const accessToken = getCookie('accessToken');
      console.log("accessToken: ", accessToken);

  return (
    <div>
        This is dashboard page
    </div>
  )
}

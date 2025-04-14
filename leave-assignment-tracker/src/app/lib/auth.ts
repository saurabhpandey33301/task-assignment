// src/lib/auth.ts
export const login = async (email: string, password: string) => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  
    if (!res.ok) return null;
    const data = await res.json();
    return data.user;
  };
  
  export const getUserById = async (id: string) => {
    const res = await fetch(`/api/user/${id}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.user;
  };
  
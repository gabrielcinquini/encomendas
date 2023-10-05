"use client";

import Header from "@/components/Home/Header";
import { useMe } from "@/hooks/useMe";
import React from "react";
import Dashboard from "@/components/Home/Dashboard";

export default function Home() {
  const { user } = useMe();
  if(!user) return <p>Loading...</p>

  return (
    <div className="h-screen">
      <Header user={user}/>
      <Dashboard user={user}/>
    </div>
  );
}

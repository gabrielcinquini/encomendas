"use client";

import Header from "@/components/Home/Header";
import { useMe } from "@/hooks/useMe";
import React, { useEffect, useState } from "react";
import Dashboard from "@/components/Home/Dashboard";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, setUser, isLoading, setIsLoading } = useMe();
  const router = useRouter();

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="h-screen">
          <Header />
          <Dashboard />
        </div>
      )}
    </>
  );
}

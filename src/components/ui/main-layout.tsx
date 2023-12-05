"use client";
import Div100vh from "react-div-100vh";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Div100vh className="grid justify-between grid-cols-1 grid-rows-6">
      {children}
    </Div100vh>
  );
}

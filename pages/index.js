import React from "react";
import Layout from "@/components/common/Layout";
import StandardForm from "@/components/forms/StandardForm";

export default function Home() {
  return (
    <Layout>
      <main className="landing text-slate-50">
        <h1>Home</h1>
        <StandardForm />
      </main>
    </Layout>
  );
}
